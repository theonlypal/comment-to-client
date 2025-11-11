# NEW vs EXISTING Instagram Account Workflows

**The Development Mode + Real Pages + App Roles approach works for BOTH scenarios.**

The ONLY difference is the initial setup. Once you have an Instagram Business account connected to a Facebook Page, the rest is identical.

---

## SCENARIO A: Brand New Instagram Account (From Scratch)

**Who this is for**: You're creating a new Instagram Business account RIGHT NOW to test this system.

**Time**: 35 minutes total

### Phase 1: Create Instagram Business Account (5 min)

#### Step 1: Create New Instagram Account
```
1. Log out of your personal Instagram
2. Create new account:
   - Email: Use new email or +alias (e.g., yourname+igtest@gmail.com)
   - Username: "test_business_2025" or similar
   - Password: Save it
```

#### Step 2: Convert to Business Account
```
1. Profile → Menu (3 lines) → Settings and privacy
2. Account type and tools → Switch to professional account
3. Select "Business"
4. Choose category (e.g., "Entrepreneur")
5. Skip contact info
6. Tap "Done"
```

#### Step 3: Create Facebook Page
```
1. Go to: https://facebook.com
2. Click "Create" → "Page"
3. Name: Same as your IG username
4. Category: "Brand or Product"
5. Click "Create Page"
6. Skip all setup steps
```

#### Step 4: Connect Instagram to Facebook Page
```
CRITICAL STEP - This enables API access

Option A (From Instagram):
1. Settings → Account Center
2. Click "Add Instagram account"

Option B (From Facebook):
1. Go to your new Page
2. Left sidebar → "Instagram"
3. Click "Connect Account"
4. Log in to your new IG Business account
5. Grant permissions

Verify:
- Instagram Settings → Business → Linked Accounts
- Should show your Facebook Page
```

#### Step 5: Post Something on Instagram
```
1. Post any photo/video on your new IG Business account
2. Caption: "Testing automation - comment 'interested' to try!"
3. This is what you'll comment on later to test
```

**✅ NOW PROCEED TO "UNIVERSAL WORKFLOW" BELOW**

---

## SCENARIO B: Existing Instagram Account (Plug and Play)

**Who this is for**: You already have an Instagram Business/Creator account connected to a Facebook Page.

**Time**: 30 minutes total (skips account creation)

### Phase 1: Verify Prerequisites (2 min)

#### Step 1: Verify Account Type
```
1. Open Instagram → Profile → Menu → Settings
2. Account type and tools → Account type
3. Should say "Business account" or "Creator account"

If NOT Business/Creator:
- Tap "Switch to professional account"
- Select "Business" or "Creator"
- Choose category
- Complete setup
```

#### Step 2: Verify Facebook Page Connection
```
1. Instagram → Settings → Business → Linked Accounts
2. Should show a Facebook Page linked

If NO Facebook Page:
- Go to https://facebook.com
- Create a Page (like Scenario A, Step 3-4)
- Connect it to your Instagram

How to connect:
- Facebook Page → Left sidebar → "Instagram"
- Click "Connect Account"
- Log in to your IG account
- Grant permissions
```

#### Step 3: Post Something (If No Recent Posts)
```
1. Post any photo/video (for testing later)
2. You'll comment on this to test the webhook
```

**✅ NOW PROCEED TO "UNIVERSAL WORKFLOW" BELOW**

---

## UNIVERSAL WORKFLOW (Same for Both Scenarios)

**From this point forward, there is ZERO difference between new and existing accounts.**

### Phase 2: Create Meta App (8 min)

#### Step 1: Create Developer App
```
1. Go to: https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" type
4. App name: "Instagram Lead Automation"
5. Contact email: your email
6. Click "Create App"

YOU ARE NOW THE APP ADMIN (automatically)
```

#### Step 2: Add Instagram Product
```
1. App dashboard → "Add Products"
2. Find "Instagram" → Click "Set Up"
3. This enables Instagram Graph API
```

#### Step 3: Save App Credentials
```
1. Settings → Basic
2. SAVE THESE:

   App ID: ________________
   App Secret: ________________ (click "Show")

3. CREATE a verify token (random string YOU choose):

   Verify Token: instagram_webhook_test_12345
```

---

### Phase 3: Get Access Tokens (10 min)

