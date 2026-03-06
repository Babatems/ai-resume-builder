# AI Resume Builder - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Sign Up
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Sign In
**Endpoint:** `POST /auth/signin`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

---

### 3. Get Current User
**Endpoint:** `GET /auth/me`
**Auth Required:** Yes

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-03-06T10:00:00Z"
}
```

---

### 4. Logout
**Endpoint:** `POST /auth/logout`
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Resume Endpoints

### 5. Upload Resume
**Endpoint:** `POST /resumes/upload`
**Auth Required:** Yes
**Content-Type:** multipart/form-data

**Form Data:**
```
file: <binary file> (PDF, DOCX, TXT)
name: "My Resume 2026"
```

**Response:**
```json
{
  "success": true,
  "resume": {
    "id": "resume_id",
    "name": "My Resume 2026",
    "fileUrl": "/uploads/resume_123.pdf",
    "uploadedAt": "2026-03-06T10:00:00Z",
    "fileType": "pdf"
  }
}
```

---

### 6. Get All User Resumes
**Endpoint:** `GET /resumes`
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "resumes": [
    {
      "id": "resume_id",
      "name": "My Resume 2026",
      "fileUrl": "/uploads/resume_123.pdf",
      "uploadedAt": "2026-03-06T10:00:00Z",
      "versions": 3
    }
  ]
}
```

---

### 7. Get Specific Resume
**Endpoint:** `GET /resumes/:id`
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "resume": {
    "id": "resume_id",
    "name": "My Resume 2026",
    "content": "Full resume content...",
    "uploadedAt": "2026-03-06T10:00:00Z",
    "versions": [
      {
        "id": "v1",
        "name": "Original",
        "createdAt": "2026-03-06T10:00:00Z"
      },
      {
        "id": "v2",
        "name": "TechCorp Optimized",
        "createdAt": "2026-03-06T10:15:00Z"
      }
    ]
  }
}
```

---

### 8. Optimize Resume
**Endpoint:** `POST /resumes/optimize`
**Auth Required:** Yes

**Request Body:**
```json
{
  "resumeId": "resume_id",
  "jobDescription": "Job posting text here...",
  "outputFormat": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "optimizedResume": {
    "id": "optimized_resume_id",
    "originalId": "resume_id",
    "content": "Optimized resume content...",
    "versionName": "JobTitle - Company",
    "createdAt": "2026-03-06T10:15:00Z",
    "keywords": ["react", "nodejs", "mongodb", "aws"]
  }
}
```

---

### 9. Delete Resume
**Endpoint:** `DELETE /resumes/:id`
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

### 10. Export Resume
**Endpoint:** `POST /resumes/:id/export`
**Auth Required:** Yes

**Request Body:**
```json
{
  "format": "pdf",
  "versionId": "version_id"
}
```

**Response:** Binary file download (PDF/DOCX/TXT)

---

## Job Analysis Endpoint

### 11. Analyze Job Description
**Endpoint:** `POST /jobs/analyze`
**Auth Required:** Yes

**Request Body:**
```json
{
  "jobDescription": "Full job posting text...",
  "resumeId": "resume_id"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "requiredSkills": ["React", "Node.js", "MongoDB", "AWS"],
    "niceToHaveSkills": ["Docker", "Kubernetes"],
    "yearsOfExperience": 3,
    "technologies": ["JavaScript", "AWS", "Git"],
    "keyResponsibilities": [
      "Build scalable web applications",
      "Collaborate with cross-functional teams"
    ],
    "matchScore": 78
  }
}
```

---

## Comparison Endpoint

### 12. Get Comparison
**Endpoint:** `GET /resumes/:id/compare/:versionId`
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "comparison": {
    "original": {
      "content": "Original resume...",
      "version": "Original"
    },
    "optimized": {
      "content": "Optimized resume...",
      "version": "JobTitle - Company"
    },
    "changes": [
      {
        "type": "highlighted",
        "original": "Software Engineer",
        "optimized": "Senior Software Engineer with React expertise",
        "reason": "Aligned with job description keywords"
      }
    ]
  }
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Free tier: 5 optimizations per day
- Pro tier: 50 optimizations per day
- Enterprise: Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1678183200
```

---

## File Upload Specifications

### Supported Formats
- PDF (.pdf) - max 10MB
- DOCX (.docx) - max 5MB
- TXT (.txt) - max 2MB

### File Validation
- Size limits enforced on upload
- Malware scanning performed
- OCR applied for PDF files

---

## Testing API Locally

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Health check
curl http://localhost:5000/api/health
```

---

Last Updated: March 6, 2026
