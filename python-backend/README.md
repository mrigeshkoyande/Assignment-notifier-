# 🎥 Python Backend — Attendance & Image Processing

> Part of the [Assignment Notifier & College Management Platform](https://github.com/mrigeshkoyande/Assignment-notifier-)

Flask-based REST API for handling video streaming, image capture, and attendance record management with camera integration.

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-Latest-000000.svg?logo=flask)](https://flask.palletsprojects.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.x-5C3EE8.svg?logo=opencv)](https://opencv.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- 🎥 **Live Video Streaming** — Real-time camera feed via MJPEG streaming
- 📸 **Image Capture** — Capture frames from camera feed with timestamps
- 📋 **Attendance Records** — Store and manage attendance data as JSON
- 🌐 **REST API** — Simple HTTP endpoints for all operations
- 🔄 **CORS Support** — Enable cross-origin requests for frontend integration
- 📂 **File Management** — Automatic directory creation and file organization
- ⚡ **Lightweight** — Minimal dependencies, fast startup

---

## 📋 Prerequisites

- **Python** 3.8+
- **pip** (Python package manager)
- **Webcam/Camera** (for video streaming and capture)
- **Git** (for version control)

---

## 🚀 Quick Start

### 1. Navigate to Backend Directory

```bash
cd python-backend
```

### 2. Create Virtual Environment

```bash
# Using venv (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
python server.py
```

The API will be available at `http://localhost:5000`

### 5. Stop the Server

Press `Ctrl+C` in the terminal

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | Latest | Web framework |
| Flask-CORS | Latest | Enable CORS headers |
| OpenCV | 4.x | Computer vision & camera access |
| Pillow | Optional | Advanced image processing |

### Install All Dependencies

```bash
pip install -r requirements.txt
```

### Install Individual Packages

```bash
pip install flask
pip install flask-cors
pip install opencv-python
```

---

## 🔌 API Endpoints

### Live Video Feed

```http
GET /video_feed
```

Returns: Live MJPEG video stream from connected camera

**Example Usage (From Frontend):**
```html
<img src="http://localhost:5000/video_feed" alt="Live Camera Feed"/>
```

**cURL Example:**
```bash
curl http://localhost:5000/video_feed
```

---

### Capture Image

```http
GET /capture
```

**Response:** JSON
```json
{
  "message": "Image captured successfully",
  "filename": "capture_1709132400.jpg",
  "url": "http://localhost:5000/captured/capture_1709132400.jpg",
  "timestamp": 1709132400
}
```

**Usage:**
```bash
curl http://localhost:5000/capture
```

---

### Get Captured Image

```http
GET /captured/<filename>
```

Returns: JPEG image file

**Example:**
```bash
curl http://localhost:5000/captured/capture_1709132400.jpg > image.jpg
```

---

### Record Attendance

```http
POST /record_attendance
Content-Type: application/json

{
  "student_id": "STU123",
  "student_name": "John Doe",
  "class_id": "CLASS01",
  "timestamp": 1709132400,
  "image_filename": "capture_1709132400.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Attendance recorded",
  "record_id": "REC_20260228_STU123"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/record_attendance \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU123",
    "student_name": "John Doe",
    "class_id": "CLASS01",
    "timestamp": '$(date +%s)',
    "image_filename": "capture_1709132400.jpg"
  }'
```

---

### Get Attendance Records

```http
GET /attendance_records?class_id=CLASS01
```

**Response:**
```json
{
  "class_id": "CLASS01",
  "records": [
    {
      "student_id": "STU123",
      "student_name": "John Doe",
      "timestamp": 1709132400,
      "image": "capture_1709132400.jpg",
      "date": "2026-02-28"
    }
  ]
}
```

**Usage:**
```bash
curl "http://localhost:5000/attendance_records?class_id=CLASS01"
```

---

### Export Attendance

```http
GET /export_attendance?class_id=CLASS01
```

Returns: JSON file with all attendance data for the class

---

## 📁 Project Structure

```
python-backend/
├── server.py                # Main Flask application
├── requirements.txt         # Python dependencies
├── captured_images/         # Directory for captured photos
├── attendance_records/      # Directory for attendance JSON files
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

### Directory Descriptions

- **captured_images/** — Stores JPEG snapshots from camera
  - File format: `capture_<timestamp>.jpg`
  - Auto-created if doesn't exist

- **attendance_records/** — Stores attendance data
  - File format: `<class_id>_attendance.json`
  - Auto-created if doesn't exist

---

## 🛠️ Development Guide

### Project Layout

```python
# Main server.py structure:
1. Imports and initialization
2. Directory setup
3. Camera initialization
4. Frame generation (video streaming)
5. Route definitions
6. Error handling
7. Main execution
```

### Adding New Endpoints

```python
# Example: Add a new endpoint
@app.route('/your_endpoint', methods=['GET', 'POST'])
def your_function():
    if request.method == 'POST':
        data = request.get_json()
        # Process data
        return jsonify({"status": "success"})
    
    # GET handler
    return jsonify({"data": "your_response"})
```

### Working with Camera

```python
import cv2

# Initialize camera
camera = cv2.VideoCapture(0)  # 0 = default camera

# Read frame from camera
success, frame = camera.read()

# Write frame to file
cv2.imwrite('image.jpg', frame)

# Release camera when done
camera.release()
```

### File Operations

```python
import os
import json

# Create directory if not exists
os.makedirs('directory_name', exist_ok=True)

# Save JSON data
with open('file.json', 'w') as f:
    json.dump(data, f, indent=2)

# Read JSON data
with open('file.json', 'r') as f:
    data = json.load(f)
```

---

## 🧪 Testing

### Manual Testing with cURL

```bash
# Test video feed (will stream continuously)
curl http://localhost:5000/video_feed

# Test image capture
curl http://localhost:5000/capture

# Test attendance recording
curl -X POST http://localhost:5000/record_attendance \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "student_name": "Test Student",
    "class_id": "CLASS001",
    "timestamp": 1709132400,
    "image_filename": "test.jpg"
  }'

