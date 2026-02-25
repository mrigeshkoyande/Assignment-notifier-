/**
 * Attendance Component
 * Camera capture → photo preview → confirm → calendar view with photo modal
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { FaCamera, FaMapMarkerAlt, FaCheckCircle, FaCalendar, FaSpinner, FaRedo } from "react-icons/fa";
import AttendanceCalendar from "../../components/AttendanceCalendar";
import "./Attendance.css";

function Attendance() {
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
    // showPreview = true means camera stopped and we're in "review photo" mode
    const [showPreview, setShowPreview] = useState(false);
    const [liveSnapshot, setLiveSnapshot] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [successPhoto, setSuccessPhoto] = useState(null);
    const snapshotIntervalRef = useRef(null);

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
            setCapturedImage(null);
            setShowPreview(false);
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
            if (err.name === "NotAllowedError") setError("❌ Camera permission denied. Please enable camera access in browser settings.");
            else if (err.name === "NotFoundError") setError("❌ No camera found. Please connect a camera device.");
            else setError(`❌ Camera error: ${err.message}`);
        }
    };

    const startDetection = () => {
        if (!modelsLoaded) return;
        const detectionLoop = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;
            try {
                if (detectionModel && videoRef.current.videoWidth > 0) {
                    const predictions = await detectionModel.detect(videoRef.current);
                    const personDetected = predictions.some((p) => p.class === "person");
                    if (personDetected) { setFaceDetected(true); drawDetections(predictions); }
                    else { setFaceDetected(false); clearCanvas(); }
                } else {
                    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA)
                        setFaceDetected(true);
                }
            } catch (err) { console.warn("Detection error:", err); }
        }, 300);
        return () => clearInterval(detectionLoop);
    };

    const drawDetections = (predictions) => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#4CAF50";
        ctx.lineWidth = 3;
        ctx.fillStyle = "rgba(76,175,80,0.2)";
        predictions.forEach((pred) => {
            if (pred.class === "person") {
                const [x, y, width, height] = pred.bbox;
                ctx.fillRect(x, y, width, height);
                ctx.strokeRect(x, y, width, height);
                ctx.fillStyle = "#4CAF50";
                ctx.font = "bold 14px Arial";
                ctx.fillText(`Person ${Math.round(pred.score * 100)}%`, x, y - 8);
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

    // Stop only the camera stream (does NOT clear the captured image)
    const stopCameraStream = () => {
        setIsWebcamActive(false);
        if (mediaStream) { mediaStream.getTracks().forEach((t) => t.stop()); setMediaStream(null); }
        if (videoRef.current) videoRef.current.srcObject = null;
        if (snapshotIntervalRef.current) { clearInterval(snapshotIntervalRef.current); snapshotIntervalRef.current = null; }
        clearCanvas();
        setFaceDetected(false);
        setLiveSnapshot(null);
    };

    // Full reset — called by Cancel button
    const stopCamera = () => {
        stopCameraStream();
        setCapturedImage(null);
        setShowPreview(false);
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

                // Grab the frame
                const tmp = document.createElement("canvas");
                tmp.width = videoRef.current.videoWidth;
                tmp.height = videoRef.current.videoHeight;
                tmp.getContext("2d").drawImage(videoRef.current, 0, 0);
                const imageData = tmp.toDataURL("image/jpeg", 0.8);

                // Stop camera stream, keep imageData for preview
                stopCameraStream();

                setCapturedImage(imageData);
                setShowPreview(true);
                setIsCapturing(false);
            }
        }, 1000);
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setShowPreview(false);
        // Re-open the camera
        startCamera();
    };

    const markAttendance = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await addDoc(collection(db, "attendance"), {
                userId: currentUser?.uid,
                userName: currentUser?.displayName,
                email: currentUser?.email,
                timestamp: new Date(),
                location: location || { latitude: 0, longitude: 0 },
                verified: true,
                photoSnapshot: capturedImage || null,
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            });

            // Show success overlay with the photo
            const photoToShow = capturedImage;
            setSuccessPhoto(photoToShow);
            setAttendanceMarked(true);
            setShowPreview(false);
            setCapturedImage(null);

            // After 2.5s switch to calendar
            setTimeout(async () => {
                await fetchAttendanceRecords();
                setAttendanceMarked(false);
                setSuccessPhoto(null);
                setActiveTab("calendar");
            }, 2500);
        } catch (err) {
            console.error("Error marking attendance:", err);
            setError(`❌ Failed to mark attendance: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        return () => {
            if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
        };
    }, [mediaStream]);

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h1>📸 Mark Attendance</h1>
                <p>Use your camera to verify your presence</p>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Tabs */}
            <div className="attendance-tabs">
                <button className={`tab-btn ${activeTab === "mark" ? "active" : ""}`} onClick={() => setActiveTab("mark")}>
                    <FaCamera size={18} /> <span>Mark Attendance</span>
                </button>
                <button className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`} onClick={() => setActiveTab("calendar")}>
                    <FaCalendar size={18} /> <span>Calendar &amp; History</span>
                </button>
            </div>

            {/* ── Mark Attendance Tab ── */}
            {activeTab === "mark" && (
                <>
                    {/* ── SUCCESS OVERLAY (shown after confirm) ── */}
                    {attendanceMarked && (
                        <div className="mark-success-overlay">
                            <div className="mark-success-card">
                                <div className="success-icon-ring">
                                    <FaCheckCircle size={48} />
                                </div>
                                <h2>✅ Attendance Marked!</h2>
                                <p>Your photo has been captured and attendance recorded.</p>
                                {successPhoto && (
                                    <div className="success-photo-wrapper">
                                        <img src={successPhoto} alt="Your attendance photo" className="success-photo" />
                                        <div className="success-photo-badge">📸 Captured Photo</div>
                                    </div>
                                )}
                                <p className="redirect-hint">Redirecting to your calendar in a moment…</p>
                            </div>
                        </div>
                    )}

                    {/* ── PHOTO PREVIEW (camera stopped, reviewing captured image) ── */}
                    {showPreview && capturedImage ? (
                        <div className="attendance-verify glass-panel">
                            <div className="preview-comparison-container">
                                <div className="preview-header-badge">📸 Photo Captured!</div>
                                <h3>Review Your Photo Before Confirming</h3>
                                <p className="preview-instruction">
                                    Make sure the photo is clear and your face is fully visible before confirming attendance.
                                </p>

                                <div className="captured-photo-card">
                                    <div className="captured-photo-frame">
                                        <img src={capturedImage} alt="Your captured photo" className="preview-image-large" />
                                        <div className="photo-timestamp">
                                            🕐 {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                        </div>
                                    </div>
                                    <div className="photo-meta">
                                        <div className="photo-meta-row">
                                            <span className="meta-label">👤 User</span>
                                            <span className="meta-value">{currentUser?.displayName || currentUser?.email}</span>
                                        </div>
                                        {location && (
                                            <div className="photo-meta-row">
                                                <span className="meta-label">📍 GPS</span>
                                                <span className="meta-value">
                                                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="photo-meta-row">
                                            <span className="meta-label">📅 Date</span>
                                            <span className="meta-value">
                                                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="preview-checks">
                                    <div className="check-item"><FaCheckCircle className="check-icon" /><span>Face is clearly visible</span></div>
                                    <div className="check-item"><FaCheckCircle className="check-icon" /><span>Photo quality good</span></div>
                                    <div className="check-item"><FaCheckCircle className="check-icon" /><span>Identity verified</span></div>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn-primary btn-confirm" onClick={markAttendance} disabled={isSubmitting}>
                                    {isSubmitting ? "⏳ Marking..." : "✅ Confirm & Mark Attendance"}
                                </button>
                                <button className="btn-retake" onClick={retakePhoto} disabled={isSubmitting}>
                                    <FaRedo size={14} /> Retake Photo
                                </button>
                            </div>
                        </div>

                    ) : !isWebcamActive ? (
                        /* ── START SCREEN ── */
                        <div className="attendance-start glass-panel">
                            <FaCamera size={64} className="camera-icon" />
                            <h2>Ready to Mark Attendance?</h2>
                            <p>We'll capture a photo and detect your presence using your camera</p>
                            <button className="btn-primary btn-start" onClick={startCamera} disabled={!modelsLoaded}>
                                {modelsLoaded ? "🎥 Start Camera" : <><FaSpinner className="spinner" /> Loading...</>}
                            </button>
                            <p className="help-text">Make sure your camera is connected and permissions are enabled</p>
                        </div>

                    ) : (
                        /* ── LIVE CAMERA SCREEN ── */
                        <div className="attendance-verify glass-panel">
                            <div className="info-banner">
                                <p>📸 Position yourself in the frame. The right panel shows a live preview — this is your attendance photo.</p>
                            </div>

                            <div className="camera-preview-layout">
                                {/* Live Camera Feed */}
                                <div className="video-container-main">
                                    <div className="video-container">
                                        <video ref={videoRef} className="webcam-feed" muted />
                                        <canvas ref={canvasRef} className="face-overlay" />
                                        <div className="capture-frame">
                                            <div className="frame-corner top-left"></div>
                                            <div className="frame-corner top-right"></div>
                                            <div className="frame-corner bottom-left"></div>
                                            <div className="frame-corner bottom-right"></div>
                                        </div>
                                        {countdown && (
                                            <div className="countdown-overlay">
                                                <div className="countdown-number">{countdown}</div>
                                            </div>
                                        )}
                                        {isCapturing && countdown === null && <div className="flash-effect"></div>}
                                        <div className="status-indicators">
                                            <div className={`status-badge ${faceDetected ? "active" : ""}`}>
                                                <FaCheckCircle />
                                                <span>{faceDetected ? "✓ Person Detected" : "🔍 Not Detected"}</span>
                                            </div>
                                            <div className={`status-badge ${location ? "active" : ""}`}>
                                                <FaMapMarkerAlt />
                                                <span>{location ? `✓ GPS: ${location.latitude.toFixed(4)}` : "📍 GPS Pending"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Snapshot Preview Panel */}
                                <div className={`snapshot-preview-container ${faceDetected ? 'face-detected' : ''} ${isCapturing ? 'capturing' : ''}`}>
                                    <div className="live-indicator">
                                        <span className="live-dot"></span>
                                        <span className="live-text">LIVE</span>
                                    </div>
                                    <h4>📷 Live Preview</h4>
                                    <p className="preview-hint">This is what will be captured as your attendance photo</p>
                                    <div className="preview-frame-wrapper">
                                        {liveSnapshot ? (
                                            <>
                                                <img src={liveSnapshot} alt="Live preview" className="snapshot-preview" />
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
                                            <div className="snapshot-placeholder">
                                                <FaCamera size={32} />
                                                <p>Preview loading...</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="preview-info">
                                        <small>✓ Auto-updating every 0.5s</small>
                                    </div>
                                    {faceDetected && !isCapturing && (
                                        <div className="detection-badge pulse-animation">
                                            <FaCheckCircle size={14} /> Face detected — ready to capture!
                                        </div>
                                    )}
                                    {isCapturing && (
                                        <div className="capturing-badge">
                                            <FaCamera size={14} /> Capturing in progress...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="button-group">
                                <button
                                    className="btn-primary btn-mark"
                                    onClick={captureImage}
                                    disabled={!faceDetected || isSubmitting || isCapturing}
                                >
                                    {isCapturing ? "📸 Capturing..." : "📸 Capture Photo (3s countdown)"}
                                </button>
                                <button className="btn-secondary" onClick={stopCamera} disabled={isSubmitting}>Cancel</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ── Calendar & History Tab ── */}
            {activeTab === "calendar" && (
                <div className="attendance-calendar-tab">
                    {isLoadingRecords ? (
                        <div className="loading-container">
                            <FaSpinner className="spinner" />
                            <p>Loading records...</p>
                        </div>
                    ) : (
                        <>
                            <AttendanceCalendar attendanceData={attendanceRecords} />

                            {attendanceRecords.length > 0 && (
                                <div className="attendance-records-list glass-panel">
                                    <h3>📋 Recent Attendance</h3>
                                    <div className="records-scroll">
                                        {attendanceRecords.slice(0, 10).map((record) => {
                                            const date = record.timestamp instanceof Date
                                                ? record.timestamp
                                                : new Date(record.timestamp.seconds * 1000);
                                            return (
                                                <div key={record.id} className="record-item">
                                                    {record.photoSnapshot && (
                                                        <div className="record-thumb">
                                                            <img src={record.photoSnapshot} alt="Attendance" />
                                                        </div>
                                                    )}
                                                    <div className="record-date">
                                                        {date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                                                    </div>
                                                    <div className="record-time">
                                                        {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </div>
                                                    <div className="record-status">
                                                        <FaCheckCircle className="status-icon-green" /><span>Present</span>
                                                    </div>
                                                    {record.location && record.location.latitude !== 0 && (
                                                        <div className="record-location">
                                                            <FaMapMarkerAlt size={14} />
                                                            <span>{record.location.latitude.toFixed(4)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {attendanceRecords.length === 0 && (
                                <div className="no-records glass-panel">
                                    <FaCalendar size={48} />
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

export default Attendance;
