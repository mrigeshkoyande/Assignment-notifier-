<div align="center">

# 📚 Assignment Notifier & College Management Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF.svg)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Latest-000000.svg)](https://flask.palletsprojects.com/)

**A comprehensive educational platform combining assignment tracking, attendance management, and role-based college administration.**

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📖 Overview

Assignment Notifier is a professional, full-stack educational platform designed to streamline classroom management, assignment tracking, and student attendance. Built with modern web technologies, it provides an intuitive interface for students, teachers, and administrators.

### 🎯 Key Highlights

- **70% Smaller Bundle Size** - Optimized performance with lightweight architecture
- **Real-time Notifications** - Never miss an assignment deadline
- **Role-Based Access Control** - Separate dashboards for Admin, Teacher, and Student
- **AI-Powered Attendance** - Facial recognition using TensorFlow.js
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Firebase Integration** - Secure authentication and cloud storage

---

## 📁 Project Structure

This monorepo contains three integrated applications:

```
Assignment-notifier/
├── notification-app/          # React assignment tracking system
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   └── data/            # Assignment data management
│   └── package.json
│
├── test-vite-app/            # College management system
│   ├── src/
│   │   ├── components/      # UI components (Calendar, etc.)
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Role-specific dashboards
│   │   │   ├── admin/       # User management
│   │   │   ├── teacher/     # Analytics & exports
│   │   │   └── student/     # Attendance, assignments, chat
│   │   ├── services/        # Firebase configuration
│   │   └── hooks/           # Custom React hooks
│   └── package.json
│
├── python-backend/           # Flask API server
│   ├── server.py            # REST API endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── captured_images/     # Camera captures
│   └── attendance_records/  # Attendance data storage
│
└── Quick Setup Scripts
    ├── quick-setup.bat      # Windows automation
    ├── quick-setup.sh       # Linux/Mac automation
    ├── run_server.bat       # Start Python backend
    └── start_app.bat        # Start frontend apps
```

---

## ✨ Features

### 📝 Assignment Management
- ✅ **Dashboard Overview** - View all assignments in one place
- ✅ **Subject-wise Organization** - Filter by subject/class
- ✅ **Deadline Tracking** - Visual indicators for due dates
- ✅ **Completion Status** - Mark assignments as done
- ✅ **Custom Notifications** - Set personalized reminders

### 👥 Role-Based Dashboards

#### 🔐 Admin Panel
- User management (Create, Read, Update, Delete)
- System analytics and reports
- Role assignment and permissions
- User details and activity monitoring

#### 👨‍🏫 Teacher Dashboard
- Class attendance tracking
- Assignment creation and distribution
- Student analytics and performance metrics
- Data export functionality (CSV, Excel)
- Real-time student engagement monitoring

#### 👨‍🎓 Student Dashboard
- Personal assignment list
- Attendance calendar view
- Doubt/Chat portal for queries
- Progress tracking and notifications

### 📸 Attendance System
- **Lightweight Face Detection** - TensorFlow.js + COCO-SSD
- **Camera Integration** - Real-time video feed processing
- **Geolocation Tracking** - Location-based attendance verification
- **Historical Records** - Complete attendance history
- **Image Capture** - Photo verification for each attendance entry
- **Performance Optimized** - 70% smaller than traditional systems

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**

### ⚡ Automated Setup

#### Windows
```bash
# Clone the repository
git clone <your-repo-url>
cd Assignment-notifier

# Run automated setup
quick-setup.bat

# Start the applications
start_app.bat
```

#### Linux/Mac
```bash
# Clone the repository
git clone <your-repo-url>
cd Assignment-notifier

# Make scripts executable
chmod +x quick-setup.sh
chmod +x run_server.sh

# Run automated setup
./quick-setup.sh

# Start the applications
npm run dev
```

### 📦 Manual Setup

#### 1. Frontend Applications

**Notification App:**
```bash
cd notification-app
npm install
npm run dev
# Opens at http://localhost:5173
```

**College Management System:**
```bash
cd test-vite-app
npm install

# Setup Firebase credentials (see Security section below)
cp .env.example .env.local
# Edit .env.local with your Firebase config

npm run dev
# Opens at http://localhost:5174
```

#### 2. Python Backend

```bash
cd python-backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python server.py
# Server runs at http://localhost:5000
```

---

## 🔐 Security & Environment Variables

### Firebase Configuration Required

The college management system requires Firebase for authentication and database. Create a `.env.local` file in the `test-vite-app` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**⚠️ Important Security Notes:**
- Never commit `.env.local` files to version control
- All environment files are git-ignored by default
- Use Firebase security rules to protect your database
- Rotate API keys regularly

---

## 💻 Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.1.9** - Lightning-fast build tool
- **React Router 7.9.4** - Client-side routing
- **TensorFlow.js** - Machine learning in browser
- **COCO-SSD** - Object detection model

