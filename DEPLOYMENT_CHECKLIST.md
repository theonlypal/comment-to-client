# Deployment Checklist for Comment to Client

## Prerequisites Setup

### 1. Meta/Instagram Configuration ✓

- [ ] Create Meta Developer App at https://developers.facebook.com/apps
- [ ] Add Instagram product to your app
- [ ] Get Instagram Business Account connected to Facebook Page
- [ ] Generate long-lived access token (Graph API Explorer)
- [ ] Note down:
  - `META_APP_ID`
  - `META_APP_SECRET`
  - `META_APP_ACCESS_TOKEN`
  - `META_IG_BUSINESS_ACCOUNT_ID`
- [ ] Create `META_VERIFY_TOKEN` (random string)
- [ ] Create `META_WEBHOOK_SECRET` (same as app secret)

### 2. Google Sheets Configuration ✓

- [ ] Create Google Cloud Project at https://console.cloud.google.com
- [ ] Enable Google Sheets API
- [ ] Create Service Account
- [ ] Download JSON credentials file
- [ ] Extract from JSON:
  - `GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_SHEETS_PRIVATE_KEY`
- [ ] Create Google Spreadsheet
- [ ] Share spreadsheet with service account email (Editor permission)
- [ ] Copy spreadsheet ID from URL: `GOOGLE_SHEETS_SPREADSHEET_ID`

### 3. Brevo Configuration ✓

- [ ] Create Brevo account at https://app.brevo.com
- [ ] Generate API key at Settings > API Keys
- [ ] Create contact list and note numeric list ID
- [ ] Create custom attributes (UPPERCASE):
  - FIRSTNAME
  - LASTNAME
  - SMS
  - IG_USERNAME
  - CAMPAIGN
- [ ] Note down:
  - `BREVO_API_KEY`
  - `BREVO_LIST_ID` (numeric)

### 4. Database Configuration ✓

**Option A: Vercel Postgres (Recommended)**
- [ ] Go to Vercel Dashboard > Storage > Create Database > Postgres
- [ ] Copy connection strings:
  - `POSTGRES_PRISMA_URL` (pooled)
  - `POSTGRES_URL_NON_POOLING` (direct)

**Option B: Neon/Supabase**
- [ ] Create PostgreSQL database
- [ ] Copy `DATABASE_URL` connection string

### 5. Admin Access ✓

- [ ] Generate secure random token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] Save as `ADMIN_ACCESS_TOKEN`

---

## Local Testing

### 1. Initial Setup ✓

```bash
cd comment-to-client
npm install
```

### 2. Environment Variables ✓

Create `.env.local`:
```bash
cp .env.example .env.local
```

Fill in ALL values from prerequisites above.

### 3. Database Migration ✓

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Build Test ✓

```bash
npm run build
```

Should compile without errors.

### 5. Start Dev Server ✓

```bash
npm run dev
```

Visit http://localhost:3000

### 6. Test Pages ✓

- [ ] http://localhost:3000 - Landing page loads
- [ ] http://localhost:3000/signup - Form renders
- [ ] http://localhost:3000/thank-you - Thank you page loads
- [ ] http://localhost:3000/admin/leads?token=YOUR_TOKEN - Admin dashboard (change token)

### 7. Test Webhook Endpoint ✓

**Verification (GET):**
```bash
curl "http://localhost:3000/api/webhooks/meta/instagram?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test_challenge"
```

Expected: `test_challenge`

**Event (POST):**

Use ngrok:
```bash
ngrok http 3000
```

Configure webhook URL in Meta App Dashboard:
```
https://your-ngrok-id.ngrok.app/api/webhooks/meta/instagram
```

Comment on your Instagram post and check:
- [ ] Vercel/local logs show webhook received
- [ ] Signature verified
- [ ] DM sent to commenter
- [ ] No errors in logs

### 8. Test Form Submission ✓

1. Visit signup page
2. Fill out form with test data
3. Submit
4. Check:
   - [ ] Redirected to /thank-you
   - [ ] Lead appears in database
   - [ ] Row added to Google Sheet
   - [ ] Contact added to Brevo list