#### Step 1: Generate Short-Lived Token
```
1. Go to: https://developers.facebook.com/tools/explorer/
2. Meta App dropdown → Select YOUR app
3. Permissions dropdown → Add these:
   ✅ instagram_basic
   ✅ instagram_manage_comments
   ✅ pages_show_list
   ✅ pages_read_engagement

4. Click "Generate Access Token"
5. Popup → "Continue as <Your Name>"
6. Accept all permissions
7. COPY THE TOKEN

This expires in 1-2 hours. Exchange it next.
```

#### Step 2: Exchange for Long-Lived Token (60 days)
```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

Replace:
- `YOUR_APP_ID` - from Phase 2, Step 3
- `YOUR_APP_SECRET` - from Phase 2, Step 3
- `SHORT_TOKEN` - from Step 1 above

**Response:**
```json
{
  "access_token": "EAAxxxxxxxxxxxxx",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**SAVE THIS** - this is your `INSTAGRAM_ACCESS_TOKEN`

#### Step 3: Get Page ID
```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=LONG_LIVED_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "123456789012345",
      "name": "Your Page Name"
    }
  ]
}
```

**SAVE THE ID** - this is your `PAGE_ID`

#### Step 4: Get Instagram Account ID
```bash
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID?fields=instagram_business_account&access_token=LONG_LIVED_TOKEN"
```

**Response:**
```json
{
  "instagram_business_account": {
    "id": "17841234567890123"
  },
  "id": "123456789012345"
}
```

**SAVE THE instagram_business_account.id** - this is your `INSTAGRAM_ACCOUNT_ID`

---

### Phase 4: Set Up Database (3 min)

```bash
# 1. Go to: https://neon.tech
# 2. Sign in with GitHub
# 3. Create project: "instagram-automation"
# 4. Copy connection string

# Connection string:
postgres://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# SAVE THIS - this is your DATABASE_URL
```

**Run migrations:**
```bash
cd "C:\Users\Rayan Pal\comment-to-client"

echo DATABASE_URL="your_neon_connection_string" > .env

npx prisma migrate deploy

# Verify
npx prisma studio
# Should see empty "Lead" table
```

---

### Phase 5: Deploy to Vercel (7 min)

```bash
cd "C:\Users\Rayan Pal\comment-to-client"

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add ALL 5 environment variables
vercel env add DATABASE_URL production
# Paste Neon connection string

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

# You'll get:
# https://comment-to-client-xxxxx.vercel.app

# SAVE THIS URL
```

---

### Phase 6: Configure Webhook (5 min)

#### Step 1: Add Webhook in Meta Dashboard
```
1. Go to: https://developers.facebook.com/apps/
2. Select your app
3. Products → Webhooks → Instagram → "Edit Subscription"
4. Callback URL: https://your-vercel-url.vercel.app/api/webhooks/meta/instagram
5. Verify Token: instagram_webhook_test_12345
6. Click "Verify and Save"

Meta sends GET request. If successful:
✓ "Success" message appears
```

#### Step 2: Subscribe to Comment Field
```
1. Still in Webhooks section
2. Under "Instagram", check:
   ✅ comments
3. Click "Save"
```

#### Step 3: Subscribe Page to Webhooks
```bash
curl -X POST "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/subscribed_apps?subscribed_fields=feed&access_token=YOUR_LONG_LIVED_TOKEN"
```

**Should return:**
```json
{"success": true}
```

---

### Phase 7: TEST IT (2 min)

#### Test 1: Verify Webhook Endpoint
```bash
curl "https://your-vercel-url.vercel.app/api/webhooks/meta/instagram?hub.mode=subscribe&hub.verify_token=instagram_webhook_test_12345&hub.challenge=test"

# Should return: test
```

#### Test 2: End-to-End Autonomous Handoff

**WHY THIS WORKS IN DEVELOPMENT MODE:**
- You created the app → You're the app admin
- Webhooks fire for app admins even in Development Mode
- No app review required for YOUR OWN account

**Steps:**

1. **Open Vercel logs** (keep running):
   ```bash
   vercel logs --prod --follow
   ```

2. **Comment on your Instagram post**:
   - From your personal account (if testing new account)
   - OR from any account (if you're testing on existing account)
   - Comment: "Interested!"

3. **Watch Vercel logs**:
   - Should see webhook event received
   - Should show comment data

4. **Check Instagram DMs**:
   - Commenter receives auto-DM
   - DM contains signup link

5. **Click signup link**:
   - Opens form with IG username pre-filled
   - Fill out: name, email, phone
   - Submit

6. **Verify data saved**:
   ```bash
   npx prisma studio
   ```
   - Should see new lead in database

---

## KEY DIFFERENCES SUMMARY

| Step | Brand New Account | Existing Account |
|------|-------------------|------------------|
| **Create Instagram** | ✅ Required (5 min) | ❌ Already exists |
| **Convert to Business** | ✅ Required (2 min) | ⚠️ Verify it's Business/Creator |
| **Create Facebook Page** | ✅ Required (2 min) | ⚠️ Verify one exists |
| **Connect IG to Page** | ✅ Required (3 min) | ⚠️ Verify connection |
| **Create Meta App** | ✅ Required | ✅ Required |
| **Get Access Tokens** | ✅ Required | ✅ Required |
| **Set Up Database** | ✅ Required | ✅ Required |
| **Deploy to Vercel** | ✅ Required | ✅ Required |
| **Configure Webhook** | ✅ Required | ✅ Required |
| **Test** | ✅ Required | ✅ Required |

**Bottom line**: Existing accounts skip 10-15 minutes of setup. Everything else is IDENTICAL.

---

## CRITICAL FACTS

### Does Development Mode Work for BOTH Scenarios?

**YES.** Here's why:

1. **You create the Meta App** → You're the app admin (automatic)
2. **You own the Instagram account** → You're using your REAL account (not test account)
3. **You own the Facebook Page** → You're using your REAL page (not test page)
4. **Webhooks fire for app admins** → No app review required for YOUR actions

**What this means:**
- Brand NEW account: Works immediately after setup (no waiting period)
- EXISTING account: Works immediately after setup (no waiting period)

### Will Webhooks Work for Other People?

**In Development Mode: NO**
- Only works for app admins/developers/testers
- Public users won't trigger webhooks

**After App Review: YES**
- Submit for `instagram_manage_comments` permission
- Provide screen recording of flow
- Wait 1-7 days for approval
- Once approved: ALL users trigger webhooks

### Do I Need Advanced Access?

**NO.** Standard Access includes:
- `instagram_basic` - View basic account info
- `instagram_manage_comments` - Read and reply to comments
- `pages_show_list` - List Pages you manage

**You DON'T need Advanced Access for:**
- Webhooks (works in Standard Access)
- Commenting (works in Standard Access)
- DMs via Graph API (works in Standard Access)

---

## ENVIRONMENT VARIABLES (Same for Both)

```bash
# Database
DATABASE_URL=postgres://username:password@host/db?sslmode=require

# Meta Instagram
META_APP_SECRET=your_app_secret
META_VERIFY_TOKEN=instagram_webhook_test_12345
INSTAGRAM_ACCESS_TOKEN=EAAxxxxx (long-lived, 60 days)
INSTAGRAM_ACCOUNT_ID=17841234567890123
```

**That's it. 5 variables. Same for both scenarios.**

---

## TROUBLESHOOTING (Same for Both)

### "Webhook not verified"
```
- Check META_VERIFY_TOKEN matches: instagram_webhook_test_12345
- Check Vercel URL is HTTPS
- Check env vars are set: vercel env ls
```

### "No webhook after commenting"
```bash
# Check page subscription
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/subscribed_apps?access_token=YOUR_TOKEN"

# Should show your app ID

# Check Vercel logs
vercel logs --prod
```

### "DM not sent"
```bash
# Test access token
curl "https://graph.facebook.com/v19.0/me?access_token=YOUR_TOKEN"

# Should return page info (not error)
```

---

## THE PROOF (Same for Both)

Once this works, you've proven:
- ✅ Comment detected automatically (webhook)
- ✅ DM sent automatically (zero human action)
- ✅ Form filled by user
- ✅ Data saved to database

**Autonomous handoff. Zero intervention. Working system.**

**Time saved per lead**: 2-3 minutes
**Scalability**: Hundreds of comments/day
**Works for**: Brand new OR existing Instagram accounts

---

## BOTTOM LINE

**The approach is IDENTICAL for both scenarios.**

The ONLY difference is:
- New account: Create Instagram + Facebook Page first (10 min)
- Existing account: Skip directly to Meta App creation

**Development Mode + Real Pages + App Roles = WEBHOOKS WORK FOR BOTH**

Let's execute.
