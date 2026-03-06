# AI Resume Builder - Architecture Documentation

## System Overview

AI Resume Builder is a full-stack web application that uses artificial intelligence to optimize resumes based on job descriptions. The system follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│         - User Interface                                     │
│         - File Upload & Display                              │
│         - Resume Optimization Workflow                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │ JWT Authentication
┌──────────────────────▼──────────────────────────────────────┐
│              Backend (Node.js + Express)                     │
│         - API Endpoints                                      │
│         - Authentication & Authorization                     │
│         - File Processing                                    │
│         - AI Integration Layer                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ Database Driver
┌──────────────────────▼──────────────────────────────────────┐
│            External Services & Database                      │
│         - MongoDB (User Data, Resumes)                       │
│         - Hugging Face API (Mistral-7B Model)                │
│         - Cloud Storage (Future)                             │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework:** React 18.2.0
- **Build Tool:** Vite 4.3.0
- **Styling:** Tailwind CSS 3.3.0
- **Routing:** React Router v6
- **HTTP Client:** Axios 1.4.0
- **Animations:** Framer Motion 10.12.0

### Directory Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── FileUploader.jsx
│   │   ├── ResumeComparison.jsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UploadPage.jsx
│   │   └── OptimizePage.jsx
│   ├── services/            # API integration
│   │   ├── api.js
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useResume.js
│   │   └── ...
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
└── package.json
```

### Component Hierarchy
```
<App>
  ├── <Router>
  │   ├── <LoginPage>
  │   ├── <SignupPage>
  │   └── <ProtectedRoutes>
  │       ├── <Navbar>
  │       ├── <DashboardPage>
  │       │   └── <ResumeList>
  │       │       └── <ResumeCard>
  │       ├── <UploadPage>
  │       │   └── <FileUploader>
  │       └── <OptimizePage>
  │           ├── <JobDescriptionInput>
  │           └── <ResumeComparison>
```

### State Management
- **Local State:** React useState for component-level state
- **Authentication:** localStorage for JWT token storage
- **API Calls:** Axios interceptors for automatic token injection

### Key Features
1. **Authentication Flow**
   - Sign up / Sign in pages
   - JWT token storage
   - Protected routes
   - Auto logout on token expiry

2. **Resume Management**
   - File upload (PDF, DOCX, TXT)
   - Resume list display
   - Version history tracking
   - Delete functionality

3. **Optimization Workflow**
   - Job description input
   - Resume selection
   - Real-time AI processing
   - Side-by-side comparison view

4. **Export Functionality**
   - Multiple format support (PDF, DOCX)
   - Download optimized resumes
   - Version management

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js 16+
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB 7.0.0
- **Authentication:** JWT (jsonwebtoken 9.0.0)
- **File Upload:** Multer 1.4.5
- **Hashing:** Bcryptjs 2.4.3
- **AI Integration:** Hugging Face API

### Directory Structure
```
backend/
├── routes/
│   ├── auth.js              # Authentication routes
│   └── resumes.js           # Resume CRUD routes
├── controllers/
│   ├── authController.js    # Auth logic
│   └── resumeController.js  # Resume logic
├── models/
│   ├── User.js              # User schema
│   └── Resume.js            # Resume schema
├── middleware/
│   ├── auth.js              # JWT verification
│   └── validation.js        # Input validation
├── services/
│   └── aiService.js         # AI integration
├── config/
│   ├── database.js          # DB config
│   └── ai.js                # AI prompts & config
├── utils/
│   └── fileHandler.js       # File processing
├── server.js                # Entry point
├── package.json
└── .env.example
```

### API Architecture

#### Authentication Flow
```
Client                          Server
  │                               │
  ├─── POST /auth/signup ────────>│
  │                          Hash password
  │                       Create user doc
  │<────── JWT Token ─────────────┤
  │                               │
  ├─── POST /auth/signin ────────>│
  │                       Verify password
  │<────── JWT Token ─────────────┤
```

#### Resume Optimization Flow
```
Client                          Server              Hugging Face
  │                               │                      │
  ├─ POST /resumes/upload ──────>│                      │
  │                          Store file                  │
  │<────── Resume ID ────────────┤                      │
  │                               │                      │
  ├─ POST /resumes/optimize ────>│                      │
  │   (resumeId, jobDesc)     Build prompt              │
  │                           Call Mistral API ────────>│
  │                               │<──── Optimized text │
  │                         Store version                │
  │<──── Optimized Resume ────────┤                      │