---

## Vercel Deployment

### 1. Push to GitHub ✓

```bash
git push -u origin main
```

### 2. Create Vercel Project ✓

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → Project
3. Import repository: `theonlypal/comment-to-client`
4. Framework: Next.js (auto-detected)
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `.next`
8. Install Command: `npm install`

### 3. Environment Variables ✓

In Vercel project settings → Environment Variables, add ALL variables:

```
META_APP_ID
META_APP_SECRET
META_VERIFY_TOKEN
META_APP_ACCESS_TOKEN
META_IG_BUSINESS_ACCOUNT_ID
META_WEBHOOK_SECRET
PUBLIC_APP_BASE_URL (set to your Vercel URL)
POSTGRES_PRISMA_URL (if using Vercel Postgres)
POSTGRES_URL_NON_POOLING (if using Vercel Postgres)
DATABASE_URL (if not using Vercel Postgres)
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL
GOOGLE_SHEETS_PRIVATE_KEY
GOOGLE_SHEETS_SPREADSHEET_ID
BREVO_API_KEY
BREVO_LIST_ID
ADMIN_ACCESS_TOKEN
```

**IMPORTANT**: Apply to Production, Preview, and Development environments.

### 4. Deploy ✓

Click "Deploy"

Wait for build to complete.

### 5. Get Production URL ✓

Copy your Vercel URL: `https://comment-to-client.vercel.app`

### 6. Update Environment Variable ✓

Update `PUBLIC_APP_BASE_URL` in Vercel to your production URL.

Redeploy.

---

## Meta Webhook Configuration

### 1. Add Webhook Callback URL ✓

1. Go to Meta App Dashboard → Products → Webhooks
2. Click "Add Callback URL"
3. Enter: `https://comment-to-client.vercel.app/api/webhooks/meta/instagram`
4. Enter Verify Token: (same as `META_VERIFY_TOKEN`)
5. Click "Verify and Save"

Should verify successfully ✅

### 2. Subscribe to Fields ✓

Click "Add Subscriptions"
- [ ] Check `comments`
- [ ] Save

### 3. Submit for Advanced Access (If Needed) ✓

If using Standard Access (test users only):
1. Go to App Review → Permissions and Features
2. Request `instagram_manage_messages` Advanced Access
3. Provide detailed use case
4. Wait 3-7 days for review

**Note**: Standard Access works for test users during development.

---

## Production Testing

### 1. Test Webhook Flow ✓

1. Comment on your Instagram Business post
2. Check Vercel logs (Dashboard → Deployments → Latest → Logs):
   - [ ] Webhook received
   - [ ] Signature verified
   - [ ] DM sent successfully
3. Check Instagram DMs:
   - [ ] Commenter received automated DM
   - [ ] Link to signup page included
4. Click link and submit form
5. Verify:
   - [ ] Lead in database (check via admin dashboard)
   - [ ] Row in Google Sheet
   - [ ] Contact in Brevo list

### 2. Test Admin Dashboard ✓

Visit: `https://comment-to-client.vercel.app/admin/leads?token=YOUR_ADMIN_TOKEN`

- [ ] Unauthorized message if wrong token
- [ ] Leads table displays if correct token
- [ ] Data matches database

### 3. Monitor Logs ✓

Check Vercel logs for any errors:
```
https://vercel.com/[your-username]/comment-to-client/logs
```

Watch for:
- Webhook errors
- Integration failures (Google Sheets, Brevo)
- Database connection issues

---

## Troubleshooting

### Webhook Not Receiving

**Issue**: Comments not triggering webhooks

**Fix**:
1. Verify webhook callback URL is correct
2. Check Meta App Dashboard → Webhooks → Subscriptions is active
3. Ensure Instagram account is Business account
4. Check Vercel logs for incoming requests
5. Verify `META_VERIFY_TOKEN` matches what you entered in Meta dashboard

