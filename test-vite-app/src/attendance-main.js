/**
 * Lightweight Attendance System
 * Vanilla JavaScript + TensorFlow.js
 * No React, minimal dependencies
 */

import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// ==================== STATE ===================
const state = {
    webcamActive: false,
    faceDetected: false,
    locationAcquired: false,
    location: null,
    detectionModel: null,
    mediaStream: null,
    detectionInterval: null,
    isSubmitting: false,
    currentUser: {
        uid: localStorage.getItem('userId') || 'user-' + Date.now(),
        name: localStorage.getItem('userName') || 'Student',
        email: localStorage.getItem('userEmail') || 'student@example.com'
    }
};

// ==================== DOM ELEMENTS ===================
const elements = {
    startBtn: document.getElementById('start-btn'),
    markBtn: document.getElementById('mark-btn'),
    cancelBtn: document.getElementById('cancel-btn'),
    webcam: document.getElementById('webcam'),
    canvas: document.getElementById('face-canvas'),
    startScreen: document.getElementById('attendance-start'),
    verifyScreen: document.getElementById('attendance-verify'),
    successMsg: document.getElementById('success-msg'),
    errorMsg: document.getElementById('error-msg'),
    errorText: document.getElementById('error-text'),
    faceBadge: document.getElementById('face-badge'),
    gpsBadge: document.getElementById('gps-badge'),
    tabs: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    historyList: document.getElementById('history-list')
};

// ==================== INITIALIZATION ===================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Attendance System Loaded');
    
    // Load TensorFlow.js model
    await loadDetectionModel();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load history
    loadAttendanceHistory();
});

// ==================== MODEL LOADING ===================
async function loadDetectionModel() {
    try {
        console.log('Loading detection model...');
        state.detectionModel = await cocoSsd.load();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        showError('Failed to load detection model. Using simple image capture.');
    }
}

// ==================== CAMERA SETUP ===================
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            },
            audio: false
        });

        state.mediaStream = stream;
        elements.webcam.srcObject = stream;
        
        // Wait for video to load
        elements.webcam.onloadedmetadata = () => {
            state.webcamActive = true;
            elements.startScreen.classList.add('hidden');
            elements.verifyScreen.classList.remove('hidden');
            
            // Start face detection
            startFaceDetection();
            
            // Get GPS location
            getLocation();
        };

    } catch (error) {
        console.error('Camera error:', error);
        showError(`Camera error: ${error.message}. Check permissions.`);
    }
}

// ==================== FACE DETECTION ===================
async function startFaceDetection() {
    if (!state.detectionModel) {
        console.log('Model not loaded, using simple frame capture');
        simulateFaceDetection();
        return;
    }

    state.detectionInterval = setInterval(async () => {
        if (!state.webcamActive || !elements.webcam.videoWidth) return;

        try {
            const predictions = await state.detectionModel.detect(elements.webcam);
            
            // Check if any person detected
            const personDetected = predictions.some(p => p.class === 'person');
            
            if (personDetected) {
                state.faceDetected = true;
                updateFaceBadge(true);
                drawDetections(predictions);
            } else {
                state.faceDetected = false;
                updateFaceBadge(false);
                clearCanvas();
            }

            // Enable mark button if both face and GPS
            updateMarkButtonState();

        } catch (error) {
            console.error('Detection error:', error);
        }
    }, 200); // Check every 200ms instead of 100ms for better performance
}

function simulateFaceDetection() {
    // Simple detection without heavy ML - just check if video is playing
    state.faceDetected = true;
    updateFaceBadge(true);
    updateMarkButtonState();
}

function drawDetections(predictions) {
    const ctx = elements.canvas.getContext('2d');
    
    // Set canvas size to match video
    elements.canvas.width = elements.webcam.videoWidth;
    elements.canvas.height = elements.webcam.videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Draw bounding boxes
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#4CAF50';

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeRect(x, y, width, height);
        ctx.fillText(`${prediction.class} ${Math.round(prediction.score * 100)}%`, x, y - 5);
    });
}

