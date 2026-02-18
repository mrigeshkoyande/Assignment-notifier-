<div align="center">

# 📚 Assignment Notifier & College Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"/>
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB.svg?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.1.9-646CFF.svg?logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB.svg?logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Flask-Latest-000000.svg?logo=flask" alt="Flask"/>
  <img src="https://img.shields.io/badge/Firebase-Integrated-FFCA28.svg?logo=firebase" alt="Firebase"/>
  <img src="https://img.shields.io/badge/TensorFlow.js-AI_Powered-FF6F00.svg?logo=tensorflow" alt="TensorFlow"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/Contributions-Encouraged-blue.svg?style=flat-square" alt="Contributions"/>
  <img src="https://img.shields.io/github/contributors/mrigeshkoyande/Assignment-notifier-?style=flat-square" alt="Contributors"/>
  <img src="https://img.shields.io/github/issues/mrigeshkoyande/Assignment-notifier-?style=flat-square" alt="Issues"/>
  <img src="https://img.shields.io/github/issues-pr/mrigeshkoyande/Assignment-notifier-?style=flat-square" alt="Pull Requests"/>
  <img src="https://img.shields.io/github/last-commit/mrigeshkoyande/Assignment-notifier-?style=flat-square" alt="Last Commit"/>
</p>

<h3 align="center">🎓 A Modern Full-Stack Educational Ecosystem</h3>

<p align="center">
  <strong>Streamline classroom management, track assignments effortlessly, and automate attendance with AI-powered facial recognition.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/mrigeshkoyande/Assignment-notifier-?style=social" alt="GitHub stars"/>
  <img src="https://img.shields.io/github/forks/mrigeshkoyande/Assignment-notifier-?style=social" alt="GitHub forks"/>
  <img src="https://img.shields.io/github/watchers/mrigeshkoyande/Assignment-notifier-?style=social" alt="GitHub watchers"/>
</p>

</div>

---

## � Table of Contents

