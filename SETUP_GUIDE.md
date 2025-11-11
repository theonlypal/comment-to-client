# INSTAGRAM COMMENT AUTOMATION - COMPLETE SETUP GUIDE

**Goal**: Make the system work with YOUR Instagram Business account end-to-end.

**Time Required**: 30-45 minutes

**What You'll Accomplish**:
1. Instagram comment triggers webhook
2. System sends automatic DM with signup link
3. User fills form
4. Data syncs to PostgreSQL + Google Sheets + Brevo

---

## PHASE 1: DATABASE SETUP (5 minutes)

### 1.1 Create Neon PostgreSQL Database

```bash
# 1. Go to https://neon.tech
# 2. Sign up with GitHub (fastest)
# 3. Click "Create Project"
# 4. Name: "comment-to-client-db"
# 5. Region: US East (Ohio) - closest to Vercel
# 6. Click "Create"
```

### 1.2 Copy Connection Strings

You'll see two connection strings immediately:

**Connection String (pooled):**
```
postgres://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Direct Connection String (for migrations):**
```
postgres://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=10
```

**Save both** - you'll need them in a moment.

### 1.3 Run Database Migrations

```bash
cd "C:\Users\Rayan Pal\comment-to-client"

# Create .env file with your connection strings
echo "DATABASE_URL=<paste pooled connection string here>" > .env
echo "DIRECT_URL=<paste direct connection string here>" >> .env

# Run migrations
npx prisma migrate deploy

# Verify tables created
npx prisma studio
# Opens browser - you should see "Lead" table
```

---

## PHASE 2: GOOGLE SHEETS SETUP (8 minutes)

### 2.1 Create Google Cloud Project

```
1. Go to: https://console.cloud.google.com/
2. Click "Select a project" dropdown (top left)
3. Click "New Project"
4. Name: "comment-to-client-integration"
5. Click "Create"
6. Wait 10 seconds for project creation
```

### 2.2 Enable APIs

```
1. In search bar, type "Google Sheets API"
2. Click first result → Click "Enable"
3. In search bar, type "Google Drive API"
4. Click first result → Click "Enable"
```

### 2.3 Create Service Account

```
1. Go to "APIs & Services" → "Credentials" (left sidebar)
2. Click "Create Credentials" → "Service Account"
3. Service account name: "nextjs-sheets"
4. Click "Create and Continue"
5. Role: Select "Project" → "Editor"
6. Click "Continue" → Click "Done"
```

### 2.4 Download Credentials JSON

```
1. Click on the service account email you just created
   (looks like: nextjs-sheets@project-id.iam.gserviceaccount.com)
2. Go to "Keys" tab
3. Click "Add Key" → "Create New Key"
4. Select "JSON"
5. Click "Create"
6. JSON file downloads automatically
```

**SAVE THIS FILE** - you'll need it in Phase 4.

### 2.5 Create Google Sheet & Share Access

```
1. Go to https://sheets.google.com
2. Create new sheet
3. Name it: "Instagram Leads"
4. Add header row:
   A1: Date | B1: Name | C1: Email | D1: Phone | E1: IG Username | F1: Campaign | G1: Notes

5. Click "Share" button (top right)
6. Open the JSON file you downloaded
7. Copy the "client_email" value (the long email address)
8. Paste into "Add people and groups" field
9. Change permission to "Editor"
10. UNCHECK "Notify people"
11. Click "Share"

12. Copy the Sheet ID from URL:
    https://docs.google.com/spreadsheets/d/1abc123xyz456/edit
                                        ^^^^^^^^^^^^^ This is your SHEET_ID
