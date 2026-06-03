# 🎨 AI Recruitment Platform - Frontend

React-based frontend for the AI-Powered Recruitment & HR Automation Platform.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will run on **http://localhost:3000**

---

## 📋 Prerequisites

**Before starting the frontend, make sure the backend is running:**

```bash
# From project root directory
python -m uvicorn main:app --reload
```

Backend should be running on **http://localhost:8000**

---

## 🔐 Testing Login & Signup

### Test Credentials

After starting the app, you can:

1. **Create New Account**:
   - Go to `/signup`
   - Fill in the form:
     - Name: Your Name
     - Company Name: Your Company
     - Email: your@email.com
     - Password: password123
   - Click "Sign Up"
   - You'll be redirected to login

2. **Login**:
   - Go to `/login`
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to dashboard based on your role

### Existing Test User

If backend already has users, you can try:
- Email: `prasad@example.com`
- Password: (the password you set during signup)

---

## 🏗️ Project Structure

```
client/
├── public/
│   └── assets/           # Images, CSS, fonts
├── src/
│   ├── components/       # React components
│   │   ├── auth/        # Login, Signup, etc.
│   │   ├── analytics/   # Analytics components
│   │   ├── pipeline/    # Pipeline components
│   │   ├── recruiterDashboard/
│   │   └── candidateDashboard/
│   ├── utils/           # Utility functions
│   │   ├── api.js      # Backend API calls
│   │   └── auth.js     # Authentication helpers
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── package.json
```

---

## 🔗 Backend Integration

### Authentication

The frontend connects to the backend for authentication:

```javascript
// Login
POST http://localhost:8000/api/auth/login-json
Body: { email, password }

// Signup
POST http://localhost:8000/api/auth/signup
Body: { name, email, password, role, company_name, ... }
```

### Making API Calls

Use the API utility:

```javascript
import { authAPI, jobAPI, candidateAPI } from './utils/api';

// Login
const data = await authAPI.login(email, password);

// Create job
const job = await jobAPI.create(formData);

// List candidates
const candidates = await candidateAPI.list();
```

**📖 For detailed integration guide, see:** `FRONTEND_BACKEND_INTEGRATION.md`

---

## 🎯 Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/pricing` - Pricing page
- `/ForgotPassword` - Password recovery

### Protected Routes (Requires Login)

#### Recruiter Routes
- `/dashboard` - Main dashboard
- `/candidates` - Candidate management
- `/jobs/new` - Create new job
- `/jobslist` - View all jobs
- `/pipeline/view` - Pipeline view
- `/pipeline/stages` - Manage stages
- `/analytics/*` - Analytics pages
- `/settings` - Settings

#### Candidate Routes
- `/candidate/dashboard` - Candidate dashboard
- `/candidate/jobs` - Browse jobs
- `/candidate/applications` - View applications
- `/candidate/profile` - Profile management
- `/candidate/settings` - Settings

---

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
⚠️ **Warning**: This is a one-way operation!

---

## 📦 Dependencies

### Main Dependencies
- **React** 19.1.1 - UI library
- **React Router DOM** 7.8.2 - Routing
- **Bootstrap** 5.3.8 - UI framework
- **@iconify/react** 6.0.1 - Icon library
- **Recharts** 3.2.1 - Charts
- **Lucide React** 0.543.0 - Icons

---

## 🔧 Configuration

### API Base URL

The API base URL is set in `src/utils/api.js`:

```javascript
const BASE_URL = 'http://localhost:8000';
```

For production, you should use an environment variable:

```javascript
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

Then create `.env` file:
```
REACT_APP_API_URL=https://your-production-api.com
```

---

## 🐛 Troubleshooting

### Backend Connection Issues

**Error**: "Network error. Please check if backend is running on port 8000"

**Solution**:
1. Make sure backend is running: `uvicorn main:app --reload`
2. Check if backend is accessible: Open `http://localhost:8000/docs`
3. Check browser console for CORS errors

### Authentication Issues

**Error**: "Invalid token" or "Unauthorized"

**Solution**:
1. Clear localStorage: Open browser console → `localStorage.clear()`
2. Login again
3. Check if token exists: `localStorage.getItem('token')`

### CORS Issues

**Error**: "Access blocked by CORS policy"

**Solution**:
Backend should already have CORS configured for `http://localhost:3000`. If not, check `main.py` in backend.

---

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## 🎨 Styling

This project uses **Bootstrap 5** for styling. All components use Bootstrap classes for consistent UI.

Custom styles are in:
- `public/assets/css/style.css`
- `public/assets/css/extra.css`

---

## 🔐 Security

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests
- Protected routes check for valid token
- Tokens expire after 15 minutes (access) / 7 days (refresh)

---

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

## ✅ Testing Connection

Open browser console (F12) and run:

```javascript
// Test backend connection
fetch('http://localhost:8000/api/test')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Connection failed:', err));
```

Expected output:
```json
{
  "message": "Backend is working and CORS is enabled!"
}
```

---

## 📧 Support

For integration help, see `FRONTEND_BACKEND_INTEGRATION.md`

---

## 📝 Status

### ✅ Completed Features
- ✅ Login with backend integration
- ✅ Signup with backend integration
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auth utilities
- ✅ API utilities
- ✅ Error handling

### 🚧 In Progress
- Job management integration
- Pipeline integration
- Analytics integration
- Candidate dashboard integration

---

**Version**: 1.0  
**Last Updated**: October 13, 2025

# Hr-ai-levitica
