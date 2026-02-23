# 📚 Assignment Notifier App

> Part of the [Assignment Notifier & College Management Platform](https://github.com/mrigeshkoyande/Assignment-notifier-)

A lightweight React + Vite application for tracking assignments, deadlines, and subject-wise notifications.

---

## ✨ Features

- 📋 **Assignment Dashboard** — View all pending and completed assignments at a glance
- 📅 **Deadline Tracking** — Visual indicators and alerts for approaching due dates
- 🏷️ **Subject-wise Organization** — Filter assignments by subject or class
- ✅ **Completion Marking** — Mark individual assignments as done
- ➕ **Add New Assignments** — Quick form to create new assignment entries
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🔔 **Custom Notifications** — Set personalized reminders per assignment

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm (comes with Node.js)

### Installation

```bash
# From the repository root
cd notification-app

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output in dist/
```

---

## 📁 Project Structure

```
notification-app/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── AssignmentList.jsx   # Main list component
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   └── Footer.jsx           # App footer
│   ├── pages/
│   │   ├── home.jsx             # Home dashboard
│   │   ├── NewAssignment.jsx    # Add assignment form
│   │   ├── SubjectPage.jsx      # Subject-wise view
│   │   └── About.jsx            # About page
│   ├── data/
│   │   └── assignments.jsx      # Assignment data store
│   ├── App.jsx                  # Main app with routing
│   └── main.jsx                 # Entry point
├── package.json
└── vite.config.js
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.x | Build tool & dev server |
| React Router | 7.x | Client-side routing |

---

## 🔗 Related

- [College Management System](../test-vite-app/README.md) — Full-featured management platform
- [Python Backend](../python-backend/) — Flask API for attendance
- [Main README](../README.md) — Full project documentation

---

## 👨‍💻 Author

**Mrigesh Koyande** — [GitHub](https://github.com/mrigeshkoyande) · [mrigeshkoyande@gmail.com](mailto:mrigeshkoyande@gmail.com)
