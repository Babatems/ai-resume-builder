# Deployment Guide - AI Resume Builder

## Backend Deployment (Railway - Recommended)

Railway offers free hosting with MongoDB integration.

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create a new project

### Step 2: Deploy Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `Babatems/ai-resume-builder`
4. Railway will auto-detect the Node.js app

### Step 3: Add MongoDB

1. In your Railway project, click **"New"**
2. Select **"Database" → "MongoDB"**
3. Railway will provision a MongoDB instance
4. Copy the connection string

### Step 4: Set Environment Variables

In Railway project settings, add these variables:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=<generate-random-secure-string>
MONGODB_URI=<paste-railway-mongodb-connection-string>
HUGGING_FACE_API_KEY=<your-huggingface-api-key>
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Set Start Command

In Railway settings:
- **Start Command:** `cd backend && npm start`
- **Build Command:** `cd backend && npm install`

### Step 6: Deploy

Railway will auto-deploy. You'll get a URL like:
```
https://ai-resume-builder-production.up.railway.app
```

---

## Alternative: Render.com Deployment

### Step 1: Sign Up

1. Go to [render.com](https://render.com)
2. Sign in with GitHub

### Step 2: Create Web Service

1. Click **"New" → "Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name:** ai-resume-builder-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 3: Add Environment Variables

Same as Railway above.

### Step 4: Add MongoDB

1. Create a MongoDB instance on MongoDB Atlas (free tier)
2. Get connection string
3. Add to environment variables

---

## Frontend Deployment (Netlify - Already Done)

Your frontend is already on Netlify. Now update it to connect to your deployed backend:

### Step 1: Update Environment Variables in Netlify

1. Go to Netlify Dashboard
2. Select your site
3. **Site Settings → Environment Variables**
4. Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

### Step 2: Redeploy

Trigger a new deploy in Netlify to pick up the environment variable.

---

## Testing Deployed Backend

Once deployed, test your backend:

### Health Check
```bash
curl https://your-backend-url.railway.app/api/health
```

Expected response:
```json
{
  "status": "Backend is running",
  "timestamp": "2026-03-06T...",
  "version": "1.0.0"
}
```

### Test Signup
```bash
curl -X POST https://your-backend-url.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

## Quick Deploy Checklist

- [ ] Backend deployed to Railway/Render
- [ ] MongoDB provisioned and connected
- [ ] Environment variables set
- [ ] Backend health check passes
- [ ] Frontend VITE_API_URL updated in Netlify
- [ ] Frontend redeployed
- [ ] Signup/Login working end-to-end
- [ ] CORS configured correctly
- [ ] Hugging Face API key added

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Make sure `ALLOWED_ORIGINS` includes your Netlify URL
2. Check backend logs for CORS rejection messages

### MongoDB Connection Failed

1. Verify MongoDB connection string is correct
2. Check IP whitelist in MongoDB Atlas (if using Atlas)
3. Ensure Railway MongoDB is running

### 502 Bad Gateway

1. Check backend logs in Railway/Render
2. Verify start command is correct: `node server.js`
3. Ensure PORT environment variable is set

### Authentication Fails

1. Check JWT_SECRET is set
2. Verify bcryptjs is installed in production
3. Check MongoDB connection

---

## Cost Breakdown

**Free Tier:**
- **Railway:** 500 hours/month, MongoDB included
- **Render:** 750 hours/month
- **MongoDB Atlas:** 512MB free
- **Netlify:** Unlimited static hosting
- **Total:** $0/month

**Paid Tier (If Needed):**
- Railway Pro: $5/month
- MongoDB Atlas M2: $9/month
- Total: ~$14/month

---

Last Updated: March 6, 2026
