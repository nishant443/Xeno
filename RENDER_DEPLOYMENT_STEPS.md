# Render Deployment: Step-by-Step

## Prerequisites

✅ GitHub repo: `nishant443/Xeno` (already connected)
✅ Backend in `/backend` folder
✅ Frontend in `/frontend` folder

---

## Step 1: Rotate Shopify Credentials (IMPORTANT!)

Your Shopify keys are visible in the git history. Rotate them first:

1. Go to **Shopify Admin** → **Settings** → **Apps and integrations** → **API credentials**
2. Regenerate:
   - API key
   - API secret
   - Access token
3. Copy the new values — you'll add them to Render later

---

## Step 2: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Sign up (or log in)
3. Click **Dashboard** → **New** → **GitHub**
4. Connect your GitHub account
5. Grant access to `nishant443/Xeno` repo

---

## Step 3: Deploy Backend (Web Service)

1. In Render Dashboard: **New** → **Web Service**
2. Select your Xeno repo
3. Fill in:
   - **Name**: `xeno-backend`
   - **Branch**: `main`
   - **Root Directory**: `backend` ← IMPORTANT
   - **Runtime**: Node
   - **Build Command**: `npm install` (or leave blank)
   - **Start Command**: `npm run start`
   - **Instance Type**: Free

4. Click **Create Web Service**
5. Wait for first deployment (2-3 minutes)
6. Once deployed, note the URL: `https://xeno-backend-XXXXX.onrender.com`

---

## Step 4: Create & Attach MySQL Database

1. In Render Dashboard: **New** → **MySQL**
2. Fill in:
   - **Name**: `xeno-db`
   - **Database**: `xeno_assignment`
   - **Username**: `xeno_user`
   - **Password**: (generate strong password or create one)
   - **Region**: `Oregon` (or your closest region)
3. Click **Create Database**
4. Wait for database to be ready (1-2 minutes)
5. Copy the connection details shown

---

## Step 5: Connect Database to Backend

1. Go to **xeno-backend** service (Web Service)
2. Click **Environment** tab
3. Add these environment variables (from your DB details):

   ```
   DB_HOST=<your-render-db-host>
   DB_PORT=3306
   DB_NAME=xeno_assignment
   DB_USER=xeno_user
   DB_PASSWORD=<your-db-password>
   ```

4. Add Shopify credentials (use NEW rotated values):

   ```
   SHOPIFY_API_KEY=<your-new-api-key>
   SHOPIFY_API_SECRET=<your-new-api-secret>
   SHOPIFY_ACCESS_TOKEN=<your-new-access-token>
   WEBHOOK_SECRET=your_webhook_shared_secret
   JWT_SECRET=<generate-random-string>
   ```

5. Click **Save**
6. Backend will redeploy automatically

7. **Check Logs**: If it fails, click **Logs** tab and look for DB connection errors

---

## Step 6: Deploy Frontend (Static Site)

1. In Render Dashboard: **New** → **Static Site**
2. Select Xeno repo
3. Fill in:
   - **Name**: `xeno-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend` ← IMPORTANT
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Click **Create Static Site**
5. Once deployed, note the URL: `https://xeno-frontend-XXXXX.onrender.com`

---

## Step 7: Connect Frontend to Backend

1. Go to **xeno-frontend** service (Static Site)
2. Click **Environment** tab
3. Add environment variable:

   ```
   VITE_API_URL=https://xeno-backend-XXXXX.onrender.com/api
   ```
   (Replace XXXXX with your actual backend name from Step 3)

4. Click **Save**
5. Frontend will rebuild automatically

---

## Step 8: Test the Deployment

1. Open your frontend URL in browser: `https://xeno-frontend-XXXXX.onrender.com`
2. Try logging in (use credentials you created in DB)
3. Check browser console (F12) for any API errors
4. If login fails, verify:
   - `VITE_API_URL` is correct
   - Backend is running (check backend logs)
   - DB connection works (check backend logs for errors)

---

## Step 9: Verify Backend Health

Test backend directly:

```bash
curl https://xeno-backend-XXXXX.onrender.com/health
```

Expected response: `{"status":"ok"}`

Test metrics endpoint (replace with actual URL):

```bash
curl https://xeno-backend-XXXXX.onrender.com/api/metrics \
  -H "Authorization: Bearer <your-auth-token>"
```

---

## Troubleshooting

### Backend won't start

**Check logs**: xeno-backend → **Logs** tab

Common errors:
- `ECONNREFUSED` — DB not ready. Wait 2 minutes, manually redeploy.
- `ER_ACCESS_DENIED_ERROR` — Wrong DB credentials. Check env vars match database.
- `ER_UNKNOWN_DATABASE` — Database doesn't exist. Render creates it automatically; if missing, recreate.

**Fix**: Update env vars → Save → Backend auto-redeploys

### Frontend shows "API error" or 404

1. Check `VITE_API_URL` in frontend environment variables
2. Verify backend URL is correct (no trailing slash on `/api`)
3. Check browser console (F12 → Console tab) for actual error
4. Rebuild frontend: Click **Redeploy** button on frontend service

### Database connection timeout

1. Ensure DB is in same region as backend (or external access enabled)
2. Wait 30 seconds after creating DB before deploying backend
3. Check firewall: Render has no firewall, so should work
4. Manually redeploy backend after DB is fully ready

---

## Post-Deployment

### 1. Update Shopify App Settings

If you have a Shopify app configured:

- Update callback URLs to use new Render domain
- Update webhook endpoints to: `https://xeno-backend-XXXXX.onrender.com/api/webhooks`
- Test webhooks in Shopify Admin

### 2. Run Initial Ingestion

1. Log in to frontend
2. Click **Run ingestion** button
3. Check backend logs for any Shopify API errors

### 3. Monitor Logs

- Keep logs open during testing
- Watch for errors or warnings
- Address any issues before going live

### 4. Set Up Custom Domain (Optional)

1. In Render service settings: **Custom Domain**
2. Add your domain (e.g., `xeno.yourdomain.com`)
3. Follow DNS instructions
4. Update `VITE_API_URL` if using custom backend domain

---

## URLs to Save

- **Frontend**: https://xeno-frontend-XXXXX.onrender.com
- **Backend**: https://xeno-backend-XXXXX.onrender.com
- **Health Check**: https://xeno-backend-XXXXX.onrender.com/health
- **Render Dashboard**: https://dashboard.render.com

---

## Cost

- **Backend (Web Service)**: Free tier (sleeps after 15 mins inactivity, no SSL certificate limit)
- **Frontend (Static Site)**: Free tier (unlimited)
- **Database (MySQL)**: Free tier (1 GB storage)

Total: **FREE** (upgrade anytime if needed)

---

## Next Steps

1. Follow Steps 1-9 above
2. Test the app thoroughly
3. Add custom domain if desired
4. Monitor Render logs for issues
5. Set up alerts (optional)

Any issues? Check the troubleshooting section or post backend logs here.
