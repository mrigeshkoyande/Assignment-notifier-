/**
 * TeacherAttendance Component
 * Full attendance page for teachers: camera capture → photo preview → confirm → calendar
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { FaCamera, FaMapMarkerAlt, FaCheckCircle, FaCalendarAlt, FaSpinner, FaRedo } from "react-icons/fa";
import AttendanceCalendar from "../../components/AttendanceCalendar";
import "./TeacherAttendance.css";

function TeacherAttendance() {
    const { currentUser } = useAuth();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [location, setLocation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(true);
    const [activeTab, setActiveTab] = useState("mark");
    const [detectionModel, setDetectionModel] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [error, setError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [liveSnapshot, setLiveSnapshot] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [successPhoto, setSuccessPhoto] = useState(null);
    const snapshotIntervalRef = useRef(null);
    
    // Enhanced tracking states
    const [trackingMode, setTrackingMode] = useState("auto"); // auto, manual
    const [detectionConfidence, setDetectionConfidence] = useState(0);
    const [frameRate, setFrameRate] = useState(0);
    const [trackingQuality, setTrackingQuality] = useState("Good");
    const [detectionCount, setDetectionCount] = useState(0);
    const [lastDetectionTime, setLastDetectionTime] = useState(null);
    const frameTimeRef = useRef(Date.now());

    useEffect(() => {
        const loadModel = async () => {
            try {
                const model = await cocoSsd.load();
                setDetectionModel(model);
                setModelsLoaded(true);
            } catch (err) {
                console.warn("Model failed to load, using fallback:", err);
                setModelsLoaded(true);
            }
        };
        loadModel();
        fetchAttendanceRecords();
    }, []);

    const fetchAttendanceRecords = useCallback(async () => {
        try {
            setIsLoadingRecords(true);
            const q = query(
                collection(db, "attendance"),
                where("userId", "==", currentUser?.uid)
            );
            const querySnapshot = await getDocs(q);
            const records = [];
            querySnapshot.forEach((doc) => records.push({ id: doc.id, ...doc.data() }));
            records.sort((a, b) => {
                const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp.seconds * 1000);
                const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp.seconds * 1000);
                return timeB - timeA;
            });
            setAttendanceRecords(records);
        } catch (err) {
            console.error("Error fetching records:", err);
            setError("Failed to load attendance records");
        } finally {
            setIsLoadingRecords(false);
        }
    }, [currentUser?.uid]);

    const updateLiveSnapshot = useCallback(() => {
        if (!videoRef.current || !videoRef.current.videoWidth) return;
        const tmp = document.createElement("canvas");
        tmp.width = videoRef.current.videoWidth;
        tmp.height = videoRef.current.videoHeight;
        tmp.getContext("2d").drawImage(videoRef.current, 0, 0);
        setLiveSnapshot(tmp.toDataURL("image/jpeg", 0.7));
    }, []);

    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
                audio: false,
            });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                videoRef.current.onloadedmetadata = () => {
                    setIsWebcamActive(true);
                    startDetection();
                    getLocation();
                    snapshotIntervalRef.current = setInterval(updateLiveSnapshot, 500);
                };
            }
        } catch (err) {
            if (err.name === "NotAllowedError") setError("❌ Camera permission denied.");
            else if (err.name === "NotFoundError") setError("❌ No camera found.");
            else setError(`❌ Camera error: ${err.message}`);
        }
    };

    const startDetection = () => {
        if (!modelsLoaded) return;
        const loop = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;
            
            // Calculate frame rate
            const now = Date.now();
            const timeDiff = now - frameTimeRef.current;
            if (timeDiff > 0) {
                setFrameRate(Math.round(1000 / timeDiff));
            }
            frameTimeRef.current = now;
            
            try {
                if (detectionModel && videoRef.current.videoWidth > 0) {
                    const predictions = await detectionModel.detect(videoRef.current);
                    const personPredictions = predictions.filter((p) => p.class === "person");
                    const found = personPredictions.length > 0;
                    
                    if (found) { 
                        setFaceDetected(true); 
                        drawDetections(predictions);
                        
                        // Update tracking metrics
                        const maxConfidence = Math.max(...personPredictions.map(p => p.score));
                        setDetectionConfidence(Math.round(maxConfidence * 100));
                        setDetectionCount(prev => prev + 1);
                        setLastDetectionTime(new Date());
                        
                        // Calculate tracking quality
                        if (maxConfidence > 0.8) setTrackingQuality("Excellent");
                        else if (maxConfidence > 0.6) setTrackingQuality("Good");
                        else if (maxConfidence > 0.4) setTrackingQuality("Fair");
                        else setTrackingQuality("Poor");
                    }
                    else { 
                        setFaceDetected(false); 
                        clearCanvas(); 
                        setDetectionConfidence(0);
                        setTrackingQuality("No Detection");
                    }
                } else {
                    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                        setFaceDetected(true);
                        setDetectionConfidence(100);
                        setTrackingQuality("Manual Mode");
                    }
                }
            } catch (e) { console.warn("Detection:", e); }
        }, 300);
        return () => clearInterval(loop);
    };

    const drawDetections = (predictions) => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.fillStyle = "rgba(245,158,11,0.15)";
        predictions.forEach((pred) => {
            if (pred.class === "person") {
                const [x, y, w, h] = pred.bbox;
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
                ctx.fillStyle = "#f59e0b";
                ctx.font = "bold 14px Arial";
                ctx.fillText(`Teacher ${Math.round(pred.score * 100)}%`, x, y - 8);
            }
        });
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }),
            () => { },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const captureImage = () => {
        if (!videoRef.current) return;
        setIsCapturing(true);
        let count = 3;
        setCountdown(count);
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
            } else {
                clearInterval(interval);
                setCountdown(null);
                const tmp = document.createElement("canvas");
                tmp.width = videoRef.current.videoWidth;
                tmp.height = videoRef.current.videoHeight;
                tmp.getContext("2d").drawImage(videoRef.current, 0, 0);
                const img = tmp.toDataURL("image/jpeg", 0.8);
                setCapturedImage(img);
                setShowPreview(true);
                setIsCapturing(false);
                if (snapshotIntervalRef.current) { clearInterval(snapshotIntervalRef.current); snapshotIntervalRef.current = null; }
            }
        }, 1000);
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setShowPreview(false);
        if (isWebcamActive && !snapshotIntervalRef.current)
            snapshotIntervalRef.current = setInterval(updateLiveSnapshot, 500);
    };

    const markAttendance = async () => {
        if (!faceDetected) { setError("⚠️ Please ensure your face is visible to the camera"); return; }
        setIsSubmitting(true);
        setError(null);
        try {
            await addDoc(collection(db, "attendance"), {
                userId: currentUser?.uid,
                userName: currentUser?.displayName,
                email: currentUser?.email,
                role: "teacher",
                timestamp: new Date(),
                location: location || { latitude: 0, longitude: 0 },
                verified: true,
                photoSnapshot: capturedImage || null,
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            });
            setSuccessPhoto(capturedImage);
            setAttendanceMarked(true);
            stopCamera();
            setTimeout(async () => {
                await fetchAttendanceRecords();
                setAttendanceMarked(false);
                setSuccessPhoto(null);
                setActiveTab("calendar");
            }, 2500);
        } catch (err) {
            setError(`❌ Failed to mark attendance: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const stopCamera = () => {
        setIsWebcamActive(false);
        if (mediaStream) { mediaStream.getTracks().forEach((t) => t.stop()); setMediaStream(null); }
        if (videoRef.current) videoRef.current.srcObject = null;
        if (snapshotIntervalRef.current) { clearInterval(snapshotIntervalRef.current); snapshotIntervalRef.current = null; }
        clearCanvas();
        setFaceDetected(false);
        setLiveSnapshot(null);
        setCapturedImage(null);
        setShowPreview(false);
        
        // Reset tracking metrics
        setDetectionConfidence(0);
        setFrameRate(0);
        setTrackingQuality("Good");
        setDetectionCount(0);
    };

    useEffect(() => {
        return () => {
            if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
        };
    }, [mediaStream]);

    return (
        <div className="ta-container">
            <div className="ta-header">
                <h1>📸 Teacher Attendance</h1>
                <p>Mark your daily attendance with photo verification</p>
            </div>

            {error && (
                <div className="ta-error-banner">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Tabs */}
            <div className="ta-tabs">
                <button className={`ta-tab-btn ${activeTab === "mark" ? "active" : ""}`} onClick={() => setActiveTab("mark")}>
                    <FaCamera size={18} /> <span>Mark Attendance</span>
                </button>
                <button className={`ta-tab-btn ${activeTab === "calendar" ? "active" : ""}`} onClick={() => setActiveTab("calendar")}>
                    <FaCalendarAlt size={18} /> <span>Calendar & History</span>
                </button>
            </div>

            {/* Mark Attendance Tab */}
            {activeTab === "mark" && (
                <>
                    {/* Success overlay */}
                    {attendanceMarked && (
                        <div className="ta-success-overlay">
                            <div className="ta-success-card">
                                <div className="ta-success-icon-ring">
                                    <FaCheckCircle size={48} />
                                </div>
                                <h2>✅ Attendance Marked!</h2>
                                <p>Your photo has been captured and attendance recorded.</p>
                                {successPhoto && (
                                    <div className="ta-success-photo-wrapper">
                                        <img src={successPhoto} alt="Your attendance photo" className="ta-success-photo" />
                                        <div className="ta-success-photo-badge">📸 Verified Photo</div>
                                    </div>
                                )}
                                <p className="ta-redirect-hint">Opening your calendar…</p>
                            </div>
                        </div>
                    )}

                    {!isWebcamActive ? (
                        <div className="ta-start glass-panel">
                            <FaCamera size={64} className="ta-camera-icon" />
                            <h2>Ready to Mark Today's Attendance?</h2>
                            <p>Your camera will capture a photo to verify your presence</p>
                            <button className="ta-btn-primary ta-btn-start" onClick={startCamera} disabled={!modelsLoaded}>
                                {modelsLoaded ? "🎥 Start Camera" : <><FaSpinner className="ta-spinner" /> Loading AI Model...</>}
                            </button>
                            <p className="ta-help-text">Ensure your camera is enabled in browser settings</p>
                        </div>
                    ) : (
                        <div className="ta-verify glass-panel">
                            {!showPreview ? (
                                <>
                                    <div className="ta-info-banner">
                                        <p>📸 Look at the camera. The right panel shows a live preview — this is your attendance photo.</p>
                                    </div>

                                    {/* Tracking Mode Selector */}
                                    <div className="tracking-mode-selector">
                                        <span className="mode-label">Tracking Mode:</span>
                                        <div className="mode-buttons">
                                            <button 
                                                className={`mode-btn ${trackingMode === "auto" ? "active" : ""}`}
                                                onClick={() => setTrackingMode("auto")}
                                            >
                                                🤖 Auto Detection
                                            </button>
                                            <button 
                                                className={`mode-btn ${trackingMode === "manual" ? "active" : ""}`}
                                                onClick={() => setTrackingMode("manual")}
                                            >
                                                👤 Manual Mode
                                            </button>
                                        </div>
                                    </div>

                                    <div className="ta-camera-layout">
                                        {/* Camera Feed */}
                                        <div className="ta-video-wrap">
                                            <div className="ta-video-container">
                                                <video ref={videoRef} className="ta-webcam" muted />
                                                <canvas ref={canvasRef} className="ta-overlay" />
                                                <div className="ta-capture-frame">
                                                    <div className="ta-corner top-left" />
                                                    <div className="ta-corner top-right" />
                                                    <div className="ta-corner bottom-left" />
                                                    <div className="ta-corner bottom-right" />
                                                </div>
                                                {countdown && (
                                                    <div className="ta-countdown-overlay">
                                                        <div className="ta-countdown-num">{countdown}</div>
                                                    </div>
                                                )}
                                                {isCapturing && countdown === null && <div className="ta-flash" />}
                                                <div className="ta-status-indicators">
                                                    <div className={`ta-status-badge ${faceDetected ? "active" : ""}`}>
                                                        <FaCheckCircle /> <span>{faceDetected ? "✓ Detected" : "🔍 Scanning..."}</span>
                                                    </div>
                                                    <div className={`ta-status-badge ${location ? "active" : ""}`}>
                                                        <FaMapMarkerAlt /> <span>{location ? `✓ GPS` : "📍 GPS..."}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Live Snapshot Panel */}
                                        <div className={`ta-snapshot-panel ${faceDetected ? 'face-detected' : ''} ${isCapturing ? 'capturing' : ''}`}>
                                            <div className="live-indicator">
                                                <span className="live-dot"></span>
                                                <span className="live-text">LIVE</span>
                                            </div>
                                            <h4>📷 Live Preview</h4>
                                            <p className="ta-preview-hint">This exact photo will be saved with your attendance record</p>
                                            <div className="ta-preview-frame-wrapper">
                                                {liveSnapshot ? (
                                                    <>
                                                        <img src={liveSnapshot} alt="Live preview" className="ta-snapshot-img" />
                                                        {isCapturing && countdown && (
                                                            <div className="preview-countdown-badge">
                                                                <span className="preview-countdown-number">{countdown}</span>
                                                            </div>
                                                        )}
                                                        {isCapturing && !countdown && (
                                                            <div className="capture-flash-overlay"></div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="ta-snapshot-placeholder">
                                                        <FaCamera size={32} />
                                                        <p>Loading preview...</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ta-preview-info"><small>✓ Updates every 0.5s</small></div>
                                            {faceDetected && !isCapturing && (
                                                <div className="ta-detection-badge pulse-animation">
                                                    <FaCheckCircle size={14} /> Ready to capture!
                                                </div>
                                            )}
                                            {isCapturing && (
                                                <div className="capturing-badge">
                                                    <FaCamera size={14} /> Capturing in progress...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Enhanced Tracking Information Panel */}
                                    <div className="tracking-info-panel">
                                        <h4>📊 Real-Time Tracking Analytics</h4>
                                        
                                        <div className="tracking-metrics-grid">
                                            {/* Detection Status */}
                                            <div className={`metric-card ${faceDetected ? 'active' : ''}`}>
                                                <div className="metric-icon">
                                                    {faceDetected ? '✅' : '⏳'}
                                                </div>
                                                <div className="metric-content">
                                                    <span className="metric-label">Detection Status</span>
                                                    <span className="metric-value">{faceDetected ? 'Person Detected' : 'Scanning...'}</span>
                                                </div>
                                            </div>

                                            {/* Confidence Level */}
                                            <div className="metric-card">
                                                <div className="metric-icon">🎯</div>
                                                <div className="metric-content">
                                                    <span className="metric-label">Confidence</span>
                                                    <span className="metric-value">{detectionConfidence}%</span>
                                                </div>
                                                <div className="confidence-bar">
                                                    <div 
                                                        className="confidence-fill" 
                                                        style={{
                                                            width: `${detectionConfidence}%`,
                                                            backgroundColor: detectionConfidence > 70 ? '#10b981' : detectionConfidence > 40 ? '#f59e0b' : '#ef4444'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Tracking Quality */}
                                            <div className="metric-card">
                                                <div className="metric-icon">⭐</div>
                                                <div className="metric-content">
                                                    <span className="metric-label">Tracking Quality</span>
                                                    <span className={`metric-value quality-${trackingQuality.toLowerCase().replace(' ', '-')}`}>
                                                        {trackingQuality}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Frame Rate */}
                                            <div className="metric-card">
                                                <div className="metric-icon">📹</div>
                                                <div className="metric-content">
                                                    <span className="metric-label">Frame Rate</span>
                                                    <span className="metric-value">{frameRate} FPS</span>
                                                </div>
                                            </div>

                                            {/* Detection Count */}
                                            <div className="metric-card">
                                                <div className="metric-icon">🔢</div>
                                                <div className="metric-content">
                                                    <span className="metric-label">Detections</span>
                                                    <span className="metric-value">{detectionCount}</span>
                                                </div>
                                            </div>

                                            {/* GPS Status */}
                                            <div className={`metric-card ${location ? 'active' : ''}`}>
                                                <div className="metric-icon">
                                                    <FaMapMarkerAlt />
                                                </div>
                                                <div className="metric-content">
                                                    <span className="metric-label">GPS Location</span>
                                                    <span className="metric-value">
                                                        {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Waiting...'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="tracking-tips">
                                            <div className="tip-item">
                                                <span className="tip-icon">💡</span>
                                                <span>Ensure good lighting for better detection accuracy</span>
                                            </div>
                                            <div className="tip-item">
                                                <span className="tip-icon">👤</span>
                                                <span>Position your face within the frame guides</span>
                                            </div>
                                            <div className="tip-item">
                                                <span className="tip-icon">🎯</span>
                                                <span>Higher confidence = better photo quality</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ta-btn-group">
                                        <button
                                            className="ta-btn-primary"
                                            onClick={captureImage}
                                            disabled={!faceDetected || isCapturing}
                                        >
                                            {isCapturing ? "📸 Capturing..." : "📸 Capture Photo (3s)"}
                                        </button>
                                        <button className="ta-btn-secondary" onClick={stopCamera}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                /* ── Photo Preview + Confirm ── */
                                <>
                                    <div className="ta-preview-container">
                                        <div className="ta-preview-badge">📸 Photo Captured!</div>
                                        <h3>Review Your Photo Before Confirming</h3>
                                        <p className="ta-preview-instruction">Ensure your face is clearly visible before confirming.</p>

                                        <div className="ta-captured-card">
                                            <div className="ta-photo-frame">
                                                <img src={capturedImage} alt="Captured" className="ta-preview-photo" />
                                                <div className="ta-photo-ts">
                                                    🕐 {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                                </div>
                                            </div>
                                            <div className="ta-photo-meta">
                                                <div className="ta-meta-row">
                                                    <span className="ta-meta-label">👤 Teacher</span>
                                                    <span className="ta-meta-val">{currentUser?.displayName || currentUser?.email}</span>
                                                </div>
                                                {location && (
                                                    <div className="ta-meta-row">
                                                        <span className="ta-meta-label">📍 GPS</span>
                                                        <span className="ta-meta-val">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                                                    </div>
                                                )}
                                                <div className="ta-meta-row">
                                                    <span className="ta-meta-label">📅 Date</span>
                                                    <span className="ta-meta-val">
                                                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                                                    </span>
                                                </div>
                                                <div className="ta-meta-row">
                                                    <span className="ta-meta-label">🎓 Role</span>
                                                    <span className="ta-meta-val ta-teacher-chip">Teacher</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ta-preview-checks">
                                            <div className="ta-check-item"><FaCheckCircle className="ta-check-icon" /><span>Face clearly visible</span></div>
                                            <div className="ta-check-item"><FaCheckCircle className="ta-check-icon" /><span>Good lighting</span></div>
                                            <div className="ta-check-item"><FaCheckCircle className="ta-check-icon" /><span>Identity verified</span></div>
                                        </div>
                                    </div>

                                    <div className="ta-btn-group">
                                        <button className="ta-btn-confirm" onClick={markAttendance} disabled={isSubmitting}>
                                            {isSubmitting ? "⏳ Marking..." : "✅ Confirm & Mark Attendance"}
                                        </button>
                                        <button className="ta-btn-retake" onClick={retakePhoto} disabled={isSubmitting}>
                                            <FaRedo size={14} /> Retake
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Calendar & History Tab */}
            {activeTab === "calendar" && (
                <div className="ta-calendar-tab">
                    {isLoadingRecords ? (
                        <div className="ta-loading">
                            <FaSpinner className="ta-spinner" />
                            <p>Loading records...</p>
                        </div>
                    ) : (
                        <>
                            <AttendanceCalendar attendanceData={attendanceRecords} />

                            {attendanceRecords.length > 0 && (
                                <div className="ta-records-panel glass-panel">
                                    <h3>📋 Your Attendance History</h3>
                                    <div className="ta-records-scroll">
                                        {attendanceRecords.slice(0, 10).map((record) => {
                                            const date = record.timestamp instanceof Date
                                                ? record.timestamp
                                                : new Date(record.timestamp.seconds * 1000);
                                            return (
                                                <div key={record.id} className="ta-record-item">
                                                    {record.photoSnapshot && (
                                                        <div className="ta-record-thumb">
                                                            <img src={record.photoSnapshot} alt="Attendance" />
                                                        </div>
                                                    )}
                                                    <div className="ta-record-date">
                                                        {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                                                    </div>
                                                    <div className="ta-record-time">
                                                        {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </div>
                                                    <div className="ta-record-status">
                                                        <FaCheckCircle className="ta-status-green" /> <span>Present</span>
                                                    </div>
                                                    {record.location && record.location.latitude !== 0 && (
                                                        <div className="ta-record-location">
                                                            <FaMapMarkerAlt size={12} /> <span>{record.location.latitude.toFixed(4)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {attendanceRecords.length === 0 && (
                                <div className="ta-no-records glass-panel">
                                    <FaCalendarAlt size={48} />
                                    <p>No attendance records yet</p>
                                    <small>Mark your first attendance in the camera tab</small>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default TeacherAttendance;
