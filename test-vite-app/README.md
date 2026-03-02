# College Management System - Test Vite App

A comprehensive college management system built with React and Vite featuring role-based authentication, student dashboards, teacher analytics, admin controls, and Firebase real-time synchronization.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF.svg?logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Integrated-FFCA28.svg?logo=firebase)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933.svg?logo=nodedotjs)](https://nodejs.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

- **🔐 Role-based Authentication** — Different access levels (Admin, Teacher, Student)
- **👨‍🎓 Student Dashboard** — View assignments, track attendance, access lectures, and chat
- **👨‍🏫 Teacher Dashboard** — Manage assignments, view analytics, monitor attendance, export data
- **👨‍💼 Admin Dashboard** — System administration, user management, classroom management, settings
- **📊 Real-time Updates** — Firebase Firestore for instant data synchronization
- **📱 Responsive Design** — Fully responsive on all devices
- **🎨 Role-specific UI** — Tailored interfaces for each user type
- **📅 Attendance Tracking** — Photo-based attendance system with face detection
- **📈 Analytics** — Teacher analytics and reporting capabilities

---

## 📋 Prerequisites

- **Node.js** v16+ (includes npm)
- **Git** v2.30+
- **Firebase** project with:
  - Authentication enabled
  - Firestore database setup
  - Storage bucket configured

---

## 🔧 Setup Instructions

### 1. Clone & Navigate

```bash
git clone https://github.com/mrigeshkoyande/Assignment-notifier-.git
cd Assignment-notifier-/test-vite-app
npm install
```

### 2. Configure Firebase Credentials

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

⚠️ **IMPORTANT:** Never commit `.env.local` to version control!

### 3. Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
test-vite-app/
├── public/                          # Static assets
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx       # Admin main dashboard
│   │   ├── Login.jsx                # Authentication page
│   │   ├── RoleSelect.jsx           # Role selection after login
│   │   ├── StudentDashboard.jsx     # Student main dashboard
│   │   ├── TeacherDashboard.jsx     # Teacher main dashboard
│   │   ├── admin/
│   │   │   ├── AddUser.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── ClassroomAdmin.jsx
│   │   │   ├── TimetableManagement.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── UserDetails.jsx
│   │   ├── student/
│   │   │   ├── Assignments.jsx      # Student assignments view
│   │   │   ├── Attendance.jsx       # Attendance tracking
│   │   │   ├── MyLectures.jsx       # Student lectures
│   │   │   ├── MyClassrooms.jsx     # Enrolled classrooms
│   │   │   ├── Chat.jsx             # Messaging system
│   │   │   └── Settings.jsx         # User preferences
│   │   └── teacher/
│   │       ├── Analytics.jsx        # Class analytics
│   │       ├── ClassroomManagement.jsx
│   │       ├── TeacherAttendance.jsx
│   │       ├── ExportData.jsx       # Data export
│   │       ├── MyLectures.jsx       # Teacher lectures
│   │       └── Settings.jsx         # Teacher settings
│   ├── components/
│   │   └── AttendanceCalendar.jsx   # Shared calendar component
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── hooks/
│   │   └── useAttendance.js         # Attendance custom hook
│   ├── services/
│   │   └── firebase.config.js       # Firebase configuration
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── eslint.config.js                 # ESLint rules
└── README.md                        # This file
```

---

## 🛠️ Development Guide

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint

# Type checking (if TypeScript is used)
npm run type-check
```

### Key Components

**Authentication Context** (`src/context/AuthContext.jsx`)
- Manages user authentication state
- Provides user role information
- Handles login/logout

**Custom Hooks**
- `useAttendance()` — Attendance-related operations
- `useAuth()` — Authentication state access (if available)

**Firebase Services** (`src/services/firebase.config.js`)
- Database operations
- Authentication handling
- File storage

### User Roles & Access

```
┌─────────────────────────────────────────────────────────────┐
│                    Login Page (Public)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
            ┌─────▼─────┐      ┌─────▼─────┐
            │ Role Select│      │  Student  │
            └──┬──┬──┬──┘      └───────────┘
               │  │  │             
        ┌──────┘  │  └──────┐
        │         │         │
    ┌───▼──┐ ┌───▼──┐ ┌───▼──┐
    │Admin │ │Teacher│ │Student│
    └──────┘ └──────┘ └──────┘
```

---

## 🔐 Security Features

- **Environment Variables** — Sensitive credentials protected in `.env.local`
- **Firebase Auth** — Secure authentication
- **Role-based Access Control** — Different dashboards per role
- **Protected Routes** — Unauthenticated users redirected to login
- **Git Ignore** — `.env.local` automatically excluded from version control

---

## 🧪 Testing & Debug

### Common Issues & Solutions

**Firebase Connection Error**
```bash
# Verify Firebase credentials in .env.local
# Ensure Firebase project is active and accessible
```

**Port 5173 Already in Use**
```bash
npm run dev -- --port 3000
```

**Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Git Workflow for Contributors

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/Assignment-notifier-.git
cd Assignment-notifier-/test-vite-app
git remote add upstream https://github.com/mrigeshkoyande/Assignment-notifier-.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# Example: git checkout -b feature/add-email-notifications
```

### 3. Make Changes & Test
```bash
npm run dev
# Test in browser at http://localhost:5173
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add email notifications to assignments"
# Follow commit guidelines from CONTRIBUTING.md
```

### 5. Push & Create PR
```bash
git push origin feature/your-feature-name
# Create pull request on GitHub
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development setup details
- Commit message guidelines
- Pull request process
- Code standards
- Testing requirements

**Quick links:**
- [Report Bug](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?labels=bug)
- [Request Feature](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?labels=enhancement)
- [Contributing Guide](../CONTRIBUTING.md)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.1.9 | Build tool & dev server |
| Firebase | Latest | Backend & database |
| TensorFlow.js | 4.22.0 | Face detection (attendance) |
| CSS3 | - | Styling |

---

## 📚 Further Reading

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Docs](https://firebase.google.com/docs)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)

---

## 🔗 Related Modules

- **[Notification App](../notification-app/README.md)** — Assignment tracking application
- **[Python Backend](../python-backend/)** — Flask API for processing
- **[Main Project](../README.md)** — Complete documentation

---

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details

---

## 👤 Maintenance

**Maintained by:** Mrigesh Koyande  
**GitHub:** [@mrigeshkoyande](https://github.com/mrigeshkoyande)  
**Email:** [mrigeshkoyande@gmail.com](mailto:mrigeshkoyande@gmail.com)

---

**Ready to contribute?** [Start here →](../CONTRIBUTING.md)
