<hr>
Assignment Notifier

Assignment Notifier is a professional solution designed to enhance the Google Classroom experience by providing timely notifications, streamlined assignment tracking, and a user-friendly interface. Say goodbye to missing deadlines and scattered classroom updates — this app keeps you organized and on top of your work.
<hr>

## 📁 Project Structure

This repository contains multiple sub-projects:

1. **notification-app** - React-based assignment notification system with dashboard and tracking
2. **test-vite-app** - College management system with role-based authentication and Firebase integration

## 🔐 Security & Environment Variables

All sensitive information (API keys, credentials) is managed through environment variables. Each sub-project that requires credentials includes:

- `.env.example` - Template file showing required variables
- `.env.local` - Local environment file (git-ignored, not committed)

### Setting Up Environment Variables

For projects requiring Firebase or other credentials:

```bash
cd [project-folder]
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

**Important**: Never commit `.env.local` or any files containing sensitive data.

## 🌟 Features

Real-time notifications for new assignments and updates.

Intuitive dashboard to track pending and completed tasks.

Clean, professional UI optimized for easy navigation.

Supports multiple classes and assignments.

Custom reminders to help manage deadlines efficiently.

Role-based access control (Admin, Teacher, Student).



📌 Usage

### Notification App
Open the app and log in with your Google Classroom account.
View your dashboard to see assignments sorted by due date.
Configure custom notifications and reminders for your classes.
Mark assignments as completed to keep track of your progress.

### Test Vite App (College Management System)
1. Install dependencies: `npm install`
2. Set up environment variables (see Security section above)
3. Start development server: `npm run dev`
4. Login with your assigned role (Admin, Teacher, or Student)
5. Access role-specific features and dashboards

<hr>

💡 Tech Stack

**Frontend**: React.js, Vite
**Backend**: Node.js, Firebase (Auth, Firestore, Storage)
**Notifications**: Push API / Custom scheduler
**Version Control**: Git & GitHub
**Authentication**: Firebase Auth with role-based access

<hr>

## 🚀 Getting Started

Each sub-project has its own setup instructions. See the respective README files:
- [notification-app/README.md](notification-app/README.md)
- [test-vite-app/README.md](test-vite-app/README.md)

<hr>

📄 License

This project is licensed under the MIT License.
