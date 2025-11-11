import { google } from 'googleapis';
import { logError, logInfo } from './logging';
import type { IntakeData } from './validators';

let sheetsClientPromise: Promise<ReturnType<typeof google.sheets>> | null = null;

async function getSheetsClient() {
  if (!sheetsClientPromise) {
    const email = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

    if (!email || !key) {
      throw new Error('Google Sheets environment variables not set');
    }

    // Handle newline characters in private key
    const formattedKey = key.split(String.raw`\n`).join('\n');

    const auth = new google.auth.JWT(
      email,
      undefined,
      formattedKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    sheetsClientPromise = auth.authorize().then(() =>
      google.sheets({ version: 'v4', auth })
    );
  }
  return sheetsClientPromise;
}

export async function appendLeadToSheet(
  data: IntakeData & { createdAt: string; source?: string }
) {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not set');
    }

    const values = [[
      data.createdAt,
      data.fullName,
      data.email,
      data.phone ?? '',
      data.igUserId ?? '',
      data.igUsername ?? '',
      data.igCommentId ?? '',
      data.igMediaId ?? '',
      data.campaign ?? '',
      data.source ?? '',
      data.notes ?? '',
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    logInfo('Successfully appended lead to Google Sheet', { email: data.email });
  } catch (err) {
    logError('Failed to append to Google Sheet', err);
    // Don't throw - log error but continue
  }
}
