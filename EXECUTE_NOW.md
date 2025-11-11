# EXECUTE RIGHT NOW - Complete Checklist

**Goal**: Comment on your new Instagram Business account → Auto DM sent → Form filled → Database saved

**Time**: 30 minutes total

---

## WHAT YOU NEED BEFORE STARTING

### Accounts You Need:
1. ✅ **Personal Instagram account** (your existing account - to comment and test)
2. ✅ **New Instagram Business account** (create now - receives comments, sends DMs)
3. ✅ **Facebook account** (your existing one - to create Page and Meta App)
4. ✅ **GitHub account** (for Vercel deployment)
5. ✅ **Neon account** (create now - for database, free tier)

### Things You'll Create:
- Facebook Page (connected to new IG Business account)
- Meta Developer App (for webhooks)
- Neon PostgreSQL database (for storing leads)
- Vercel deployment (for receiving webhooks)

---

## PHASE 1: CREATE INSTAGRAM BUSINESS ACCOUNT (5 min)

### Step 1: Create New Instagram Account
```
1. Log out of your personal Instagram
2. Create new account:
   - Email: Use a new email or +alias (e.g., yourname+igtest@gmail.com)
   - Username: Choose something like "test_business_2025" or "demo_leads_account"
   - Password: Save it somewhere
```

### Step 2: Convert to Business Account
```
1. Go to profile
2. Tap menu (3 lines) → Settings and privacy
3. Account type and tools → Switch to professional account
4. Select "Business"
5. Choose a category (any - e.g., "Entrepreneur")
6. Skip contact info for now
7. Tap "Done"
```

### Step 3: Create Facebook Page
```
1. Open Facebook on desktop: https://facebook.com
2. Click "Create" → "Page"
3. Name: Same as your IG username (e.g., "Test Business 2025")
4. Category: "Brand or Product"
5. Click "Create Page"
6. Skip all setup steps for now
```

### Step 4: Connect Instagram to Facebook Page
```
IMPORTANT: This is the critical step for API access

1. On Instagram app:
   - Settings → Account Center
   - Click "Add Instagram account" (if not already there)

2. OR do it from Facebook:
   - Go to your new Page
   - Left sidebar → "Instagram"
   - Click "Connect Account"
   - Log in to your new IG Business account
   - Grant permissions

3. Verify connection:
   - Instagram Settings → Business → Linked Accounts
   - Should show your Facebook Page
```

### Step 5: Post Something on Instagram
```
1. Post a simple photo/video on your new IG Business account
2. Caption: "Testing automation - comment 'interested' to try!"
3. This is what you'll comment on later
```

---

## PHASE 2: CREATE META APP (8 min)

### Step 1: Create Developer App
```
1. Go to: https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" type
4. App name: "Instagram Lead Automation"
5. Contact email: your email
6. Click "Create App"
```

### Step 2: Add Instagram Product
```
1. In app dashboard, find "Add Products"
2. Scroll to "Instagram" → Click "Set Up"
3. This enables Instagram Graph API
```

### Step 3: Save App Credentials
```
1. Go to Settings → Basic
2. SAVE THESE (you'll need them):

   App ID: ________________
   App Secret: ________________ (click "Show" button)

3. Create a verify token (random string):

   Verify Token: instagram_webhook_test_12345

   (You create this - just remember it)
```

---

## PHASE 3: GET ACCESS TOKENS (10 min)

**This is the most technical part. Follow exactly:**

### Step 1: Generate Short-Lived Token
```
1. Go to: https://developers.facebook.com/tools/explorer/
2. Meta App dropdown → Select your app
3. Permissions dropdown → Add these:
   - instagram_basic
   - instagram_manage_comments
   - pages_show_list
   - pages_read_engagement

4. Click "Generate Access Token"
5. A popup appears → Click "Continue as <Your Name>"
6. Accept all permissions
7. COPY THE TOKEN (in the Access Token field)

This token expires in 1-2 hours. We'll exchange it next.
```

### Step 2: Exchange for Long-Lived Token (60 days)

