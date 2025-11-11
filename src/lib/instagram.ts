import fetch from 'cross-fetch';
import { logError, logInfo } from './logging';

const IG_GRAPH_VERSION = 'v22.0';

export async function sendInstagramDm(recipientId: string, message: string) {
  const accessToken = process.env.META_APP_ACCESS_TOKEN;

  if (!accessToken) {
    logError('META_APP_ACCESS_TOKEN not set');
    return;
  }

  const url = `https://graph.facebook.com/${IG_GRAPH_VERSION}/me/messages`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        messaging_type: 'RESPONSE',
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      logError('Failed to send Instagram DM', {
        status: res.status,
        body: text,
        recipientId
      });
    } else {
      logInfo('Successfully sent Instagram DM', { recipientId });
    }
  } catch (err) {
    logError('Instagram DM error', err);
  }
}
