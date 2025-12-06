# Deployment Troubleshooting Guide

## Quick Diagnostics

### 1. Check Browser Console (F12)
Open your frontend URL and press **F12** → **Console** tab. Look for:
- `CORS errors` → Backend CORS not allowing frontend origin
- `404 Not Found on /api/...` → Backend URL wrong or not running
- `Connection refused` → Backend not responding
- Network errors → Check `VITE_API_URL`

### 2. Test Backend Directly
In browser or terminal, try:
```
https://xeno-backend-XXXXX.onrender.com/api/health
```

Should return: `{"status":"ok"}`

If fails → Backend not deployed or crashed

---

## Most Common Issues & Fixes

### ❌ Issue: Frontend can't connect to backend (Network Error)

**Cause**: `VITE_API_URL` not set on Render frontend Static Site

**Fix**:
1. Go to Render Dashboard → **xeno-frontend**
2. Click **Environment** tab
3. Verify this variable exists:
   ```
   VITE_API_URL=https://xeno-backend-XXXXX.onrender.com/api
   ```
   (Replace XXXXX with your actual backend name)
4. **Important**: Must include `/api` at the end
5. Click **Save** → Frontend rebuilds automatically
6. Wait 2-3 minutes, refresh browser

---

### ❌ Issue: CORS Error (blocked by browser)

**Cause**: Frontend URL not in backend's allowedOrigins

**Fix**:
1. Get your exact frontend URL: `https://xeno-frontend-XXXXX.onrender.com`
2. Edit `backend/src/app.js`
3. Update the `allowedOrigins` array to include your frontend URL:
   ```javascript
   const allowedOrigins = [
       "http://localhost:5173",
       "https://xeno-frontend-XXXXX.onrender.com"  // ← Update this
   ];
   ```
4. Push changes to GitHub
5. Render backend redeploys automatically
6. Wait 2-3 minutes

---

### ❌ Issue: Backend crashes (INTERNAL SERVER ERROR)

**Cause**: Database connection failed

**Fix**:
1. Go to Render Dashboard → **xeno-backend** → **Logs** tab
2. Look for database errors like:
   - `ENOTFOUND metro.proxy.rlwy.net` → Railway domain wrong
   - `ECONNREFUSED` → Railway DB not running
   - `ER_ACCESS_DENIED_FOR_USER` → Wrong credentials
3. Verify environment variables in backend:
   - `DB_HOST=metro.proxy.rlwy.net`
   - `DB_PORT=28200`
   - `DB_USER=root`
   - `DB_PASSWORD=<correct-password>`
   - `DB_NAME=railway`
4. If Railway credentials are wrong, ask DevOps for new credentials
5. Update in Render → **xeno-backend** → **Environment**
6. Click **Save** to redeploy

---

### ❌ Issue: Login page loads but credentials don't work

**Cause**: Either DB not synced or wrong JWT secret

**Fix**:
1. Verify backend is running:
   ```
   https://xeno-backend-XXXXX.onrender.com/api/health
   ```
2. Check backend logs for DB sync errors
3. Ensure `JWT_SECRET` is set in backend environment (any random string)
4. Test with test credentials (if created in DB migration)
5. If no test user exists, you need to seed the database

---

### ❌ Issue: Frontend shows blank page or 404

**Cause**: Static site not built or wrong publish directory

**Fix**:
1. Go to Render Dashboard → **xeno-frontend** → **Logs** tab
2. Check if build succeeded
3. Verify:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Manual redeploy:
   - Go to **Deployments** tab
   - Click **Deploy** button
5. Wait for build to complete (check logs)

---

## Step-by-Step Verification Checklist

Run through this in order:

- [ ] **1. Frontend loads**: Open `https://xeno-frontend-XXXXX.onrender.com` → See login page?
  - No → Check Render frontend logs for build errors
  - Yes → Continue to step 2

- [ ] **2. Backend health check**: Test `https://xeno-backend-XXXXX.onrender.com/api/health`
  - Returns `{"status":"ok"}` → Continue to step 3
  - Network error → Backend crashed, check logs
  - 404 → Wrong backend URL

- [ ] **3. Check browser console**: F12 → Console tab
  - Any CORS errors → Fix CORS in backend/src/app.js
  - Any connection errors → Update VITE_API_URL
  - No errors → Continue to step 4

- [ ] **4. Try login**: Enter any credentials and submit
  - Success → All working!
  - Network error → Backend crashed (check DB connection)
  - Auth error → Wrong JWT secret or DB not synced

- [ ] **5. Check Render backend logs**: Go to **xeno-backend** → **Logs** tab
  - Look for `✅ Database connected successfully`
  - Look for any `❌` errors
  - If DB errors, fix environment variables and redeploy

---

## Getting Help

When asking for help, provide:

1. **Your deployed URLs**:
   - Frontend: `https://xeno-frontend-...`
   - Backend: `https://xeno-backend-...`

2. **Error message** (from browser console or Render logs)

3. **What works**:
   - Does frontend load?
   - Does backend health check work?
   - What buttons/actions cause errors?

4. **Recent changes** (if any)

---

## Render Debugging Commands

In terminal:

```bash
# Check if backend is running
curl https://xeno-backend-XXXXX.onrender.com/api/health

# Check if frontend is accessible
curl https://xeno-frontend-XXXXX.onrender.com

# (Can't SSH into Render free tier, logs are via dashboard)
```

---

## Nuclear Options (Last Resort)

If nothing works:

1. **Delete and redeploy**:
   - Delete backend service from Render
   - Delete frontend service from Render
   - Start fresh from Step 3 of RENDER_DEPLOYMENT_STEPS.md

2. **Check git history**:
   - Make sure `.env` is in `.gitignore`
   - Verify latest code is pushed to GitHub `main` branch
   - Render pulls from this branch

3. **Restart services**:
   - Render Dashboard → Service → **Manual Deploy** button
   - This triggers a fresh deployment

---