```

### Database Schema

#### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  plan: String ('free', 'pro', 'enterprise'),
  monthlyOptimizations: Number,
  resumes: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Resume Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  name: String,
  originalContent: String,
  fileUrl: String,
  fileType: String ('pdf', 'docx', 'txt'),
  versions: [
    {
      name: String,
      content: String,
      jobDescription: String,
      keywords: [String],
      matchScore: Number,
      optimizedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Authentication & Security

#### JWT Implementation
- **Token Expiry:** 24 hours
- **Payload:** userId, email
- **Storage:** localStorage (frontend)
- **Transmission:** Authorization header

#### Password Security
- **Hashing:** bcryptjs with salt factor 10
- **Validation:** Minimum 8 characters
- **Reset:** Email-based password reset (future)

#### File Upload Security
- **Size Limit:** 10MB
- **Type Validation:** PDF, DOCX, TXT only
- **Malware Scanning:** Multer fileFilter validation
- **Storage:** Memory/Cloud (configurable)

## Data Flow

### Resume Optimization Process
```
1. User uploads resume
   ↓
2. System stores original + metadata
   ↓
3. User enters job description
   ↓
4. Backend extracts job requirements using AI
   ↓
5. AI generates optimized resume
   - Maintains factual accuracy
   - Highlights relevant skills
   - Uses job-specific keywords
   ↓
6. System stores as new version
   ↓
7. Frontend displays comparison
   ↓
8. User downloads in preferred format
```

### File Processing
```
User uploads file (PDF/DOCX/TXT)
        ↓
Multer validates + stores in memory
        ↓
Text extracted/parsed
        ↓
Stored in MongoDB
        ↓
Available for AI processing
```

## AI Integration (Mistral-7B)

### Model Configuration
- **Provider:** Hugging Face Inference API
- **Model:** mistralai/Mistral-7B-Instruct-v0.1
- **Temperature:** 0.7 (balanced creativity)
- **Max Tokens:** 2000

### Prompt Engineering
The system uses carefully crafted prompts to:
1. **Analyze Job Descriptions**
   - Extract required skills
   - Identify key technologies
   - Determine experience level
   - Highlight soft skills

2. **Optimize Resumes**
   - Rewrite bullets using job keywords
   - Emphasize relevant achievements
   - Improve quantifiable metrics
   - Maintain ATS compatibility

### Rate Limiting
- Free Tier: 5 optimizations/month
- Pro Tier: 50 optimizations/month
- Enterprise: Unlimited

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Client (Frontend)                │
│  ┌──────────────────────────────────┐   │
│  │   Validate inputs locally         │   │
│  │   Sanitize file uploads           │   │
│  └──────────────────────────────────┘   │
└────────────────────┬────────────────────┘
                     │ HTTPS
                     │ JWT in headers
┌────────────────────▼────────────────────┐
│      API Gateway / Rate Limiting         │
│  ┌──────────────────────────────────┐   │
│  │   Verify JWT token               │   │
│  │   Rate limit by user ID           │   │
│  │   Validate request schema         │   │
│  └──────────────────────────────────┘   │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      Business Logic Layer                │
│  ┌──────────────────────────────────┐   │
│  │   Authorize user access           │   │
│  │   Validate file types             │   │
│  │   Process resumes safely          │   │
│  │   Generate safe AI prompts        │   │
│  └──────────────────────────────────┘   │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      Database Layer                      │
│  ┌──────────────────────────────────┐   │
│  │   MongoDB connection              │   │
│  │   User data encryption            │   │
│  │   Audit logging (future)          │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Performance Optimization

### Frontend
- **Code Splitting:** React Router lazy loading
- **Caching:** Browser cache for static assets
- **Optimization:** Minified production builds

### Backend
- **Database Indexing:** Indexes on userId, email
- **API Caching:** Cache job analysis results
- **Connection Pooling:** MongoDB connection reuse

### AI Processing
- **Batching:** Queue multiple requests
- **Timeout Management:** 30-second timeout per request
- **Error Recovery:** Graceful fallbacks

## Deployment Architecture

### Production Environment
```
┌─────────────────────────────────────────┐
│         CDN (Static Assets)              │
│         - Frontend builds                │
│         - Images, CSS, JS                │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    Load Balancer / Reverse Proxy         │
│    (Nginx / HAProxy)                     │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌───────▼──────┐
│ Backend      │  │ Backend      │
│ Instance 1   │  │ Instance 2   │
│ (Node.js)    │  │ (Node.js)    │
└───────┬──────┘  └───────┬──────┘
        │                 │
        └────────┬────────┘
                 │
         ┌───────▼────────┐
         │    MongoDB     │
         │    Atlas       │
         │   (Replica)    │
         └────────────────┘
```

## Monitoring & Logging

### Metrics to Track
- API response times
- Error rates
- AI processing times
- User authentication events
- File upload success/failure rates

### Logging Strategy
- Error logging to centralized service (future)
- API request logging (development)
- User action audit trail (future)

## Future Enhancements

1. **Advanced Features**
   - Real-time collaboration
   - Resume templates
   - Cover letter generation
   - Interview prep
   - Browser extension

2. **Technical Improvements**
   - Microservices architecture
   - Message queue for async processing
   - Advanced caching strategy
   - GraphQL API
   - WebSocket for real-time updates

3. **AI Improvements**
   - Fine-tuned models per industry
   - Multi-language support
   - Sentiment analysis
   - Skill gap analysis

---

**Last Updated:** March 6, 2026
**Version:** 1.0.0
