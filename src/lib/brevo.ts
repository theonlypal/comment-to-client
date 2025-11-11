import fetch from 'cross-fetch';
import { logError, logInfo } from './logging';
import type { IntakeData } from './validators';

export async function upsertBrevoContact(data: IntakeData) {
  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;

  if (!apiKey || !listIdRaw) {
    logError('Brevo environment variables not set');
    return;
  }

  const listId = Number(listIdRaw);
  if (!Number.isFinite(listId)) {
    logError('BREVO_LIST_ID is not numeric');
    return;
  }

  // Extract first name from full name
  const [firstName, ...lastNameParts] = data.fullName.split(' ');
  const lastName = lastNameParts.join(' ');

  const body = {
    email: data.email,
    attributes: {
      FIRSTNAME: firstName || '',
      LASTNAME: lastName || '',
      SMS: data.phone ?? '',
      IG_USERNAME: data.igUsername ?? '',
      CAMPAIGN: data.campaign ?? '',
    },
    listIds: [listId],
    updateEnabled: true, // Enable upsert behavior
    emailBlacklisted: false,
    smsBlacklisted: false,
  };

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      logError('Brevo contact upsert failed', {
        status: res.status,
        body: text,
        email: data.email
      });
    } else {
      logInfo('Successfully upserted contact to Brevo', { email: data.email });
    }
  } catch (err) {
    logError('Brevo contact upsert error', err);
  }
}
