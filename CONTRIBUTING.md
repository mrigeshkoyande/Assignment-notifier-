# 🤝 Contributing to Assignment Notifier

Thank you for your interest in contributing to the **Assignment Notifier & College Management Platform**! We welcome contributions from developers at all skill levels. This document provides guidelines and instructions for contributing to the project.

---

## 📝 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Types of Contributions](#types-of-contributions)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

---

## 💼 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and inclusive
- Refrain from any form of harassment or discrimination
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement

Violations may result in temporary or permanent removal from the project.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.8+ and pip
- **Git** 2.30+
- A **GitHub account**

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   Click "Fork" on the GitHub repository page
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Assignment-notifier-.git
   cd Assignment-notifier-
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/mrigeshkoyande/Assignment-notifier-.git
   git fetch upstream
   ```

4. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b bugfix/issue-description
   ```

5. **Install Dependencies**

   For the **Frontend (Notification App)**:
   ```bash
   cd notification-app
   npm install
   npm run dev
   ```

   For the **Backend (Python)**:
   ```bash
   cd python-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

   For the **Test App**:
   ```bash
   cd test-vite-app
   npm install
   npm run dev
   ```

---

## 📌 Types of Contributions

### 1. **Bug Reports & Fixes**
- Found a bug? Report it via [Issues](https://github.com/mrigeshkoyande/Assignment-notifier-/issues)
- Include browser/Python version, OS, and steps to reproduce
- Submit a PR with a fix and reference the issue number

### 2. **Feature Requests**
- Propose new features in the [Issues](https://github.com/mrigeshkoyande/Assignment-notifier-/issues) with detailed description
- Discuss implementation approach before starting heavy coding
- Follow the feature request template

### 3. **Code Improvements**
- Refactoring for better performance
- Improving error handling
- Optimizing bundle size
- Updating dependencies

### 4. **Documentation**
- Improving README files
- Adding API documentation
- Creating usage guides
- Writing tutorials

### 5. **UI/UX Improvements**
- Fixing visual bugs
- Improving accessibility (a11y)
- Responsive design enhancements
- CSS/styling improvements

### 6. **Testing**
- Writing unit tests
- Adding integration tests
- Improving test coverage
- End-to-end testing

---

## 🔄 Development Workflow

### Step 1: Create a Feature Branch
```bash
git checkout -b feature/short-descriptive-name
```

### Step 2: Make Your Changes
- Keep changes focused and atomic
- Test thoroughly before committing
- Don't modify unrelated files

### Step 3: Commit Your Work
Follow the [Commit Guidelines](#commit-guidelines) below.

### Step 4: Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### Step 5: Create a Pull Request
Submit a PR with a clear description of the changes.

---

## 📋 Commit Guidelines

Write clear, concise commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, dependency updates

### Examples

```bash
# Feature
git commit -m "feat(assignments): add assignment filter by subject"

# Bug fix
git commit -m "fix(navbar): resolve navigation dropdown alignment"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(auth): simplify authentication logic"
```

---

## 📤 Pull Request Process

### Before Submitting

1. **Update from Upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Tests**
   ```bash
   # Frontend
   cd notification-app && npm test

   # Backend
   cd python-backend && python -m pytest
   ```

3. **Build Check**
   ```bash
   npm run build  # Frontend
   ```

### PR Title & Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Related Issues
Fixes #(issue number)

## Testing Done
Describe testing procedures.

## Screenshots (if applicable)
Add UI changes screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Tests pass
```

---

## 🎨 Coding Standards

### JavaScript/React

- **Style Guide**: Use ESLint configuration provided
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Formatting**: 2-space indentation
- **Imports**: Use ES6 modules
- **Async**: Use async/await, avoid callback hell

```javascript
// ✅ Good
const handleAssignmentSubmit = async (data) => {
  try {
    const response = await api.submit(data);
    setStatus('success');
  } catch (error) {
    console.error(error);
  }
};

// ❌ Avoid
function handleAssignmentSubmit(data) {
  api.submit(data).then(() => setStatus('success')).catch(err => console.log(err));
}
```

### Python