# Get attendance records
curl "http://localhost:5000/attendance_records?class_id=CLASS001"
```

### Frontend Integration Testing

Test from your React frontend:

```javascript
// Fetch video feed
<img src="http://localhost:5000/video_feed" alt="Camera"/>

// Capture image
fetch('http://localhost:5000/capture')
  .then(res => res.json())
  .then(data => console.log(data));

// Record attendance
fetch('http://localhost:5000/record_attendance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 'STU123',
    student_name: 'John Doe',
    class_id: 'CLASS01',
    timestamp: Math.floor(Date.now() / 1000),
    image_filename: 'capture.jpg'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🐛 Troubleshooting

### Camera Not Found

**Problem:** Error accessing camera device

**Solutions:**
```bash
# Check if camera is available
# Windows: Device Manager > Cameras
# macOS: System Preferences > Security & Privacy > Camera
# Linux: ls /dev/video*

# Try alternative camera indices:
camera = cv2.VideoCapture(1)  # Try 1, 2, etc.
```

### Port Already in Use

**Problem:** `Address already in use` error

**Solutions:**
```bash
# Option 1: Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Option 2: Use different port
# Edit server.py:
app.run(debug=True, port=5001)
```

### CORS Issues

**Problem:** Frontend can't access API

**Check:** Flask-CORS is installed and enabled
```python
from flask_cors import CORS
CORS(app)  # This enables CORS
```

### Dependencies Not Installing

**Solution:**
```bash
# Update pip
python -m pip install --upgrade pip

# Clear pip cache
pip cache purge

# Reinstall dependencies
pip install -r requirements.txt --no-cache-dir
```

---

## 🔄 Git Workflow for Contributors

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/Assignment-notifier-.git
cd Assignment-notifier-/python-backend
git remote add upstream https://github.com/mrigeshkoyande/Assignment-notifier-.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# Example: git checkout -b feature/add-face-recognition
```

### 3. Make Changes & Test
```bash
python server.py
# Test endpoints with cURL or Postman
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add face recognition to attendance"
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
- Development setup
- Code standards (PEP 8)
- Commit guidelines
- Pull request process
- Testing requirements

**Quick links:**
- [Report Bug](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?labels=bug)
- [Request Feature](https://github.com/mrigeshkoyande/Assignment-notifier-/issues/new?labels=enhancement)
- [Contributing Guide](../CONTRIBUTING.md)

---

## 🔧 Configuration Options

### Camera Selection

```python
# Default camera (built-in webcam)
camera = cv2.VideoCapture(0)

# External USB camera
camera = cv2.VideoCapture(1)

# Camera properties
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
camera.set(cv2.CAP_PROP_FPS, 30)
```

### Server Configuration

```python
# Development mode
app.run(debug=True, host='localhost', port=5000)

# Production mode
app.run(debug=False, host='0.0.0.0', port=5000)
```

---

## 📚 Further Reading

- [Flask Documentation](https://flask.palletsprojects.com)
- [OpenCV Python Tutorials](https://docs.opencv.org/master/d0/de3/tutorial_py_intro.html)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [REST API Best Practices](https://restfulapi.net)

---

## 🔗 Related Modules

- **[Notification App](../notification-app/README.md)** — React frontend for assignments
- **[Test Vite App](../test-vite-app/README.md)** — Full college management system
- **[Main Project](../README.md)** — Complete project documentation

---

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details

---

## 👤 Maintenance

**Maintained by:** Mrigesh Koyande  
**GitHub:** [@mrigeshkoyande](https://github.com/mrigeshkoyande)  
**Email:** [mrigeshkoyande@gmail.com](mailto:mrigeshkoyande@gmail.com)

---

## 🚀 Performance Tips

1. **Use threading** for long-running camera operations
2. **Optimize image size** before storing (resize frames)
3. **Implement caching** for frequently accessed data
4. **Use connection pooling** for database operations
5. **Monitor memory usage** with large video files

---

**Ready to contribute?** [Start here →](../CONTRIBUTING.md)
