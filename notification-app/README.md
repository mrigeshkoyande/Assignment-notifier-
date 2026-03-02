# 📚 Assignment Notifier App

> Part of the [Assignment Notifier & College Management Platform](https://github.com/mrigeshkoyande/Assignment-notifier-)

A lightweight React + Vite application for tracking assignments, deadlines, and subject-wise notifications.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF.svg?logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933.svg?logo=nodedotjs)](https://nodejs.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- 📋 **Assignment Dashboard** — View all pending and completed assignments at a glance
- 📅 **Deadline Tracking** — Visual indicators and alerts for approaching due dates
- 🏷️ **Subject-wise Organization** — Filter assignments by subject or class
- ✅ **Completion Marking** — Mark individual assignments as done
- ➕ **Add New Assignments** — Quick form to create new assignment entries
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🔔 **Custom Notifications** — Set personalized reminders per assignment
- ⚡ **Fast & Lightweight** — Built with Vite for instant HMR and optimized builds

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ (includes npm)
- **Git** v2.30+

### Installation

```bash
# Clone the repository
git clone https://github.com/mrigeshkoyande/Assignment-notifier-.git
cd Assignment-notifier-/notification-app

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

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
notification-app/
├── public/                      # Static assets (favicon, favicons)
├── src/
│   ├── components/
│   │   ├── AssignmentList.jsx   # Main list component with filtering
│   │   ├── AssignmentList.css   # Assignment list styles
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Navbar.css           # Navigation styles
│   │   ├── Footer.jsx           # App footer
│   │   └── Footer.css           # Footer styles
│   ├── pages/
│   │   ├── Home.jsx             # Home dashboard
│   │   ├── Home.css             # Home page styles
│   │   ├── NewAssignment.jsx    # Add assignment form
│   │   ├── NewAssignment.css    # Form styles
│   │   ├── SubjectPage.jsx      # Subject-wise view
│   │   ├── SubjectPage.css      # Subject page styles
│   │   ├── About.jsx            # About page
│   │   └── About.css            # About page styles
│   ├── data/
│   │   └── assignments.jsx      # Mock assignment data
│   ├── assets/                  # Fonts, images, logos
│   ├── App.jsx                  # Main app with routing
│   ├── App.css                  # Global app styles
│   ├── index.jsx                # React entry point
│   ├── main.jsx                 # Vite entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint rules
└── README.md                    # This file
```

---

## 🛠️ Development Guide

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting (if configured)
npm run lint
```

### Component Structure

**Parent Components:**
- `App.jsx` — Main router and layout wrapper
- `Navbar.jsx` — Top navigation with links

**Page Components:**
- `Home.jsx` — Dashboard showing all assignments
- `NewAssignment.jsx` — Form for adding new assignments
- `SubjectPage.jsx` — Subject-specific assignment view
- `About.jsx` — Information about the app

**Reusable Components:**
- `AssignmentList.jsx` — Displays list of assignments with filtering/sorting

### State Management

Currently using **React hooks** for state management:
- `useState()` — Local component state
- `useContext()` — Shared context (to be expanded)

### Styling

Using **CSS modules** and **global CSS**:
- Component-specific styles: `.css` files alongside components
- Global styles: `index.css`, `App.css`
- CSS Methodology: BEM (Block Element Modifier)

---

## 🧪 Testing

Currently, testing is being set up. To add tests:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react

# Run tests (once configured)
npm run test
```

---

## 🔄 Git Workflow for Contributors

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/Assignment-notifier-.git
cd Assignment-notifier-/notification-app
git remote add upstream https://github.com/mrigeshkoyande/Assignment-notifier-.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/description
# Example: git checkout -b feature/dark-mode-toggle
```

### 3. Make Changes & Test
```bash
npm run dev
# Test your changes in the browser
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add dark mode toggle"
# See CONTRIBUTING.md for commit guidelines
```

### 5. Push & Create PR
```bash
git push origin feature/description
# Create pull request on GitHub
```

---

## 📋 Common Development Tasks

### Adding a New Assignment Page Component

```jsx
// src/pages/YourPage.jsx
import React from 'react';
import './YourPage.css';

export default function YourPage() {
  return (
    <div className="your-page">
      <h1>Your Page</h1>
      {/* Content here */}
    </div>
  );
}
```

```jsx
// Add to App.jsx routing
import YourPage from './pages/YourPage';
```

### Adding Styles

```css
/* src/components/YourComponent.css */
.your-component {
  padding: 1rem;
  border-radius: 0.5rem;
}

.your-component__title {
  font-size: 1.5rem;
  font-weight: bold;
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3000
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### HMR Not Working
Check your firewall settings and ensure localhost is allowed.

---

## 🤝 Contributing

We welcome contributions! Please see the [main CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development setup
- Commit guidelines
- Pull request process
- Coding standards
- Code of conduct

**Quick links:**
- [Report Bug](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?labels=bug)
- [Request Feature](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?labels=enhancement)
- [Contributing Guide](../CONTRIBUTING.md)

---

## 🔗 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 7.1.9 | Build tool & dev server |
| React Router | 6.22.3 | Client-side routing |
| TensorFlow.js | 4.22.0 | AI capabilities (optional) |

---

## 📚 Further Reading

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router v6](https://reactrouter.com/docs)
- [Project README](../README.md) — Full project documentation
- [College Management System](../test-vite-app) — Full-featured platform

---

## 👨‍💻 Related Modules

- **[Test Vite App](../test-vite-app/README.md)** — Full college management system with attendance
- **[Python Backend](../python-backend/)** — Flask API for data processing
- **[Main Project](../README.md)** — Complete platform overview

---

## 📝 License

MIT License — See [LICENSE](../LICENSE) file for details

---

## 👤 Maintenance

**Maintained by:** Mrigesh Koyande  
**GitHub:** [@mrigeshkoyande](https://github.com/mrigeshkoyande)  
**Email:** [mrigeshkoyande@gmail.com](mailto:mrigeshkoyande@gmail.com)

---

**Want to contribute?** [Start here →](../CONTRIBUTING.md)
