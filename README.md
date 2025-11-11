# Comment to Client

Automatically convert Instagram comments into qualified leads with DM automation, CRM integration, and multi-channel sync.

## Features

- **Instagram Comment Detection**: Receives webhooks when users comment on your Instagram posts
- **Automatic DM Response**: Sends personalized DMs with signup links
- **Lead Capture**: Beautiful intake form with Instagram context pre-filled
- **Multi-Channel Sync**: Saves leads to:
  - PostgreSQL database
  - Google Sheets
  - Brevo (Sendinblue) email marketing
- **Admin Dashboard**: View and manage leads with token-gated access

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Integrations**:
  - Meta Instagram Graph API (v22.0)
  - Google Sheets API
  - Brevo API
- **Deployment**: Vercel

## Prerequisites

1. **Instagram Business Account** connected to a Facebook Page
2. **Meta Developer App** with Instagram permissions
3. **Google Cloud Service Account** with Sheets API access
4. **Brevo Account** with API key
5. **PostgreSQL Database** (Neon, Supabase, or Vercel Postgres recommended)

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/theonlypal/comment-to-client.git
cd comment-to-client
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all required values:

#### Meta/Instagram Configuration

1. Go to [Meta for Developers](https://developers.facebook.com/apps)
2. Create a new app or use existing
3. Add Instagram product
4. Get your:
   - `META_APP_ID`: App ID from Settings > Basic
   - `META_APP_SECRET`: App Secret from Settings > Basic
   - `META_VERIFY_TOKEN`: Create your own random string (you define this)
   - `META_APP_ACCESS_TOKEN`: Generate long-lived token via Graph API Explorer
   - `META_IG_BUSINESS_ACCOUNT_ID`: Your Instagram Business Account ID
   - `META_WEBHOOK_SECRET`: Same as `META_APP_SECRET`

#### Database Configuration

**Option A: Vercel Postgres**
```bash
POSTGRES_PRISMA_URL=your_pooled_connection_url
POSTGRES_URL_NON_POOLING=your_direct_connection_url
```

**Option B: Other Postgres**
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require
```

#### Google Sheets Configuration

1. Create a service account:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project or select existing
   - Enable Google Sheets API
   - Create service account credentials (JSON key file)

2. Share your spreadsheet:
   - Open Google Sheets
   - Click Share
   - Add service account email (from JSON file)
   - Grant Editor permission

3. Set environment variables:
   ```bash
   GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=xxx@project.iam.gserviceaccount.com
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
   ```

#### Brevo Configuration

1. Go to [Brevo Dashboard](https://app.brevo.com/settings/keys/api)
2. Generate API key
3. Get list ID from Contacts > Lists page
4. Set environment variables:
   ```bash
   BREVO_API_KEY=xkeysib-your-key
   BREVO_LIST_ID=4
   ```

**Note**: Create custom attributes in Brevo (UPPERCASE):
- FIRSTNAME
- LASTNAME
- SMS
- IG_USERNAME
- CAMPAIGN

#### Admin Access

```bash
ADMIN_ACCESS_TOKEN=your_secure_random_string_32_chars_minimum
```

Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing Locally

### Test Webhook Endpoint

Use ngrok to expose your local server:

```bash
ngrok http 3000
```

Then configure the ngrok HTTPS URL in Meta App Dashboard:
```
https://your-ngrok-url.ngrok.app/api/webhooks/meta/instagram
```

### Test GET Verification

```bash
curl "http://localhost:3000/api/webhooks/meta/instagram?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test"
```

Expected response: `test`

### Test Form Submission

1. Visit `http://localhost:3000/signup`
2. Fill out form
3. Submit
4. Check database, Google Sheets, and Brevo for new lead

### Test Admin Dashboard

Visit: `http://localhost:3000/admin/leads?token=YOUR_ADMIN_ACCESS_TOKEN`

## Deployment to Vercel

### 1. Push to GitHub

```bash
git remote add origin https://github.com/theonlypal/comment-to-client.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import GitHub repository: `theonlypal/comment-to-client`
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. Add environment variables:
   - Copy all variables from `.env.local`
   - Set for Production, Preview, and Development

5. Deploy

### 3. Configure Meta Webhooks

After deployment:

1. Get your Vercel URL: `https://comment-to-client.vercel.app`
2. Set `PUBLIC_APP_BASE_URL` in Vercel environment variables
3. Go to Meta App Dashboard > Webhooks
4. Add callback URL:
   ```
   https://comment-to-client.vercel.app/api/webhooks/meta/instagram
   ```
5. Enter verify token (same as `META_VERIFY_TOKEN`)
6. Subscribe to `comments` field

### 4. Test Production Webhook

Comment on your Instagram post and check:
- Vercel logs for webhook receipt
- Instagram DMs for automated message
- Signup page functionality
- Database for new lead

## Project Structure

```
comment-to-client/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── signup/
│   │   │   └── page.tsx       # Intake form
│   │   ├── thank-you/
│   │   │   └── page.tsx       # Confirmation page
│   │   ├── admin/
│   │   │   └── leads/
│   │   │       └── page.tsx   # Admin dashboard
│   │   └── api/
│   │       ├── webhooks/
│   │       │   └── meta/
│   │       │       └── instagram/
│   │       │           └── route.ts  # Webhook handler
│   │       └── intake/
│   │           └── submit/
│   │               └── route.ts      # Form submission
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── validators.ts      # Zod schemas
│   │   ├── googleSheets.ts    # Google Sheets integration
│   │   ├── brevo.ts           # Brevo integration
│   │   ├── instagram.ts       # Instagram DM sender
│   │   └── logging.ts         # Logging utilities
│   └── styles/
│       └── globals.css        # Global styles
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

## API Routes

### Webhook Endpoint

**GET** `/api/webhooks/meta/instagram`
- Webhook verification for Meta setup
- Query params: `hub.mode`, `hub.verify_token`, `hub.challenge`

**POST** `/api/webhooks/meta/instagram`
- Receives Instagram comment webhooks
- Verifies X-Hub-Signature-256
- Sends DM with signup link

### Intake Endpoint

**POST** `/api/intake/submit`
- Processes form submissions
- Validates with Zod
- Saves to database
- Syncs to Google Sheets and Brevo
- Redirects to thank-you page

## Database Schema

```prisma
model Lead {
  id             String   @id @default(cuid())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  fullName       String
  email          String
  phone          String?

  igUserId       String?
  igUsername     String?
  igCommentId    String?
  igMediaId      String?
  campaign       String?

  notes          String?
  source         String?
}
```

## Security Features

- **Webhook Signature Verification**: HMAC SHA256 with timing-safe comparison
- **Environment Variable Isolation**: Server-only secrets
- **Admin Token Gating**: Secure dashboard access
- **Input Validation**: Zod schema validation
- **Error Handling**: Graceful failures with logging

## Troubleshooting

### Webhook Not Receiving Events

1. Check Meta App Dashboard > Webhooks shows subscription as active
2. Verify callback URL is correct HTTPS URL
3. Check Vercel logs for incoming requests
4. Ensure `META_VERIFY_TOKEN` matches what you entered in Meta dashboard

### DMs Not Sending

1. Verify `META_APP_ACCESS_TOKEN` is a long-lived token
2. Check Instagram account is Business account
3. Ensure Business account is connected to Facebook Page
4. Verify `instagram_manage_messages` permission is granted (requires Advanced Access)

### Google Sheets Not Updating

1. Verify spreadsheet is shared with service account email
2. Check service account has Editor permission
3. Verify `GOOGLE_SHEETS_PRIVATE_KEY` has proper newline characters
4. Check Vercel logs for Google Sheets errors

### Brevo Contacts Not Syncing

1. Verify API key has proper permissions
2. Check list ID is correct (numeric)
3. Ensure custom attributes exist in Brevo account (UPPERCASE)
4. Check Vercel logs for Brevo errors

### Database Connection Issues

For Vercel Postgres:
- Use `POSTGRES_PRISMA_URL` for pooled connection
- Use `POSTGRES_URL_NON_POOLING` for migrations
- Ensure `postinstall` script runs `prisma generate`

## License

MIT

## Support

For issues, please create an issue at: https://github.com/theonlypal/comment-to-client/issues