```

---

## PHASE 3: BREVO EMAIL SETUP (3 minutes)

### 3.1 Get API Key

```
1. Sign in to: https://app.brevo.com/
2. Click your profile name (top right)
3. Select "SMTP & API"
4. Scroll to "API Keys" section
5. Click "Create a new API key"
6. Name: "comment-to-client-api"
7. Click "Generate"
8. COPY IMMEDIATELY (won't show again!)
```

Format: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx`

### 3.2 Create Contact List

```
1. Go to "Contacts" → "Lists" (left sidebar)
2. Click "Create a list"
3. Name: "Instagram Leads"
4. Click "Create"
5. Note the ID number in the "ID" column (e.g., 4, 12, etc.)
```

---

## PHASE 4: META APP SETUP (15 minutes)

### 4.1 Create Meta App

```
1. Go to: https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" type
4. App name: "Instagram Comment Automation"
5. Contact email: <your email>
6. Click "Create App"
```

### 4.2 Add Instagram Product

```
1. In app dashboard, scroll down
2. Find "Instagram" → Click "Set Up"
3. This adds Instagram Graph API
```

### 4.3 Configure App Settings

```
1. Go to "Settings" → "Basic" (left sidebar)
2. SAVE THESE VALUES:
   - App ID: ____________
   - App Secret: ____________ (click "Show" button)

3. Add App Domains: <your-vercel-domain>.vercel.app
4. Privacy Policy URL: https://<your-vercel-domain>.vercel.app/privacy
5. Click "Save Changes"
```

### 4.4 Convert Instagram to Business Account (IF NOT ALREADY)

```
1. Open Instagram app on phone
2. Go to Settings → Account Type and Tools
3. Tap "Switch to Professional Account"
4. Select "Business"
5. Connect to your Facebook Page
   (If you don't have a page, create one first)
```

### 4.5 Get Access Tokens

**Step 1: Get Short-Lived Token**

```
1. Go to: https://developers.facebook.com/tools/explorer/
2. Select your app from "Meta App" dropdown
3. Click "Permissions" → Check these boxes:
   - instagram_basic
   - instagram_manage_comments
   - instagram_manage_insights
   - pages_show_list
   - pages_read_engagement
4. Click "Generate Access Token"
5. Click "Continue as <Your Name>"
6. Accept all permissions
7. COPY the token shown
```

**Step 2: Exchange for Long-Lived Token (60 days)**

Open Command Prompt and run:

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN_FROM_STEP_1"
```

Replace:
- `YOUR_APP_ID` - from step 4.3
- `YOUR_APP_SECRET` - from step 4.3
- `SHORT_LIVED_TOKEN_FROM_STEP_1` - from step 1 above

**Response will look like:**
```json
{
  "access_token": "EAAxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**SAVE the access_token** - this is your Page Access Token.

### 4.6 Get Instagram Account ID

```bash
# Get your Facebook Page ID first
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=PAGE_ACCESS_TOKEN_FROM_STEP_2"

# Response shows your pages:
{
  "data": [
    {
      "id": "123456789012345",  # This is PAGE_ID
      "name": "Your Page Name"
    }
  ]
}

# Get Instagram Account ID from Page ID
curl "https://graph.facebook.com/v19.0/123456789012345?fields=instagram_business_account&access_token=PAGE_ACCESS_TOKEN_FROM_STEP_2"

# Response:
{
  "instagram_business_account": {
    "id": "17841234567890123"  # This is INSTAGRAM_ACCOUNT_ID
  }
}
```

**SAVE both IDs**.

---

## PHASE 5: VERCEL DEPLOYMENT (10 minutes)

### 5.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Link Project

```bash
cd "C:\Users\Rayan Pal\comment-to-client"
vercel link
```

Follow prompts:
- Set up and deploy? Y
- Which scope? <your account>
- Link to existing project? Y
- Project name: comment-to-client

### 5.3 Add Environment Variables

```bash
# Database
vercel env add DATABASE_URL production
# Paste: postgres://... (pooled connection string from Phase 1)

vercel env add DIRECT_URL production
# Paste: postgres://... (direct connection string from Phase 1)

# Google Sheets - Open the JSON file from Phase 2
vercel env add GOOGLE_SHEETS_CLIENT_EMAIL production
# Paste: client_email value from JSON

vercel env add GOOGLE_SHEETS_PRIVATE_KEY production
# Paste: private_key value from JSON (include "-----BEGIN PRIVATE KEY-----" part)

vercel env add GOOGLE_SHEET_ID production
# Paste: Sheet ID from Phase 2.5

# Brevo
vercel env add BREVO_API_KEY production
# Paste: API key from Phase 3.1

vercel env add BREVO_LIST_ID production
# Paste: List ID number from Phase 3.2 (e.g., 4)

# Meta Instagram
vercel env add INSTAGRAM_ACCESS_TOKEN production
# Paste: Page Access Token from Phase 4.5 step 2

vercel env add INSTAGRAM_ACCOUNT_ID production
# Paste: Instagram Account ID from Phase 4.6

vercel env add META_APP_SECRET production
# Paste: App Secret from Phase 4.3

vercel env add WEBHOOK_VERIFY_TOKEN production
# Create a random string: your_secret_verify_token_12345
```

### 5.4 Deploy to Vercel

```bash
vercel --prod
```

Wait for deployment to complete. You'll get a URL like:
`https://comment-to-client-xxxxxxxx.vercel.app`

**SAVE THIS URL** - you'll need it for webhook configuration.

---

## PHASE 6: CONFIGURE WEBHOOKS (5 minutes)

### 6.1 Add Webhook in Meta Dashboard

```
1. Go to your app dashboard: https://developers.facebook.com/apps/
2. Select your app
3. Go to "Products" → "Webhooks" (left sidebar)
4. Find "Instagram" object → Click "Edit"
5. Click "Add Callback URL"

   Callback URL: https://your-vercel-domain.vercel.app/api/webhooks/meta/instagram
   Verify Token: your_secret_verify_token_12345 (same as env var)

6. Click "Verify and Save"

   If successful, you'll see ✓ "Success" message
   If it fails, check your WEBHOOK_VERIFY_TOKEN env var
```

### 6.2 Subscribe to Webhook Fields

```
1. Still in Webhooks section
2. Under "Instagram" object, check these boxes:
   ✅ comments
   ✅ mentions

3. Click "Save"
```

### 6.3 Subscribe Page to Receive Webhooks

```bash
curl -X POST "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/subscribed_apps?subscribed_fields=feed&access_token=YOUR_PAGE_ACCESS_TOKEN"
```

Replace:
- `YOUR_PAGE_ID` - from Phase 4.6
- `YOUR_PAGE_ACCESS_TOKEN` - from Phase 4.5

Response should be: `{"success": true}`

---

## PHASE 7: TESTING (10 minutes)

### 7.1 Test Webhook Endpoint

```bash
# Test that webhook is responding
curl "https://your-vercel-domain.vercel.app/api/webhooks/meta/instagram?hub.mode=subscribe&hub.verify_token=your_secret_verify_token_12345&hub.challenge=test123"

# Should return: test123
```

### 7.2 Check Vercel Logs

```bash
vercel logs --prod
```

Keep this terminal open to monitor incoming webhooks.

### 7.3 Test End-to-End Flow

**IMPORTANT**: In dev mode, webhooks only work for app testers/admins.

1. **Post on Instagram:**
   - Post a photo/video to your Instagram Business account
   - Note the post ID

2. **Comment on your own post:**
   - Using your account or a test account, add a comment

3. **Check Vercel Logs:**
   ```bash
   vercel logs --prod --follow
   ```
   You should see the webhook event logged.

4. **Check Instagram DMs:**
   - The commenter should receive a DM with signup link

5. **Click the signup link:**
   - Should open: https://your-vercel-domain.vercel.app/signup?ig_username=...

6. **Fill out the form and submit**

7. **Verify data was saved:**
   - Check Neon database: `npx prisma studio`
   - Check Google Sheet: Should have new row
   - Check Brevo: Should have new contact in list

---

## TROUBLESHOOTING

### Webhooks Not Received

```bash
# Check page subscription
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/subscribed_apps?access_token=YOUR_PAGE_ACCESS_TOKEN"

# Should show: subscribed_fields: ["feed"]
```

### DM Not Sent

```bash
# Check access token is valid
curl "https://graph.facebook.com/v19.0/me?access_token=YOUR_PAGE_ACCESS_TOKEN"

# Should return page info, not error
```

### Form Not Saving to Database

```bash
# Check database connection
cd "C:\Users\Rayan Pal\comment-to-client"
npx prisma studio

# Should open browser with database viewer
```

### Google Sheets Not Updating

```
1. Check service account email has Editor access to sheet
2. Verify GOOGLE_SHEET_ID is correct (from sheet URL)
3. Check Vercel logs for Google API errors
```

### Brevo Contact Not Created

```
1. Verify API key is valid (test at app.brevo.com)
2. Check list ID is correct
3. Check Vercel logs for Brevo API errors
```

---

## PRODUCTION READINESS

### Enable App for Public Use

**REQUIRED**: Submit app for review to get Advanced Access

```
1. Go to app dashboard → "App Review" → "Permissions and Features"
2. Find "instagram_manage_comments" → Click "Request Advanced Access"
3. Provide:
   - Screen recording showing the full flow
   - Detailed description
   - Privacy policy
   - Test credentials

4. Submit and wait 1-7 days for approval
```

**Without Advanced Access**: Webhooks only work for app admins/testers.

### Token Refresh (Before 60 Days)

Set up a cron job to refresh your Page Access Token:

```javascript
// Add to your codebase
export async function refreshAccessToken() {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  );
  const data = await response.json();

  // Update env var with new token
  console.log('New token:', data.access_token);
  // Store this in Vercel env vars
}
```

---

## COMPLETE ENVIRONMENT VARIABLES CHECKLIST

```bash
# Database (Neon)
DATABASE_URL=postgres://...
DIRECT_URL=postgres://...

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=xxxxx@xxxxx.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=1abc123xyz456

# Brevo
BREVO_API_KEY=xkeysib-xxxxx
BREVO_LIST_ID=4

# Meta Instagram
INSTAGRAM_ACCESS_TOKEN=EAAxxxxx
INSTAGRAM_ACCOUNT_ID=17841234567890123
META_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
WEBHOOK_VERIFY_TOKEN=your_secret_verify_token_12345

# Admin Dashboard (optional)
ADMIN_ACCESS_TOKEN=your_random_secret_for_admin_access
```

---

## SUCCESS CRITERIA

✅ Webhook endpoint verified in Meta dashboard
✅ Comment on Instagram post triggers webhook (check Vercel logs)
✅ DM sent automatically with signup link
✅ Form submission saves to database
✅ Data appears in Google Sheet
✅ Contact created in Brevo list
✅ Admin dashboard shows leads

**You're done!** The system is working end-to-end with your Instagram account.

---

## NEXT STEPS

1. **Submit for App Review** - Get Advanced Access to receive webhooks from public users
2. **Set up Token Refresh** - Cron job to refresh token before 60 days
3. **Customize DM Message** - Edit the message template in `src/lib/instagram.ts`
4. **Add Analytics** - Track conversion rates, form completion, etc.
5. **Create Privacy Policy** - Required for App Review

**Questions?** Check Vercel logs first, then Meta webhook debugger in app dashboard.
