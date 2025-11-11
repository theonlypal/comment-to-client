import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendInstagramDm } from '@/lib/instagram';
import { logInfo, logError, logWarn } from '@/lib/logging';

/**
 * Verifies Meta webhook signature using HMAC SHA256
 */
function verifyMetaSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) {
    logError('Missing X-Hub-Signature-256 header');
    return false;
  }

  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    logError('META_APP_SECRET not set');
    return false;
  }

  // Extract hash from "sha256=<hash>" format
  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') {
    logError('Invalid signature format');
    return false;
  }

  const receivedHash = parts[1];

  // Compute expected signature
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedHash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch (error) {
    logError('Signature comparison failed', error);
    return false;
  }
}

/**
 * GET handler for webhook verification
 * Meta sends a GET request during webhook setup
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  logInfo('Webhook verification attempt', { mode, hasToken: !!token });

  const verifyToken = process.env.META_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    logInfo('Webhook verification successful');
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  logError('Webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * POST handler for webhook events
 * Receives Instagram comment notifications and sends DMs
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    logInfo('Webhook POST received', {
      hasSignature: !!signature,
      bodyLength: rawBody.length,
    });

    // 2. Verify signature
    if (!verifyMetaSignature(rawBody, signature)) {
      logError('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    logInfo('Webhook signature verified');

    // 3. Parse JSON payload
    const payload = JSON.parse(rawBody);

    // 4. Validate payload structure
    if (!payload.object || !payload.entry) {
      logError('Invalid payload structure', payload);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 5. Process each entry
    for (const entry of payload.entry) {
      const changes = entry.changes || [];

      for (const change of changes) {
        // Only process comment changes
        if (change.field !== 'comments') {
          continue;
        }

        const value = change.value;

        // Extract comment data
        const commentText = value.text || '';
        const igUserId = value.from?.id;
        const igUsername = value.from?.username;
        const commentId = value.id;
        const mediaId = value.media?.id;

        if (!igUserId || !igUsername) {
          logWarn('Missing user data in comment', value);
          continue;
        }

        logInfo('Processing comment', {
          igUserId,
          igUsername,
          commentText: commentText.substring(0, 50),
          commentId,
          mediaId,
        });

        // Build signup URL with query parameters
        const baseUrl = process.env.PUBLIC_APP_BASE_URL;
        if (!baseUrl) {
          logError('PUBLIC_APP_BASE_URL not set');
          continue;
        }

        const signupUrl = `${baseUrl}/signup` +
          `?ig_user_id=${encodeURIComponent(igUserId)}` +
          `&ig_username=${encodeURIComponent(igUsername)}` +
          `&campaign=${encodeURIComponent('ig_comment_automation')}` +
          `&comment_id=${encodeURIComponent(commentId)}` +
          `&media_id=${encodeURIComponent(mediaId)}`;

        // Send DM with signup link
        const dmMessage = `Thanks for your comment! 🎉\n\nTap here to get started: ${signupUrl}`;

        await sendInstagramDm(igUserId, dmMessage);
      }
    }

    // Always return 200 to prevent Meta from retrying
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    logError('Webhook processing error', error);
    // Return 200 even on error to prevent retry storms
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
