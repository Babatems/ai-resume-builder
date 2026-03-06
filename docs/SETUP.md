# AI Resume Builder - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org)
- **MongoDB** (local or MongoDB Atlas) - [Download](https://www.mongodb.com)
- **Git** - [Download](https://git-scm.com)

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone https://github.com/Babatems/ai-resume-builder.git
cd ai-resume-builder
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Backend Setup

Navigate to backend folder:
```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
JWT_SECRET=your_super_secret_jwt_key_change_this
HUGGING_FACE_API_KEY=your_huggingface_api_key_here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

**Getting Hugging Face API Key:**
1. Go to [huggingface.co](https://huggingface.co)
2. Create free account
3. Go to Settings → Access Tokens
4. Create new token with "read" permissions
5. Copy token to `.env` file

### 4. Frontend Setup

Navigate to frontend folder:
```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/` folder:
```bash
VITE_API_URL=http://localhost:5000/api
```

### 5. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Or on Windows:
net start MongoDB

# Or on Mac:
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

### 6. Run the Application

**Option 1: Run both (recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Run separately**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in new terminal):
```bash
cd frontend
npm run dev
```

### 7. Verify Installation

1. **Backend:** Open http://localhost:5000/api/health
   - Should show: `{"status":"Backend is running"}`

2. **Frontend:** Open http://localhost:5173
   - Should load the React app

3. **MongoDB:** Check connection in backend console
   - Should show: `✅ MongoDB connected`

## Troubleshooting

### MongoDB Connection Failed

**Problem:** Cannot connect to MongoDB

**Solutions:**
- Ensure MongoDB service is running: `mongod`
- Check port 27017 is not in use
- Verify `MONGODB_URI` in `.env`
- Try MongoDB Compass for GUI access

### Hugging Face API Errors

**Problem:** AI optimization not working

**Solutions:**
- Verify API key in `.env`
- Check Hugging Face account is active
- Ensure model `mistralai/Mistral-7B-Instruct-v0.1` is accessible
- Wait if rate limited (free tier has limits)

### CORS Errors

**Problem:** Frontend can't reach backend

**Solutions:**
- Ensure backend is running on port 5000
- Check `ALLOWED_ORIGINS` in backend `.env`
- Verify `VITE_API_URL` in frontend `.env`
- Clear browser cache

### Port Already in Use

**Problem:** Port 5000 or 5173 in use

**Solutions:**
```bash
# Windows - kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change port in `.env` files

### NPM Install Errors

**Problem:** Dependencies won't install

**Solutions:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Testing the Application

### Manual Testing Flow

1. **Sign Up**
   - Go to http://localhost:5173/signup
   - Create account with email/password
   - Verify JWT token returned

2. **Upload Resume**
   - Click "Upload Resume"
   - Select PDF/DOCX file
   - Verify file uploaded successfully

3. **Paste Job Description**
   - Paste full job posting
   - Click "Analyze"
   - Wait for keyword extraction

4. **Optimize Resume**
   - Click "Optimize Resume"
   - Wait 10-30 seconds for AI processing
   - View optimized result

5. **Compare**
   - Click "Compare View"
   - See side-by-side original vs optimized

6. **Download**
   - Select format (PDF/DOCX)
   - Click "Export"
   - Verify download

### API Testing with Postman/cURL

See `docs/API.md` for detailed endpoint documentation.

Example cURL commands:
```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'

# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

## Development Workflow

### Making Changes

1. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes** to code

3. **Test locally**
```bash
npm run dev
```

4. **Commit changes**
```bash
git add .
git commit -m "Add: your feature description"
```

5. **Push to GitHub**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request** on GitHub

### Code Structure

```
backend/
├── routes/        # API route handlers
├── controllers/   # Business logic
├── models/        # MongoDB schemas
├── middleware/    # Auth, validation, error handling
├── services/      # AI integration, file processing
└── utils/         # Helper functions

frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route pages
│   ├── hooks/       # Custom React hooks
│   ├── services/    # API calls
│   └── styles/      # Tailwind config
```

## Production Deployment

### Environment Variables

Update `.env` files for production:
- Use strong `JWT_SECRET`
- Use production MongoDB URI
- Set `NODE_ENV=production`
- Configure CORS for production domain

### Recommended Hosting

**Backend:**
- Heroku (free tier available)
- Railway (free tier)
- Render (free tier)
- AWS/DigitalOcean (paid)

**Frontend:**
- Vercel (free, automatic deployments)
- Netlify (free)
- GitHub Pages (free, static only)

**Database:**
- MongoDB Atlas (free tier)

### Deployment Steps

1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Configure backend for production**
```bash
cd backend
# Update .env with production values
```

3. **Deploy to hosting platform**
```bash
# Example: Vercel
vercel --prod

# Example: Heroku
git push heroku main
```

## Next Steps

- [ ] Complete backend route implementation
- [ ] Build frontend UI components
- [ ] Integrate AI optimization service
- [ ] Add file upload handling
- [ ] Implement comparison view
- [ ] Add export functionality
- [ ] Write tests
- [ ] Deploy to production

## Support

Need help? Check these resources:
- [GitHub Issues](https://github.com/Babatems/ai-resume-builder/issues)
- [API Documentation](./API.md)
- [Hugging Face Docs](https://huggingface.co/docs)
- [MongoDB Docs](https://docs.mongodb.com)

---

Last Updated: March 6, 2026
