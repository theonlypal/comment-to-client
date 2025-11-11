# GET YOUR VALUES - Exact Environment Variables Needed

**You need EXACTLY 6 environment variables to make this work.**

This guide shows you WHERE to get each value and HOW to extract it.

---

## Required Values (6 Total)

```bash
1. DATABASE_URL           # From Neon (PostgreSQL database)
2. META_APP_SECRET        # From Meta Developer Dashboard
3. META_VERIFY_TOKEN      # YOU create this (any random string)
4. INSTAGRAM_ACCESS_TOKEN # From Meta Graph API Explorer
5. INSTAGRAM_ACCOUNT_ID   # From Meta Graph API call
6. PUBLIC_APP_BASE_URL    # Your Vercel deployment URL
```

---

## VALUE 1: DATABASE_URL

**Where**: Neon PostgreSQL (https://neon.tech)

**Steps**:
1. Go to https://neon.tech
2. Sign in with GitHub
3. Click "Create Project"
   - Name: `instagram-automation`
   - Region: Choose closest to you
   - PostgreSQL version: 16 (default)
4. Click "Create Project"
5. **COPY THE CONNECTION STRING** - It looks like:

```
postgresql://username:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Example**:
```
DATABASE_URL=postgresql://alex_user:AbCd1234567890xyZ@ep-cool-mountain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**THIS IS YOUR `DATABASE_URL`** ✅

---

## VALUE 2: META_APP_SECRET

**Where**: Meta Developer Dashboard

**Steps**:
1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" type
4. Fill in:
   - App name: `Instagram Lead Automation`
   - Contact email: your email
5. Click "Create App"
6. Go to **Settings → Basic** (left sidebar)
7. Find "App Secret" field
8. Click "Show" button
9. **COPY THE VALUE**

**Example**:
```
META_APP_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**THIS IS YOUR `META_APP_SECRET`** ✅

**ALSO SAVE YOUR APP ID** (you'll need it later):
```
App ID: 1234567890123456
```

---

## VALUE 3: META_VERIFY_TOKEN

**Where**: YOU CREATE THIS

**What**: Any random string you want (used to verify webhook setup)

**How**: Just make up a random string. Use letters, numbers, underscores.

**Example**:
```
META_VERIFY_TOKEN=instagram_webhook_test_xyz_2025
```

**THIS IS YOUR `META_VERIFY_TOKEN`** ✅

**Important**: Remember this value - you'll use it when setting up webhooks later.

---

## VALUE 4: INSTAGRAM_ACCESS_TOKEN

**Where**: Meta Graph API Explorer

**This is the most complex one. Follow carefully.**

### Step 4A: Add Instagram Product to Your App

1. Go back to your Meta App dashboard
2. In left sidebar, find **"Add Products"**
3. Scroll to find **"Instagram"**
4. Click **"Set Up"**
5. This enables Instagram Graph API for your app

### Step 4B: Generate Short-Lived Token

1. Go to https://developers.facebook.com/tools/explorer/
2. At the top, find dropdown that says "Meta App"
3. Select **YOUR APP** (the one you just created)
4. Click "Permissions" dropdown → "Add permission"
5. Search for and add these permissions:
   - ✅ `instagram_basic`
   - ✅ `instagram_manage_comments`
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`
6. Click "Generate Access Token" button
7. Popup appears → Click "Continue as <Your Name>"
8. Review permissions → Click "OK"
9. **COPY THE TOKEN** (shown in "Access Token" field)

**THIS TOKEN EXPIRES IN 1-2 HOURS**. We need to exchange it for a long-lived token (60 days).

### Step 4C: Exchange for Long-Lived Token

Open Command Prompt and run this curl command:

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

**Replace**:
- `YOUR_APP_ID` → App ID from VALUE 2 (e.g., `1234567890123456`)
- `YOUR_APP_SECRET` → META_APP_SECRET from VALUE 2
- `SHORT_TOKEN` → The token you copied in Step 4B

**Response**:
```json
{
  "access_token": "EAANvOZC9oZBpoBOxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**COPY THE `access_token` VALUE**

**Example**:
```
INSTAGRAM_ACCESS_TOKEN=EAANvOZC9oZBpoBOxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**THIS IS YOUR `INSTAGRAM_ACCESS_TOKEN`** ✅

**This token lasts 60 days**, so you'll need to refresh it every 2 months.

---

## VALUE 5: INSTAGRAM_ACCOUNT_ID

**Where**: Meta Graph API call

**Requires**: Your long-lived token from VALUE 4

### Step 5A: Get Your Page ID

Run this curl command:

```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=YOUR_LONG_LIVED_TOKEN"
```

**Replace**:
- `YOUR_LONG_LIVED_TOKEN` → INSTAGRAM_ACCESS_TOKEN from VALUE 4

**Response**:
```json
{
  "data": [
    {
      "access_token": "EAAxxxxx",
      "category": "Brand",
      "category_list": [...],
      "name": "Your Page Name",
      "id": "123456789012345",
      "tasks": ["ANALYZE", "ADVERTISE", ...]
    }
  ],
  "paging": {...}
}
```

**SAVE THE `id` VALUE** - This is your PAGE_ID (e.g., `123456789012345`)

### Step 5B: Get Instagram Account ID from Page ID

Run this curl command:

```bash
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID?fields=instagram_business_account&access_token=YOUR_LONG_LIVED_TOKEN"
```

**Replace**:
- `YOUR_PAGE_ID` → The `id` from Step 5A (e.g., `123456789012345`)
- `YOUR_LONG_LIVED_TOKEN` → INSTAGRAM_ACCESS_TOKEN from VALUE 4

**Response**:
```json
{
  "instagram_business_account": {
    "id": "17841234567890123"
  },
  "id": "123456789012345"
}
```

**COPY THE `instagram_business_account.id` VALUE**

**Example**:
```
INSTAGRAM_ACCOUNT_ID=17841234567890123
```

**THIS IS YOUR `INSTAGRAM_ACCOUNT_ID`** ✅

---

## VALUE 6: PUBLIC_APP_BASE_URL

**Where**: Vercel deployment URL

**When**: After you deploy to Vercel

**You'll get this value AFTER deploying.** For now, use a placeholder:

```
PUBLIC_APP_BASE_URL=https://your-app-name.vercel.app
```

### After Deploying:

When you run `vercel --prod`, you'll see output like:

```
✅ Production: https://comment-to-client-abc123xyz.vercel.app [2s]
```

**UPDATE YOUR ENV VAR** with the actual URL:

```bash
vercel env add PUBLIC_APP_BASE_URL production
# Paste: https://comment-to-client-abc123xyz.vercel.app
```

**Example**:
```
PUBLIC_APP_BASE_URL=https://comment-to-client-abc123xyz.vercel.app
```

**THIS IS YOUR `PUBLIC_APP_BASE_URL`** ✅

---

## ✅ FINAL CHECKLIST

You should now have ALL 6 values:

```bash
# 1. Database (from Neon)
DATABASE_URL=postgresql://username:password@host.neon.tech/neondb?sslmode=require

# 2. App Secret (from Meta Dashboard)
META_APP_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# 3. Verify Token (YOU created this)
META_VERIFY_TOKEN=instagram_webhook_test_xyz_2025

# 4. Long-Lived Access Token (from Graph API)
INSTAGRAM_ACCESS_TOKEN=EAANvOZC9oZBpoBOxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 5. Instagram Account ID (from Graph API call)
INSTAGRAM_ACCOUNT_ID=17841234567890123

# 6. Public App URL (from Vercel deployment)
PUBLIC_APP_BASE_URL=https://comment-to-client-abc123xyz.vercel.app
```

---

## 🚀 NEXT STEPS

Once you have all 6 values:

1. **Create `.env` file locally**:
   ```bash
   cd "C:\Users\Rayan Pal\comment-to-client"

   # Copy example
   copy .env.example .env

   # Edit .env and paste your values
   notepad .env
   ```

2. **Run database migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel login
   vercel link

   # Add each env var:
   vercel env add DATABASE_URL production
   vercel env add META_APP_SECRET production
   vercel env add META_VERIFY_TOKEN production
   vercel env add INSTAGRAM_ACCESS_TOKEN production
   vercel env add INSTAGRAM_ACCOUNT_ID production
   vercel env add PUBLIC_APP_BASE_URL production

   # Deploy
   vercel --prod
   ```

4. **Configure webhook** (see EXECUTE_NOW.md Phase 6)

5. **TEST IT** 🎉

---

## 📋 QUICK REFERENCE CURL COMMANDS

### Exchange token for long-lived (60 days):
```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

### Get Page ID:
```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=LONG_LIVED_TOKEN"
```

### Get Instagram Account ID:
```bash
curl "https://graph.facebook.com/v19.0/PAGE_ID?fields=instagram_business_account&access_token=LONG_LIVED_TOKEN"
```

### Test access token validity:
```bash
curl "https://graph.facebook.com/v19.0/me?access_token=YOUR_TOKEN"
```

### Test webhook endpoint:
```bash
curl "https://your-app.vercel.app/api/webhooks/meta/instagram?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test"
```

---

## 🛟 TROUBLESHOOTING

### "Invalid OAuth access token"
- Your token expired (60 days max)
- Re-run Step 4B and 4C to get new token

### "No Instagram business account found"
- Verify your Instagram is converted to Business account
- Verify it's connected to a Facebook Page
- Check connection: Instagram Settings → Business → Linked Accounts

### "Permission error"
- Re-generate token in Graph API Explorer
- Make sure all 4 permissions are checked (Step 4B)

### "Page not found"
- Use correct PAGE_ID from Step 5A
- Make sure you're using YOUR page, not someone else's

---

## 🎯 THAT'S IT

You now have EVERYTHING you need to run this system.

**Total time to get all values**: ~15-20 minutes

**Once you have them**: System works autonomously forever (until token expires in 60 days).

Let's execute. 🚀