- **Style Guide**: PEP 8
- **Type Hints**: Use type annotations where applicable
- **Documentation**: Write docstrings for all functions
- **Error Handling**: Use specific exceptions

```python
# ✅ Good
def validate_assignment(data: dict) -> bool:
    """Validate assignment data format.
    
    Args:
        data: Assignment dictionary
        
    Returns:
        True if valid, raises ValueError otherwise
    """
    if not data.get('title'):
        raise ValueError("Assignment title is required")
    return True

# ❌ Avoid
def validateAssignment(data):
    if not data.get('title'):
        raise Exception("Error")
    return True
```

### CSS

- **Naming**: BEM (Block Element Modifier) convention
- **Organization**: Group related styles
- **Mobile First**: Design for mobile, then scale up

```css
/* ✅ Good */
.assignment-card {
  padding: 1rem;
  border-radius: 0.5rem;
}

.assignment-card__title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.assignment-card--completed {
  opacity: 0.6;
}
```

---

## 🧪 Testing

### Frontend Testing
```bash
cd notification-app
npm test                 # Run tests
npm test -- --coverage  # With coverage report
```

### Backend Testing
```bash
cd python-backend
pytest                   # Run all tests
pytest tests/unit       # Run unit tests
pytest --cov           # With coverage
```

### Test Guidelines

- Write tests for new features
- Maintain minimum 70% code coverage
- Use descriptive test names
- Test edge cases and error scenarios

---

## 🐛 Reporting Issues

### Before Reporting

- Check [existing issues](https://github.com/mrigeshkoyande/Assignment-notifier-/issues)
- Try reproducing with the latest code
- Check [Troubleshooting](https://github.com/mrigeshkoyande/Assignment-notifier-#-known-issues--troubleshooting) section

### Issue Template

```markdown
## Description
Clear description of the problem.

## Environment
- OS: Windows 10 / Mac OS / Linux
- Node/Python Version: X.X.X
- Browser: Chrome / Firefox / Safari

## Steps to Reproduce
1. First step
2. Second step
3. Issue occurs

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Screenshots/Logs
Attach relevant screenshots or error logs.

## Additional Context
Any other relevant information.
```

---

## 💡 Feature Requests

### Template

```markdown
## Summary
Brief description of the feature.

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Use Cases
Real-world examples of usage.

## Additional Context
Links, references, or related features.
```

---

## 📚 Project Structure

```
Assignment-notifier-/
├── notification-app/          # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── data/             # Static data
│   │   └── App.jsx
│   └── package.json
├── test-vite-app/            # Full-featured attendance system
├── python-backend/           # Flask backend
│   ├── server.py
│   ├── requirements.txt
│   └── [modules]
└── README.md
```

---

## 🔗 Useful Links

- **GitHub**: [mrigeshkoyande/Assignment-notifier-](https://github.com/mrigeshkoyande/Assignment-notifier-)
- **Issues**: [Report bugs or request features](https://github.com/mrigeshkoyande/Assignment-notifier-/issues)
- **Discussions**: [Join our community](https://github.com/mrigeshkoyande/Assignment-notifier-/discussions)

---

## ✅ Contribution Checklist

Before submitting a PR, ensure:

- [ ] Fork and clone the repository
- [ ] Create a feature branch
- [ ] Make focused, atomic changes
- [ ] Follow coding standards
- [ ] Write clear commit messages
- [ ] Test thoroughly
- [ ] Update documentation if needed
- [ ] Create a descriptive PR
- [ ] Respond to feedback promptly
- [ ] Keep commits clean before merge

---

## 🙏 Thank You!

Your contributions make this project better! Whether it's a small typo fix or a major feature, we appreciate your effort. Happy coding! 🚀

---

## 📞 Questions?

- Open a [Discussion](https://github.com/mrigeshkoyande/Assignment-notifier-/discussions)
- Check existing [Issues](https://github.com/mrigeshkoyande/Assignment-notifier-/issues)
- Review the [README](https://github.com/mrigeshkoyande/Assignment-notifier-/blob/main/README.md)

---

**Happy Contributing! 🎉**