### DM Not Sending

**Issue**: Webhook received but DM not sent

**Fix**:
1. Check Vercel logs for DM errors
2. Verify `META_APP_ACCESS_TOKEN` is long-lived token
3. Ensure `instagram_manage_messages` permission granted
4. Confirm Business account connected to Facebook Page
5. Check Instagram user is within 24-hour messaging window (commenting extends window)

### Google Sheets Not Updating

**Issue**: Leads not appearing in spreadsheet

**Fix**:
1. Check Vercel logs for Google Sheets errors
2. Verify spreadsheet shared with service account email (Editor permission)
3. Confirm `GOOGLE_SHEETS_PRIVATE_KEY` has proper newlines (use exact value from JSON)
4. Check `GOOGLE_SHEETS_SPREADSHEET_ID` is correct
5. Enable Google Sheets API in Cloud Console

### Brevo Contacts Not Syncing

**Issue**: Contacts not added to Brevo list

**Fix**:
1. Check Vercel logs for Brevo errors
2. Verify `BREVO_API_KEY` has proper permissions
3. Confirm `BREVO_LIST_ID` is correct (numeric)
4. Ensure custom attributes exist in Brevo (UPPERCASE: FIRSTNAME, LASTNAME, etc.)
5. Check rate limits (10 req/sec, 36k req/hour)

### Database Connection Issues

**Issue**: Prisma errors or connection timeouts

**Fix**:
1. Verify `POSTGRES_PRISMA_URL` is pooled connection (for Vercel Postgres)
2. Ensure `POSTGRES_URL_NON_POOLING` is direct connection (for migrations)
3. Check database is accessible from Vercel region
4. Confirm `postinstall` script runs `prisma generate`
5. Redeploy after fixing environment variables

### Build Failures

**Issue**: Vercel build fails

**Fix**:
1. Check Vercel build logs for specific error
2. Ensure `postinstall: "prisma generate"` in package.json
3. Verify all environment variables are set
4. Test build locally: `npm run build`
5. Check TypeScript errors: `npm run lint`

---

## Maintenance

### Database Backups

**Vercel Postgres**: Automatic backups enabled
**External Postgres**: Set up automated backups (pg_dump, Neon snapshots, etc.)

### Monitor Webhook Failures

Check Meta App Dashboard → Webhooks for delivery failures.

If rate limited or blocked:
- Increase server response time
- Return 200 even on errors
- Implement exponential backoff

### Update Dependencies

```bash
npm update
npm audit fix
```

Test locally before deploying.

### Scale Considerations

**If receiving 100+ comments/day:**
- Implement queue system (BullMQ, Inngest)
- Add rate limiting
- Consider upgrading database plan
- Monitor Vercel function execution time (max 60s)

---

## Security Checklist

- [ ] Never commit `.env` or `.env.local` to Git
- [ ] Rotate `ADMIN_ACCESS_TOKEN` periodically
- [ ] Use secure, random tokens (minimum 32 characters)
- [ ] Enable 2FA on all accounts (Meta, Vercel, Google, Brevo)
- [ ] Monitor Vercel logs for suspicious activity
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use environment-specific access tokens (dev/prod)

---

## Success Criteria

System is production-ready when:

- [x] Landing page loads at production URL
- [ ] Webhook verification succeeds in Meta dashboard
- [ ] Test comment triggers DM successfully
- [ ] DM link redirects to signup page with pre-filled context
- [ ] Form submission creates lead in all 3 destinations
- [ ] Admin dashboard displays leads correctly
- [ ] No errors in Vercel logs
- [ ] All integrations working (Sheets, Brevo, Database)

---

## Support

**Issues**: https://github.com/theonlypal/comment-to-client/issues

**Vercel Docs**: https://vercel.com/docs
**Meta Webhooks**: https://developers.facebook.com/docs/graph-api/webhooks
**Prisma Docs**: https://www.prisma.io/docs
**Next.js Docs**: https://nextjs.org/docs

---

**Ready to deploy!** 🚀
