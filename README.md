https://jarvis-resume-builder.netlify.app/

# AI Resume Builder 🚀

An intelligent resume optimization platform that uses AI to tailor your resume to specific job descriptions. Upload your resume and a job posting, and let AI rewrite your resume to perfectly match the role.

## Features ✨

- **Smart Resume Optimization** - AI analyzes job descriptions and optimizes your resume to match
- **Multi-Format Support** - Upload and export in PDF, DOCX, TXT formats
- **Multiple Resume Formats** - Support for ATS-friendly, creative, and chronological layouts
- **Comparison View** - Side-by-side comparison of original vs. optimized resume
- **User Authentication** - Secure signup/signin with JWT tokens
- **Resume History** - Keep track of all your optimized resumes
- **Keyword Extraction** - AI identifies key skills and requirements from job descriptions
- **Real-time Updates** - See changes as AI rewrites your resume

## Tech Stack 🛠️

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **Framer Motion** - Animations

### Backend
- **Node.js + Express** - Server framework
- **MongoDB** - Database for users and resumes
- **JWT** - Authentication
- **Hugging Face API** - Mistral-7B AI model
- **Multer** - File upload handling
- **PDF-lib / docx** - Document generation

### AI Model
- **Mistral-7B** (via Hugging Face API) - Free, open-source LLM for resume optimization

## Project Structure 📁

```
ai-resume-builder/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/               # Express API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── config/                # Configuration files
│   ├── database.js
│   └── ai.js
├── docs/                  # Documentation
│   ├── API.md
│   ├── SETUP.md
│   └── ARCHITECTURE.md
├── .gitignore
├── package.json
└── README.md
```

## Installation 🔧

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Hugging Face API key (free account)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
JWT_SECRET=your_jwt_secret_key_here
HUGGING_FACE_API_KEY=your_huggingface_api_key
NODE_ENV=development
```

Run backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`
Backend API will run on `http://localhost:5000`

## API Endpoints 📡

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes/upload` - Upload resume file
- `POST /api/resumes/optimize` - Optimize resume with job description
- `GET /api/resumes/:id` - Get specific resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/export` - Export resume in format

### Job Descriptions
- `POST /api/jobs/analyze` - Analyze job description for keywords

## Usage 💡

1. **Sign Up** - Create account with email and password
2. **Upload Resume** - Upload your current resume (PDF, DOCX, TXT)
3. **Paste Job Description** - Copy and paste the job posting
4. **Optimize** - Click "Optimize" and AI will rewrite your resume
5. **Compare** - See side-by-side original vs optimized
6. **Download** - Export in your preferred format
7. **Save** - Store optimized version for future reference

## Skills Used 📚

This project integrates the following verified skills:
- `https://skills.sh/anthropics/skills/frontend-design`
- `https://skills.sh/vercel-labs/agent-skills/web-design-guidelines`
- `https://clawhub.ai/charmmm718/backend-patterns`

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing 🧪

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Roadmap 🗺️

- [ ] Advanced resume templates
- [ ] Cover letter generation
- [ ] Interview preparation guide
- [ ] Job tracking dashboard
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] ATS scoring

## Troubleshooting 🔧

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify network access in MongoDB Atlas

### Hugging Face API Issues
- Get free API key from [huggingface.co](https://huggingface.co)
- Ensure key is in .env as `HUGGING_FACE_API_KEY`
- Check rate limits on free tier

### CORS Errors
- Verify backend is running on correct port
- Check frontend API endpoint configuration
- Ensure CORS is enabled in Express

## Performance Considerations ⚡

- Resume optimization may take 10-30 seconds depending on length
- Large files (>10MB) will be rejected
- API rate limits apply on free Hugging Face tier

## Security 🔒

- All passwords hashed with bcrypt
- JWT tokens expire after 24 hours
- File uploads validated for type and size
- Database credentials stored in environment variables
- HTTPS recommended for production

## License 📄

MIT License - see LICENSE file for details

## Support 💬

Issues? Questions? Open a GitHub issue or contact the team.

---

**Last Updated:** March 6, 2026
**Status:** Active Development 🚀
