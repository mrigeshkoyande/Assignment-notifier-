# College Management System - Test Vite App

A college management system built with React and Vite featuring role-based authentication, student dashboards, teacher analytics, and admin controls with Firebase integration.

## 🚀 Features

- **Role-based Authentication**: Login system with different roles (Admin, Teacher, Student)
- **Student Dashboard**: View assignments, attendance, and chat functionality
- **Teacher Dashboard**: Manage assignments, view analytics, and export data
- **Admin Dashboard**: System administration and user management
- **Real-time Updates**: Firebase integration for data synchronization
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account with project setup

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root by copying `.env.example`:

```bash
cp .env.example .env.local
```

Then fill in your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

**Important**: Never commit `.env.local` to version control. The `.gitignore` file is configured to ignore environment files automatically.

### 3. Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── pages/              # Page components
│   ├── AdminDashboard.jsx
│   ├── Login.jsx
│   ├── RoleSelect.jsx
│   ├── StudentDashboard.jsx
│   ├── TeacherDashboard.jsx
│   ├── student/       # Student-specific pages
│   └── teacher/       # Teacher-specific pages
├── context/           # React context (Auth, etc.)
├── services/          # Firebase configuration
└── App.jsx            # Main app component
```

## 🔐 Security Notes

- Firebase credentials are managed via environment variables
- `.env.local` is ignored by git to prevent accidental credential exposure
- Use `.env.example` as a template for other developers

## 🛠 Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: CSS3
- **Build Tool**: Vite
- **Linting**: ESLint

## 📝 License

This project is part of the Assignment Notifier application suite.
