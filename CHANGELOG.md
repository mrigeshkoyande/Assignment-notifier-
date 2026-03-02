# Changelog

All notable changes to the **Assignment Notifier & College Management Platform** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Enhanced documentation and contributing guidelines
- Comprehensive deployment-ready code examples
- Performance optimization guides

### Changed
- Updated README files across all modules
- Improved accessibility features

### Fixed
- Minor UI alignment issues in calendar components

---

## [v2.1] — 2026-02-28

### Added
- ✅ **Teacher Attendance Management Interface** — Full UI for teachers to view, filter, and manage class attendance records with live statistics and export support
- ✅ **Teacher Attendance Dashboard Integration** — Integrated attendance tracking directly into the teacher dashboard workflow
- ✅ **Enhanced Attendance Calendar** — Added photo support and detailed modal views for attendance entries
- ✅ **Live Preview Thumbnail System** — Real-time thumbnails during photo capture in attendance flow
- ✅ **Camera Preview & Capture UI** — Comprehensive CSS overhaul for camera preview components
- ✅ **Comprehensive Documentation** — New README files for all modules with contribution guidelines
- ✅ **CONTRIBUTING.md** — Complete contributor guide with commit standards and workflow

### Changed
- Improved teacher dashboard responsiveness
- Optimized attendance calendar rendering performance
- Updated modal styling for better mobile experience

### Fixed
- Camera permission handling on Firefox and Safari
- Attendance data synchronization issues
- Calendar event display on small screens

---

## [v2.0] — 2026-01-15

### Added
- ✅ Lightweight attendance system rebuild (70% smaller bundle)
- ✅ TensorFlow.js + COCO-SSD face detection AI integration
- ✅ Smart timetable with "Where is My Lecture?" feature
- ✅ Firebase real-time synchronization across all dashboards
- ✅ Role-based dashboards (Admin / Teacher / Student)
- ✅ Advanced student assignment view with deadline tracking
- ✅ Teacher assignment management interface
- ✅ Admin user and classroom management system
- ✅ Attendance photo capture system
- ✅ Export attendance records to CSV/Excel

### Changed
- Complete rewrite of attendance system
- Migrated state management to React Context API
- Optimized bundle size from 2.5MB to 750KB
- Updated to Vite 7 for faster builds
- Firebase integration across all features

### Removed
- Legacy Redux state management
- Old session-based authentication
- Outdated jQuery dependencies

### Fixed
- Cross-browser compatibility issues
- Camera permission prompts
- Mobile responsive layout bugs

### Security
- Implemented environment variable protection
- Added CORS headers configuration
- Secure Firebase authentication setup

---

## [v1.5] — 2025-11-30

### Added
- Assignment notification system
- Email notification integration
- Dark mode toggle (partial)
- Subject-wise filtering
- Assignment completion marking

### Changed
- Updated React to v18
- Migrated to CSS modules
- Improved component structure

### Fixed
- Bug in assignment deletion
- Notification timing issues

---

## [v1.0] — 2025-09-15

### Added
- Initial release of Assignment Notifier
- Basic assignment tracking dashboard
- Subject organization
- Responsive design
- React Router navigation

### Features
- Assignment list view
- Add/edit/delete assignments
- Mark assignments as complete
- Subject filtering
- Mobile responsive layout

---

## Version History Summary

| Version | Date | Major Features |
|---------|------|----------------|
| v2.1 | Feb 28, 2026 | Teacher Attendance UI, Enhanced Calendar, AI detection |
| v2.0 | Jan 15, 2026 | Lightweight system, Role-based dashboards, TensorFlow.js |
| v1.5 | Nov 30, 2025 | Notifications, Dark mode, Filtering |
| v1.0 | Sep 15, 2025 | Initial release, Basic tracking |

---

## Migration Guides

### Upgrading from v1.5 to v2.0

**Breaking Changes:**
- Redux removed in favor of Context API
- Firebase configuration required
- Environment variables now essential

**Migration Steps:**
1. Back up existing data
2. Update environment variables with Firebase credentials
3. Update browser cache (Ctrl+Shift+Delete)
4. Test all features in development mode

### Upgrading from v2.0 to v2.1

**No breaking changes** — fully backward compatible

**New Features:**
- Teacher attendance management (opt-in)
- Enhanced calendar UI (automatic)
- Performance improvements (automatic)

---

## Contributions

We track contributions and appreciate all community members who have helped improve this project!

### Contributors

- **Mrigesh Koyande** — Lead Developer
- Community contributors (see GitHub for full list)

---

## Future Roadmap

See [README.md](./README.md#-roadmap) for upcoming features and improvements.

---

## Legend

- 📝 Documentation
- ✨ New Features
- 🐛 Bug Fixes
- 📈 Improvements
- 🔒 Security
- ⚡ Performance
- 🎨 UI/UX
- 🔄 Refactoring

---

**Note:** This changelog is maintained manually. Major updates are documented here and in GitHub releases.

**Question about versioning?** See [Semantic Versioning](https://semver.org/)

---

## Unreleased Commits

To see commits not yet released, check the [main branch](https://github.com/mrigeshkoyande/Assignment-notifier-/tree/main).

```bash
# View commits since last release
git log v2.1..main --oneline

# View commit history
git log --oneline --graph --all
```

---

**Last Updated:** March 3, 2026  
**Maintainer:** Mrigesh Koyande