### Backend
- **Flask** - Python web framework
- **OpenCV** - Computer vision library
- **Flask-CORS** - Cross-origin resource sharing

### Infrastructure
- **Firebase Auth** - User authentication
- **Firestore** - NoSQL cloud database
- **Firebase Storage** - File storage
- **Git & GitHub** - Version control

### Development Tools
- **ESLint** - Code linting
- **Vite** - Hot module replacement
- **npm** - Package management

---

## 📱 Usage Guide

### For Students

1. **Login** - Access the platform with your credentials
2. **View Dashboard** - See all pending assignments at a glance
3. **Track Progress** - Mark assignments as completed
4. **Check Attendance** - View your attendance calendar
5. **Ask Doubts** - Use the chat portal to communicate with teachers
6. **Mark Attendance** - Use camera-based face detection for marking attendance

### For Teachers

1. **Login** - Access teacher dashboard
2. **Create Assignments** - Add new assignments with deadlines
3. **Monitor Students** - View student progress and analytics
4. **Track Attendance** - Review class attendance records
5. **Export Data** - Download reports in CSV/Excel format
6. **Respond to Queries** - Answer student questions in chat

### For Administrators

1. **Login** - Access admin panel
2. **Manage Users** - Create, edit, or remove user accounts
3. **Assign Roles** - Set permissions for teachers and students
4. **View Analytics** - Monitor platform usage and performance
5. **System Configuration** - Manage platform settings

---

## 📸 Screenshots

<div align="center">

### Dashboard
<img src="https://github.com/user-attachments/assets/5bf0f4d0-18dc-41ca-931b-5d50b5211d0f" width="700" alt="Dashboard" />

### About Page
<img src="https://github.com/user-attachments/assets/dc6689a3-bee7-483e-958a-c0b0183c5c89" width="700" alt="About Page" />

### Assignment View
<img src="https://github.com/user-attachments/assets/8683459b-1305-42ee-8c7b-aa250993fbf3" width="700" alt="Assignment View" />

### Subject Page
<img src="https://github.com/user-attachments/assets/673b45f8-a1c1-4fe3-98c5-5d6207227470" width="700" alt="Subject Page" />

### New Assignment
<img src="https://github.com/user-attachments/assets/e299d27e-3e36-4d47-ac84-bd51dc7ad95b" width="700" alt="New Assignment" />

### User Interface
<img src="https://github.com/user-attachments/assets/a9c75b68-d590-4dc0-8e88-16efe647ed81" width="700" alt="User Interface" />

### Features Overview
<img src="https://github.com/user-attachments/assets/3843507a-24ae-4404-92e5-1d1e79563ccf" width="700" alt="Features" />

### Navigation
<img src="https://github.com/user-attachments/assets/639f1337-e7bb-41d2-a6a5-0c13350c0fda" width="700" alt="Navigation" />

### Doubt Portal
<img src="https://github.com/user-attachments/assets/0f3fcc1c-bb63-4999-abf9-30366063dc8e" width="700" alt="Doubt Portal" />

</div>

---

## 📊 Performance Metrics

### Before vs After Optimization

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Bundle Size | ~500KB | ~150KB | **70% reduction** |
| Load Time | ~5 seconds | ~2 seconds | **60% faster** |
| Memory Usage | ~250MB | ~80MB | **68% reduction** |
| FPS (Face Detection) | 2-3 FPS | 4-5 FPS | **80% increase** |

---

## 📚 Documentation

- **[Quick Setup Guide](LIGHTWEIGHT_SETUP.md)** - Detailed installation instructions
- **[Changes Summary](CHANGES_SUMMARY.md)** - Version history and updates
- **[Notification App README](notification-app/README.md)** - Frontend documentation
- **[College Management README](test-vite-app/README.md)** - Management system docs

---

## 🛠️ API Endpoints

### Python Backend (Flask)

```
GET  /video_feed              # Live camera stream
GET  /capture                 # Capture current frame
GET  /captured/<filename>     # Retrieve captured image
POST /api/attendance/save     # Save attendance record
GET  /api/attendance/history  # Get attendance history
```

---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues & Troubleshooting

### Common Issues

**Problem:** Camera not working in attendance system  
**Solution:** Ensure browser has camera permissions and you're using HTTPS or localhost

**Problem:** Firebase authentication error  
**Solution:** Verify `.env.local` file has correct Firebase credentials

**Problem:** Python backend won't start  
**Solution:** Check Python version (3.8+) and install dependencies: `pip install -r requirements.txt`

**Problem:** Port already in use  
**Solution:** Kill the process using the port or change port in configuration

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mrigesh Koyande**

---

## 🌟 Acknowledgments

- React team for the amazing framework
- Firebase for backend infrastructure
- TensorFlow.js community for ML capabilities
- Open source contributors

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by Mrigesh Koyande

</div>