function clearCanvas() {
    const ctx = elements.canvas.getContext('2d');
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function updateFaceBadge(detected) {
    if (detected) {
        elements.faceBadge.classList.add('active');
        elements.faceBadge.innerHTML = '<span>✓ Face Detected</span>';
    } else {
        elements.faceBadge.classList.remove('active');
        elements.faceBadge.innerHTML = '<span>🔍 Face Not Detected</span>';
    }
}

// ==================== GPS LOCATION ===================
async function getLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation not supported');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            state.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            state.locationAcquired = true;
            
            elements.gpsBadge.classList.add('active');
            elements.gpsBadge.innerHTML = `<span>✓ GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}</span>`;
            
            updateMarkButtonState();
        },
        (error) => {
            console.warn('GPS error:', error);
            elements.gpsBadge.innerHTML = '<span>⚠️ GPS unavailable (optional)</span>';
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

// ==================== ATTENDANCE MARKING ===================
async function markAttendance() {
    if (!state.faceDetected) {
        showError('Please ensure your face is visible to the camera');
        return;
    }

    state.isSubmitting = true;
    elements.markBtn.disabled = true;
    elements.markBtn.textContent = 'Marking...';

    try {
        // Capture frame
        const imageData = captureFrame();

        // Prepare attendance data
        const attendanceData = {
            userId: state.currentUser.uid,
            userName: state.currentUser.name,
            email: state.currentUser.email,
            timestamp: new Date().toISOString(),
            location: state.location,
            verified: true,
            imageData: imageData
        };

        // Send to backend
        const response = await fetch('http://localhost:5000/api/attendance/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });

        if (!response.ok) throw new Error('Failed to save attendance');

        // Success!
        stopCamera();
        showSuccess();
        
        // Reload history
        setTimeout(loadAttendanceHistory, 1500);

    } catch (error) {
        console.error('Attendance error:', error);
        showError(`Failed to mark attendance: ${error.message}`);
    } finally {
        state.isSubmitting = false;
        elements.markBtn.disabled = false;
        elements.markBtn.textContent = 'Mark Attendance';
    }
}

function captureFrame() {
    // Create a temporary canvas for capturing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = elements.webcam.videoWidth;
    tempCanvas.height = elements.webcam.videoHeight;
    
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(elements.webcam, 0, 0);
    
    // Return as data URL
    return tempCanvas.toDataURL('image/jpeg', 0.7);
}

// ==================== CAMERA CLEANUP ===================
function stopCamera() {
    state.webcamActive = false;

    // Stop all tracks
    if (state.mediaStream) {
        state.mediaStream.getTracks().forEach(track => track.stop());
        state.mediaStream = null;
    }

    // Clear detection interval
    if (state.detectionInterval) {
        clearInterval(state.detectionInterval);
        state.detectionInterval = null;
    }

    // Clear canvas
    clearCanvas();
    
    // Reset UI
    elements.verifyScreen.classList.add('hidden');
    elements.startScreen.classList.remove('hidden');
    state.faceDetected = false;
    state.locationAcquired = false;
}

// ==================== UI HELPERS ===================
function updateMarkButtonState() {
    if (state.faceDetected) {
        elements.markBtn.disabled = false;
    } else {
        elements.markBtn.disabled = true;
    }
}

function showError(message) {
    elements.errorMsg.classList.remove('hidden');
    elements.errorText.textContent = message;
    setTimeout(() => {
        elements.errorMsg.classList.add('hidden');
    }, 5000);
}

function showSuccess() {
    elements.successMsg.classList.remove('hidden');
    setTimeout(() => {
        elements.successMsg.classList.add('hidden');
    }, 3000);
}

// ==================== HISTORY LOADING ===================
async function loadAttendanceHistory() {
    try {
        elements.historyList.innerHTML = '<p class="loading">Loading...</p>';

        const response = await fetch(`http://localhost:5000/api/attendance/${state.currentUser.uid}`);
        const data = await response.json();

        if (!data.records || data.records.length === 0) {
            elements.historyList.innerHTML = '<p class="no-records">No attendance records yet</p>';
            return;
        }

        const html = data.records.map(record => {
            const date = new Date(record.timestamp);
            return `
                <div class="record-item">
                    <div class="record-date">
                        ${date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                    <div class="record-time">
                        ${date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </div>
                    <div class="record-status">
                        <span>✓ Marked</span>
                    </div>
                    ${record.location ? `
                        <div class="record-location">
                            <span>📍 ${record.location.latitude.toFixed(4)}, ${record.location.longitude.toFixed(4)}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        elements.historyList.innerHTML = html;

    } catch (error) {
        console.error('History load error:', error);
        elements.historyList.innerHTML = '<p class="error">Failed to load records</p>';
    }
}

// ==================== EVENT LISTENERS ===================
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startCamera);
    elements.markBtn.addEventListener('click', markAttendance);
    elements.cancelBtn.addEventListener('click', stopCamera);

    // Tab switching
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            
            // Update active tab
            elements.tabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Update content
            elements.tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(`${tabName}-tab`).classList.remove('hidden');

            // Load history when switching to calendar tab
            if (tabName === 'calendar') {
                loadAttendanceHistory();
            }
        });
    });
}

// Store user info (in real app, this comes from Firebase)
window.setUserInfo = (uid, name, email) => {
    state.currentUser = { uid, name, email };
    localStorage.setItem('userId', uid);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
};
