
# Gen-AI Placement Management System

An AI-enabled placement management platform for colleges and hiring teams.
The application supports complete recruitment workflows with role-based access for Student, Staff, HR/Recruiter, and Admin users.

## Overview

This project includes:

- A React + Vite frontend for dashboards, forms, analytics, and communication views.
- A Node.js + Express backend with REST APIs, authentication, and business workflows.
- MongoDB for persistent data storage.
- Socket.IO for real-time features.
- Gemini-powered AI capabilities for chat and resume analysis.

## Core Features

- Role-based access and dashboards (Student, Staff, HR/Recruiter, Admin)
- Job posting and requisition workflows
- Application tracking, including detailed application forms
- Interview and exam management flows
- Placement analytics and statistics
- Resume analysis and ATS-style scoring support
- OTP and Google OAuth authentication
- Email notifications and reminder scheduling
- Real-time communication via Socket.IO

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS + PostCSS + Autoprefixer
- Chart.js and react-chartjs-2
- Framer Motion
- Axios
- Socket.IO client

### Backend

- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- multer (uploads)
- nodemailer (SMTP email)
- Socket.IO
- node-cron + node-cache

### AI & Integrations

- Google Gemini API (@google/generative-ai)
- Google OAuth

## Project Structure

```text
.
|- backend/
|  |- controllers/
|  |- models/
|  |- routes/
|  |- middleware/
|  |- utils/
|  |- server.js
|- frontend/
|  |- src/
|  |- public/
|  |- vite.config.js
|- README.md
```

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas (or local MongoDB)

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd Gen-AI-Placement-Management-System

cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure backend environment variables

Create backend/.env (or copy from backend/.env.example) and set values:

```env
MONGO_URI=<your_mongodb_uri>
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,http://localhost:3000

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/google/callback

GEMINI_API_KEY=<your_gemini_api_key>

EMAIL_USER=<your_email>
EMAIL_PASSWORD=<your_email_app_password>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

NODE_ENV=development
PORT=5000
```

### 3) Optional frontend environment variables

Create frontend/.env and set values if needed by your deployment mode:

```env
VITE_API_URL=/_/backend/api
VITE_BACKEND_URL=/_/backend
VITE_APP_NAME=Gen-AI Placement Management System
VITE_VERSION=1.0.0
```

### 4) Start backend and frontend

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Useful Scripts

Backend (backend/package.json):

- npm start: Start server with Node
- npm run dev: Start server with nodemon

Frontend (frontend/package.json):

- npm run dev: Start Vite dev server
- npm run build: Build production assets
- npm run preview: Preview production build

## Main API Base Paths

Backend route groups include:

- /api/auth
- /api/oauth
- /api/students
- /api/jobs
- /api/job-requisitions
- /api/applications
- /api/detailed-applications
- /api/interviews
- /api/interview-exams
- /api/exams
- /api/placements
- /api/placement-stats
- /api/resume-analysis
- /api/onboarding
- /api/admin
- /api/emails
- /api/notifications
- /api/ai

Health endpoint:

- /api/health

## Deployment Notes

- Configuration docs are available in this repository, including Vercel and Render setup guides.
- Ensure frontend and backend URLs are aligned in CORS and environment variables.
- Keep all secrets in secure environment configuration, never in source control.

## Application Screenshots

### Dashboard and Workflow Views

![Dashboard View](https://github.com/user-attachments/assets/8b0d75f6-6013-496c-a34c-f2560eceec5c)
![Recruitment Workflow](https://github.com/user-attachments/assets/c250322b-9cf4-4b23-b96f-014364b2af50)
![Job Management](https://github.com/user-attachments/assets/b6289b3c-8ee7-4533-a7c3-23985eb9a6d6)
![Analytics View](https://github.com/user-attachments/assets/b4d8fd19-5b77-478a-b162-0b12570fc0c6)

### Forms and Admin Views

![Application Form](https://github.com/user-attachments/assets/10b58291-16b9-4b07-b9e1-ce2f70328a9a)
![Admin Module](https://github.com/user-attachments/assets/6378f3a8-6cbd-434d-82f2-254270db74f4)
![Notification and Communication](https://github.com/user-attachments/assets/8b9c1730-b100-4422-aed0-9f3cb45d7116)
![User Management](https://github.com/user-attachments/assets/54490179-c5cf-4090-88fd-6ae34bf37109)

## Contributor

- Vamsi Valluri

## License

MIT License



