import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { IntakeSchema } from '@/lib/validators';
import { logInfo, logError } from '@/lib/logging';

/**
 * POST handler for intake form submission
 * Creates lead in database, appends to Google Sheets, and upserts to Brevo
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Read form data
    const formData = await request.formData();

    // 2. Map form data to object
    const data = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | undefined,
      notes: formData.get('notes') as string | undefined,
      igUserId: formData.get('igUserId') as string | undefined,
      igUsername: formData.get('igUsername') as string | undefined,
      igCommentId: formData.get('igCommentId') as string | undefined,
      igMediaId: formData.get('igMediaId') as string | undefined,
      campaign: formData.get('campaign') as string | undefined,
    };

    logInfo('Intake form submission received', { email: data.email });

    // 3. Validate with Zod
    const validationResult = IntakeSchema.safeParse(data);

    if (!validationResult.success) {
      logError('Form validation failed', validationResult.error.flatten());
      return NextResponse.json(
        {
          error: 'Invalid form data',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 4. Insert into database
    const lead = await prisma.lead.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        notes: validatedData.notes || null,
        igUserId: validatedData.igUserId || null,
        igUsername: validatedData.igUsername || null,
        igCommentId: validatedData.igCommentId || null,
        igMediaId: validatedData.igMediaId || null,
        campaign: validatedData.campaign || null,
        source: 'instagram_comment',
      },
    });

    logInfo('Lead created in database', { id: lead.id, email: lead.email });

    // 5. Redirect to thank-you page (303 for POST-Redirect-GET)
    const thankYouUrl = new URL('/thank-you', request.url);
    return NextResponse.redirect(thankYouUrl, 303);

  } catch (error) {
    logError('Intake submission error', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
