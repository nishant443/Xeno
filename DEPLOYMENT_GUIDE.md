# Xeno Deployment Guide

This guide covers:
1. **Local setup** — fix MySQL connection error
2. **Deploy to Render** — step-by-step instructions

---

## Part 1: Fix Local MySQL Connection

Your error: `connect ETIMEDOUT` means the backend can't reach the database.

### Option A: Use Local MySQL (Quick for development)

1. **Ensure MySQL is running locally** (Windows):
   ```powershell
   # Check if MySQL service is running
   Get-Service MySQL80
   # or if you have a different version
   Get-Service MySQL*
   ```
   If not running, start it:
   ```powershell
   Start-Service MySQL80
   ```

2. **Create the local database**:
   ```powershell
   mysql -u root -p
   # Enter password when prompted
   ```
   Then in MySQL console:
   ```sql
   CREATE DATABASE IF NOT EXISTS xeno_assignment;
   EXIT;
   ```

3. **Update `backend/.env`** for local development:
   ```
   PORT=4000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=xeno_assignment
   DB_USER=root
   DB_PASSWORD=Recursion@123
   
   SHOPIFY_API_KEY=f7cfb779814c24044017afd6ed6d9913
   SHOPIFY_API_SECRET=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
   SHOPIFY_ACCESS_TOKEN=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
   
   WEBHOOK_SECRET=your_webhook_shared_secret
   JWT_SECRET=dev_secret_key_change_in_production
   ```

4. **Start backend**:
   ```powershell
   cd backend
   npm run dev
   ```

### Option B: Use Remote MySQL from Railway (if credentials work)

If the Railway credentials are correct:
- Test connection: `mysql -h metro.proxy.rlwy.net -P 28200 -u root -p`
- Ensure your firewall allows outbound port 28200
- **Note**: Railway free tier may have connection issues; Render's managed database is more reliable

---

## Part 2: Deploy to Render

### Step 1: Create a managed MySQL database on Render

1. Log in to https://render.com
2. Go to **Dashboard** → **New** → **MySQL**
3. Fill in:
   - **Name**: `xeno-db`
   - **Database**: `xeno_assignment`
   - **Username**: `xeno_user` (or any name)
   - **Password**: (Render generates one, or set your own strong password)
   - **Region**: Pick closest to you
4. Click **Create Database**
5. Copy the connection details (you'll see `Internal Database URL` and `External Database URL`)
   - Example: `mysql://username:password@host:port/dbname`

### Step 2: Deploy Backend to Render

1. **Connect repo to Render**:
   - Go to Render Dashboard → **New** → **Web Service**
   - Connect your GitHub repo (`nishant443/Xeno`)
   - Branch: `main`
   - **Root Directory**: `backend`

2. **Configure Build & Start**:
   - Build Command: (leave empty — Node doesn't need build)
   - Start Command: `npm run start`
   - Instance Type: **Free** (or Starter for production)

3. **Add Environment Variables**:
   Click **Add Secret File** or use the env vars form:

   ```
   PORT=4000
   NODE_ENV=production
   
   DB_HOST=<your-render-db-host>
   DB_PORT=3306
   DB_NAME=xeno_assignment
   DB_USER=<your-render-db-user>
   DB_PASSWORD=<your-render-db-password>
   
   SHOPIFY_API_KEY=f7cfb779814c24044017afd6ed6d9913
   SHOPIFY_API_SECRET=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
   SHOPIFY_ACCESS_TOKEN=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
   
   WEBHOOK_SECRET=your_webhook_shared_secret
   JWT_SECRET=<generate-a-random-secure-string>
   ```

4. **Deploy**:
   - Click **Create Web Service**
   - Wait for deployment (2-3 minutes)
   - Copy the service URL (e.g., `https://xeno-backend-abc.onrender.com`)

5. **Check Logs**:
   - If it fails, click the service → **Logs**
   - Look for DB connection errors
   - Adjust env vars if needed

### Step 3: Deploy Frontend to Render

1. **Create Static Site on Render**:
   - Go to Render Dashboard → **New** → **Static Site**
   - Connect same GitHub repo
   - Branch: `main`
   - **Root Directory**: `frontend`

2. **Configure Build**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Add Environment Variable**:
   - `VITE_API_URL=https://xeno-backend-abc.onrender.com/api`
   (Replace with your actual backend URL from Step 2)

4. **Deploy**:
   - Click **Create Static Site**
   - Wait for build and deployment
   - Copy the frontend URL (e.g., `https://xeno-frontend-xyz.onrender.com`)

### Step 4: Test Deployed App

1. Open frontend URL in browser
2. Try logging in
3. Check browser console for any errors
4. If API calls fail, verify `VITE_API_URL` is correct

---

## Troubleshooting

### Backend won't start locally

**Error**: `connect ETIMEDOUT`

**Solutions**:
1. Check MySQL is running: `Get-Service MySQL80`
2. Check credentials in `.env` match your local MySQL setup
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Try a simpler `.env` (use localhost, not remote host)

### Backend deployed but can't reach DB on Render

1. Verify env vars are set correctly (typos in DB_HOST, etc.)
2. Check Render MySQL is in same region or has external access enabled
3. Wait 30 seconds after creating DB before deploying backend
4. View backend logs: `Settings` → `Logs` tab

### Frontend can't reach backend API

1. Verify `VITE_API_URL` is set to correct backend URL + `/api`
2. Check browser console (DevTools → Console) for CORS or 404 errors
3. Test backend directly: `curl https://backend-url/health`

---

## Quick Copy-Paste Commands

### Local dev environment (Windows PowerShell)

```powershell
# 1. Start MySQL
Start-Service MySQL80

# 2. Create database
mysql -u root -p Recursion@123 -e "CREATE DATABASE IF NOT EXISTS xeno_assignment;"

# 3. Update .env (backend/.env)
# Set DB_HOST=localhost, DB_PORT=3306, DB_NAME=xeno_assignment, DB_USER=root, DB_PASSWORD=Recursion@123

# 4. Start backend
cd backend
npm install
npm run dev

# 5. In another terminal, start frontend
cd frontend
npm install
npm run dev

# 6. Open http://localhost:5173 in browser
```

### Generate JWT_SECRET for production

```powershell
# PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
```

---

## Security Notes

⚠️ **IMPORTANT**: The Shopify keys in your `.env` are now visible in the git history. After deployment:

1. **Rotate Shopify credentials**:
   - Go to Shopify Admin → Apps and integrations → API credentials
   - Regenerate API key, secret, and access token
   - Update Render env vars with new values

2. **Use Render Secrets for sensitive data**:
   - Never commit `.env` to git
   - Add `.env` to `.gitignore`
   - Set secrets via Render dashboard (not in code)

---

## Next Steps

1. **Choose**: Fix local setup (Option A) or deploy to Render (Part 2)
2. **Test**: Verify backend and frontend work
3. **Rotate secrets** if keys were committed to public repo
4. **Monitor**: Check Render logs if issues occur

Need help? Let me know which step you're stuck on.