**Open Command Prompt and run:**

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_TOKEN_FROM_STEP_1"
```

Replace:
- `YOUR_APP_ID` - from Phase 2, Step 3
- `YOUR_APP_SECRET` - from Phase 2, Step 3
- `SHORT_TOKEN_FROM_STEP_1` - from above

**Response looks like:**
```json
{
  "access_token": "EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**SAVE THIS TOKEN** - this is your `INSTAGRAM_ACCESS_TOKEN`

### Step 3: Get Page ID

```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=LONG_LIVED_TOKEN_FROM_STEP_2"
```

**Response shows your pages:**
```json
{
  "data": [
    {
      "id": "123456789012345",
      "name": "Test Business 2025"
    }
  ]
}
```

**SAVE THE ID** - this is your `PAGE_ID`

### Step 4: Get Instagram Account ID

```bash
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID?fields=instagram_business_account&access_token=LONG_LIVED_TOKEN"
```

Replace `YOUR_PAGE_ID` with the ID from Step 3.

**Response:**
```json
{
  "instagram_business_account": {
    "id": "17841234567890123"
  },
  "id": "123456789012345"
}
```

**SAVE THE instagram_business_account ID** - this is your `INSTAGRAM_ACCOUNT_ID`

---

## PHASE 4: SET UP DATABASE (3 min)

```bash
# 1. Go to: https://neon.tech
# 2. Sign in with GitHub
# 3. Create new project: "instagram-automation"
# 4. Copy the connection string shown

# Connection string looks like:
postgres://username:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# SAVE THIS - this is your DATABASE_URL
```

**Create .env file:**
```bash
cd "C:\Users\Rayan Pal\comment-to-client"

echo DATABASE_URL="your_neon_connection_string" > .env

# Run migrations
npx prisma migrate deploy

# Verify it worked
npx prisma studio
# Opens browser - should see empty "Lead" table
```

---

## PHASE 5: DEPLOY TO VERCEL (7 min)

```bash
cd "C:\Users\Rayan Pal\comment-to-client"

# Install Vercel CLI (if not already)
npm install -g vercel

# Login
vercel login

# Link project
vercel link
# Choose: Set up and deploy
# Link to existing: Yes
# Project: comment-to-client

# Add ALL environment variables
vercel env add DATABASE_URL production
# Paste your Neon connection string

vercel env add META_APP_SECRET production
# Paste App Secret from Phase 2

vercel env add META_VERIFY_TOKEN production
# Type: instagram_webhook_test_12345

vercel env add INSTAGRAM_ACCESS_TOKEN production
# Paste long-lived token from Phase 3, Step 2

vercel env add INSTAGRAM_ACCOUNT_ID production
# Paste Instagram Account ID from Phase 3, Step 4

# Deploy
vercel --prod

# You'll get a URL like:
# https://comment-to-client-xxxxx.vercel.app

# SAVE THIS URL
```

---

## PHASE 6: CONFIGURE WEBHOOK (5 min)

### Step 1: Add Webhook in Meta Dashboard

```
1. Go to: https://developers.facebook.com/apps/
2. Select your app
3. Products → Webhooks (left sidebar)
4. Find "Instagram" object → Click "Edit Subscription"
5. Callback URL: https://your-vercel-url.vercel.app/api/webhooks/meta/instagram
6. Verify Token: instagram_webhook_test_12345
7. Click "Verify and Save"

Meta will send a GET request to verify. If successful:
✓ "Success" message appears
```

### Step 2: Subscribe to Comment Field

```
1. Still in Webhooks section
2. Under "Instagram", check this box:
   ✅ comments
3. Click "Save"
```

### Step 3: Subscribe Page to Receive Webhooks

**In Command Prompt:**
```bash
curl -X POST "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/subscribed_apps?subscribed_fields=feed&access_token=YOUR_LONG_LIVED_TOKEN"
```

Replace:
- `YOUR_PAGE_ID` - from Phase 3, Step 3
- `YOUR_LONG_LIVED_TOKEN` - from Phase 3, Step 2

**Should return:**
```json
{"success": true}
```

---

## PHASE 7: TEST END-TO-END (2 min)

### Test 1: Verify Webhook Endpoint

```bash
curl "https://your-vercel-url.vercel.app/api/webhooks/meta/instagram?hub.mode=subscribe&hub.verify_token=instagram_webhook_test_12345&hub.challenge=test"

# Should return: test
```

### Test 2: THE ACTUAL TEST

**CRITICAL**: You're the app admin, so webhooks WILL work for you.

1. **Open Vercel logs in terminal** (keep this running):
   ```bash
   vercel logs --prod --follow
   ```

2. **From YOUR PERSONAL INSTAGRAM ACCOUNT:**
   - Go to the post on your NEW business account
   - Comment: "Interested!"

3. **Watch the Vercel logs:**
   - You should see webhook event received
   - Should show comment data

4. **Check Instagram DMs on your BUSINESS account:**
   - You (personal account) should receive a DM
   - DM contains signup link

5. **Click the signup link:**
   - Opens form with your IG username pre-filled
   - Fill out: name, email, phone
   - Submit

6. **Verify data saved:**
   ```bash
   npx prisma studio
   ```
   - Should see your lead in the database

---

## SUCCESS CRITERIA

✅ Comment posted from personal account
✅ Webhook received (in Vercel logs)
✅ DM sent automatically (check DMs)
✅ Form filled out
✅ Data in database (check Prisma Studio)

**If all 5 work: YOU'VE PROVEN AUTONOMOUS HANDOFF**

---

## TROUBLESHOOTING

### "Webhook not verified"
```
- Check META_VERIFY_TOKEN matches exactly: instagram_webhook_test_12345
- Check Vercel URL is correct HTTPS
- Check Vercel env vars are set (vercel env ls)
```

### "No webhook received after commenting"
```bash
# Check page subscription
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/subscribed_apps?access_token=YOUR_TOKEN"

# Should show: {"data": [{"id": "YOUR_APP_ID", ...}]}

# Check Vercel logs for errors
vercel logs --prod
```

### "DM not sent"
```bash
# Test if access token is valid
curl "https://graph.facebook.com/v19.0/me?access_token=YOUR_TOKEN"

# Should return page info, not error

# Check token hasn't expired (60 days)
```

### "Form doesn't save to database"
```bash
# Check database connection
npx prisma studio

# Check Vercel logs for database errors
vercel logs --prod

# Verify DATABASE_URL is set
vercel env ls
```

---

## ENVIRONMENT VARIABLES CHECKLIST

Before deploying, verify you have ALL 5:

```bash
DATABASE_URL=postgres://...
META_APP_SECRET=abc123...
META_VERIFY_TOKEN=instagram_webhook_test_12345
INSTAGRAM_ACCESS_TOKEN=EAAxxxxx...
INSTAGRAM_ACCOUNT_ID=17841234567890123
```

---

## THE PROOF

Once this works, you have:
- ✅ Real-time comment detection (webhook)
- ✅ Autonomous DM sending (zero human action)
- ✅ Lead capture with context (IG username)
- ✅ Persistent storage (database)

**Time saved**: 2-3 minutes per lead (no manual DM, no manual data entry)
**Scalability**: Handles hundreds of comments/day
**Human intervention**: ZERO

That's the proof. Let's execute.