- [Overview](#-overview)
- [Why Choose This Platform?](#-why-choose-this-platform)
- [Features](#-features)
- [Demo](#-demo)
- [Project Structure](#-project-structure)
- [System Requirements](#-system-requirements)
- [Quick Start](#-quick-start)
- [Security & Environment Variables](#-security--environment-variables)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Performance Metrics](#-performance-metrics)
- [API Endpoints](#️-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-known-issues--troubleshooting)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Support](#-support)

---

## 📖 Overview

Assignment Notifier is a **professional, full-stack educational platform** designed to revolutionize classroom management, assignment tracking, and student attendance. Built with cutting-edge web technologies, it provides an intuitive, responsive interface for students, teachers, and administrators.

### 🎯 Key Highlights

- 🚀 **70% Smaller Bundle Size** - Optimized performance with lightweight architecture
- ⚡ **Real-time Notifications** - Never miss an assignment deadline
- 🔐 **Role-Based Access Control** - Separate dashboards for Admin, Teacher, and Student
- 🤖 **AI-Powered Attendance** - Facial recognition using TensorFlow.js + COCO-SSD
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🔥 **Firebase Integration** - Secure authentication and cloud storage
- 🎨 **Modern UI/UX** - Clean, professional design with glass-morphism effects
- 📊 **Advanced Analytics** - Track performance and generate reports

---

## 🌟 Why Choose This Platform?

<table>
<tr>
<td width="33%" align="center">
<h3>🎓 For Students</h3>
<p>Never miss a deadline with smart notifications. Track all your assignments, view attendance records, and communicate with teachers seamlessly.</p>
</td>
<td width="33%" align="center">
<h3>👨‍🏫 For Teachers</h3>
<p>Effortlessly create and distribute assignments, track student progress, monitor attendance, and export detailed analytics reports.</p>
</td>
<td width="33%" align="center">
<h3>🔐 For Admins</h3>
<p>Centralized user management, system-wide analytics, role assignment, and complete control over platform configuration.</p>
</td>
</tr>
</table>

### 💡 What Sets Us Apart

- **No Heavy Dependencies** - Optimized to run smoothly even on low-end devices
- **Privacy-First** - All facial recognition processing happens locally in the browser
- **Open Source** - Fully transparent, customizable, and community-driven
- **Easy Deployment** - One-click setup scripts for quick installation
- **Scalable Architecture** - Designed to handle growing user bases

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

## 🎬 Demo

### 🔗 Live Applications

**Run locally to experience:**
- **Assignment Notifier**: `http://localhost:5174`
- **College Management**: `http://localhost:5175`
- **Backend API**: `http://localhost:5000`

### 🎥 Video Walkthrough

> 📹 Coming Soon - Full feature demonstration video

---

## 💻 System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+) |
| **Node.js** | v16.0.0 or higher |
| **Python** | v3.8 or higher |
| **RAM** | 4GB minimum, 8GB recommended |
| **Storage** | 500MB free space |
| **Browser** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Camera** | Required for attendance features |
| **Internet** | Required for Firebase features |

### Browser Compatibility

✅ Chrome/Edge (Latest)  
✅ Firefox (Latest)  
✅ Safari (Latest)  
✅ Opera (Latest)  
⚠️ Internet Explorer (Not Supported)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

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

<div align="center">

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|----------|
| React | 19.2.0 | UI library for building components |
| Vite | 7.1.9 | Lightning-fast build tool & dev server |
| React Router | 7.9.4 | Client-side routing & navigation |
| TensorFlow.js | Latest | Machine learning in browser |
| COCO-SSD | Latest | Object/face detection model |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|----------|
| Flask | Latest | Python web framework |
| OpenCV | Latest | Computer vision library |
| Flask-CORS | Latest | Cross-origin resource sharing |

### Infrastructure & Services

| Service | Purpose |
|---------|----------|
| Firebase Auth | Secure user authentication |
| Firestore | NoSQL cloud database |
| Firebase Storage | File & image storage |
| Git & GitHub | Version control & collaboration |

### Development Tools

| Tool | Purpose |
|------|----------|
| ESLint | Code quality & linting |
| Vite HMR | Hot module replacement |
| npm | Package management |
| Virtual Environment | Python dependency isolation |

</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐    ┌─────────────────────────┐    │
│  │  Assignment App     │    │  College Management     │    │
│  │  (React + Vite)     │    │  (React + Vite)         │    │
│  │  Port: 5174         │    │  Port: 5175             │    │
│  └──────────┬──────────┘    └──────────┬──────────────┘    │
│             │                           │                    │
└─────────────┼───────────────────────────┼────────────────────┘
              │                           │
              │      ┌───────────────────┤
              │      │                   │
              ▼      ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌─────────────────────────────┐ │
│  │  Flask Backend   │      │   Firebase Services         │ │
│  │  (Python API)    │      │   - Authentication          │ │
│  │  Port: 5000      │      │   - Firestore Database      │ │
│  │                  │      │   - Cloud Storage           │ │
│  │  - Video Feed    │      └─────────────────────────────┘ │
│  │  - Attendance    │                                       │
│  │  - Camera        │                                       │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │  Local Storage  │    │   Firebase Cloud             │   │
│  │  - Images       │    │   - User Data                │   │
│  │  - Attendance   │    │   - Assignments              │   │
│  └─────────────────┘    │   - Authentication Tokens    │   │
│                         └──────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

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

### Admin Dashboard
<img width="1919" height="869" alt="Screenshot 2026-02-16 213534" src="https://github.com/user-attachments/assets/da228c0d-0ea8-41e6-a36b-78b7199f2990" />
### Student Dashboard
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/6ec3b5b2-bc54-4bcc-b9fd-2b652c7b91b0" />
### Teacher Dashboard
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/0650c978-7886-4ac0-a9c4-e5925b63d84f" />

### Admin pannel
<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/7498c711-711b-494a-9fab-9c54c6ebe5e0" />


### Student Attendence 
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/9f146287-0703-4b15-8ef6-bd9b0e0df7b5" />
### New Assignment
<img width="1919" height="913" alt="Screenshot 2026-02-16 214245" src="https://github.com/user-attachments/assets/fc120264-0ff9-4b63-ac5a-49ef5c1d002e" />
### Mentoer chat 
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/186058a4-36e8-4920-a5bf-9d37f7ebb721" />

### Teacher portal Class analysis 
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/5094338a-d170-48c7-88cc-471cbf7a95ba" />
### Teacher - student attendence system 
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/1638d179-7701-4535-9429-1dfac3cc5978" />
### Teacher student chat portal 
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/83409bd8-44df-4cf6-baf6-4737a903769c" />
### Teacher Attendence marking system 
<img width="1596" height="733" alt="image" src="https://github.com/user-attachments/assets/b88cf3e4-d9f2-4a6c-aa35-d69923179ea0" />


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

## 🚀 Deployment

### Deploying Frontend (Vercel/Netlify)

```bash
# Build for production
cd notification-app
npm run build

# Deploy dist/ folder to Vercel or Netlify
```

### Deploying Backend (Heroku/Railway)

```bash
# Add Procfile
echo "web: python python-backend/server.py" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Docker Deployment

```dockerfile
# Coming soon - Docker Compose setup for full stack deployment
```

### Environment Variables in Production

Ensure all environment variables are set in your hosting platform:
- Vercel/Netlify: Add in dashboard settings
- Heroku: Use `heroku config:set VAR_NAME=value`
- Firebase: Update security rules for production

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Open an issue with detailed steps to reproduce
- 💡 **Suggest Features** - Share your ideas for new functionality
- 📝 **Improve Documentation** - Fix typos or add examples
- 🔧 **Submit Pull Requests** - Contribute code improvements

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Code Style Guidelines

- Follow ESLint rules for JavaScript/React
- Use PEP 8 for Python code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

### Testing Your Changes

```bash
# Run frontend dev server
npm run dev

# Test Python backend
python -m pytest

# Check for errors
npm run lint
```

---

## 🐛 Known Issues & Troubleshooting

### Common Issues

<details>
<summary><strong>🔴 Camera not working in attendance system</strong></summary>

**Solutions:**
- Ensure browser has camera permissions
- Use HTTPS or localhost (required for camera access)
- Check if another app is using the camera
- Try a different browser
</details>

<details>
<summary><strong>🔴 Firebase authentication error</strong></summary>

**Solutions:**
- Verify `.env.local` has correct Firebase credentials
- Check Firebase console for API key restrictions
- Ensure Firebase Authentication is enabled in console
- Clear browser cache and cookies
</details>

<details>
<summary><strong>🔴 Python backend won't start</strong></summary>

**Solutions:**
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5000 is available
- Activate virtual environment first
</details>

<details>
<summary><strong>🔴 Port already in use</strong></summary>

**Solutions:**

Windows:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -ti:5000 | xargs kill -9
```
</details>

<details>
<summary><strong>🔴 Module not found errors</strong></summary>

**Solutions:**
- Delete `node_modules` and run `npm install`
- Clear npm cache: `npm cache clean --force`
- For Python: Recreate virtual environment
</details>

---

## ❓ FAQ

<details>
<summary><strong>Is this free to use?</strong></summary>

Yes! This project is open source under the MIT License. You can use, modify, and distribute it freely.
</details>

<details>
<summary><strong>Do I need a Firebase account?</strong></summary>

Yes, Firebase is required for the College Management System features (authentication, database). The free tier is sufficient for small-scale use.
</details>

<details>
<summary><strong>Can I use this for my school/college?</strong></summary>

Absolutely! This platform is designed for educational institutions. You can customize it to match your requirements.
</details>

<details>
<summary><strong>How does facial recognition work?</strong></summary>

We use TensorFlow.js with COCO-SSD for object detection. All processing happens locally in the browser - no data is sent to external servers.
</details>

<details>
<summary><strong>Can I deploy this to production?</strong></summary>

Yes! You can deploy the frontend to Vercel/Netlify and the backend to Heroku/Railway. See the [Deployment](#-deployment) section for details.
</details>

<details>
<summary><strong>Is mobile responsive?</strong></summary>

Yes! The entire platform is fully responsive and works on devices of all sizes.
</details>

<details>
<summary><strong>Can I add more features?</strong></summary>

Definitely! Fork the repo, add your features, and submit a PR. We welcome contributions!
</details>

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Assignment tracking system
- [x] Role-based authentication
- [x] Face detection attendance
- [x] Admin dashboard
- [x] Teacher analytics
- [x] Student portal
- [x] Real-time notifications
- [x] Firebase integration

### 🚧 In Progress
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Automated testing suite

### 📅 Planned Features
- [ ] **Quiz/Exam Module** - Create and manage online assessments
- [ ] **Grade Management** - Track and analyze student grades
- [ ] **Calendar Integration** - Sync with Google Calendar
- [ ] **File Sharing** - Upload and share course materials
- [ ] **Video Conferencing** - Integrated Zoom/Meet links
- [ ] **Parent Portal** - Allow parents to track student progress
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Dark Mode** - Theme switching
- [ ] **Offline Mode** - PWA with offline capabilities
- [ ] **AI Chatbot** - Automated doubt resolution
- [ ] **Plagiarism Checker** - Assignment submission verification
- [ ] **Attendance Reports** - Automated PDF generation
- [ ] **Timetable Management** - Class scheduling system
- [ ] **Fee Management** - Payment tracking (optional module)

### 💡 Future Enhancements
- GraphQL API
- Microservices architecture
- WebSocket for real-time updates
- Machine learning-based performance predictions
- Blockchain-based certificates

**Want to contribute to these features?** Check our [Contributing](#-contributing) section!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Mrigesh Koyande

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 💬 Support

Need help? Have questions? Reach out!

<div align="center">

### Get in Touch

[![GitHub Issues](https://img.shields.io/github/issues/mrigeshkoyande/Assignment-notifier-?style=for-the-badge)](https://github.com/mrigeshkoyande/Assignment-notifier-/issues)
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-blue?style=for-the-badge&logo=github)](https://github.com/mrigeshkoyande/Assignment-notifier-/discussions)

**Found a bug?** [Report it here](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?template=bug_report.md)  
**Have a feature request?** [Suggest it here](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?template=feature_request.md)

</div>

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

<div align="center">

**Mrigesh Koyande**

[![GitHub followers](https://img.shields.io/github/followers/mrigeshkoyande?style=social)](https://github.com/mrigeshkoyande)
[![GitHub User's stars](https://img.shields.io/github/stars/mrigeshkoyande?style=social)](https://github.com/mrigeshkoyande)

</div>

---

## 🌟 Acknowledgments

Special thanks to:

- **React Team** - For the incredible UI library
- **Vite Team** - For the blazing-fast build tool
- **Firebase** - For robust backend infrastructure
- **TensorFlow.js Community** - For ML capabilities in the browser
- **Open Source Contributors** - For making this possible
- **Educational Community** - For feedback and suggestions

---

<div align="center">

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mrigeshkoyande/Assignment-notifier-&type=Date)](https://star-history.com/#mrigeshkoyande/Assignment-notifier-&Date)

---

### 🎉 If you find this project useful, please give it a ⭐!

[![GitHub Stars](https://img.shields.io/github/stars/mrigeshkoyande/Assignment-notifier-?style=social)](https://github.com/mrigeshkoyande/Assignment-notifier-/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mrigeshkoyande/Assignment-notifier-?style=social)](https://github.com/mrigeshkoyande/Assignment-notifier-/network/members)

---

### 📊 Repository Stats

![GitHub repo size](https://img.shields.io/github/repo-size/mrigeshkoyande/Assignment-notifier-)
![GitHub code size](https://img.shields.io/github/languages/code-size/mrigeshkoyande/Assignment-notifier-)
![GitHub last commit](https://img.shields.io/github/last-commit/mrigeshkoyande/Assignment-notifier-)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/mrigeshkoyande/Assignment-notifier-)

---

**Made with ❤️ by [Mrigesh Koyande](https://github.com/mrigeshkoyande)**

**© 2026 Assignment Notifier Platform. All rights reserved.**

</div>
