/**
 * Attendance Component
 * Allows students to mark attendance using face detection and GPS verification
 * Includes calendar view of attendance history
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import * as faceapi from "face-api.js";
import { FaCamera, FaMapMarkerAlt, FaCheckCircle, FaCalendar } from "react-icons/fa";
import AttendanceCalendar from "../../components/AttendanceCalendar";
import "./Attendance.css";

/**
 * Attendance Component
 * Implements biometric verification for attendance marking with calendar view
 */
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
    const [activeTab, setActiveTab] = useState("mark"); // "mark" or "calendar"
    const [faceDetectionInterval, setFaceDetectionInterval] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);

    const loadModels = useCallback(async () => {
        try {
            const MODEL_URL = "/models";
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            setModelsLoaded(true);
        } catch (error) {
            console.error("Error loading face detection models:", error);
            alert("Face detection models not found. Please ensure models are in /public/models directory.");
        }
    }, []);

    const fetchAttendanceRecords = useCallback(async () => {
        try {
            setIsLoadingRecords(true);
            const q = query(
                collection(db, "attendance"),
                where("userId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const records = [];
            
            querySnapshot.forEach((doc) => {
                records.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Sort by timestamp in descending order
            records.sort((a, b) => {
                const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp.seconds * 1000);
                const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp.seconds * 1000);
                return timeB - timeA;
            });
            
            setAttendanceRecords(records);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        } finally {
            setIsLoadingRecords(false);
        }
    }, [currentUser.uid]);

    useEffect(() => {
        loadModels();
        fetchAttendanceRecords();

        // Cleanup function for when component unmounts
        return () => {
            // Stop webcam if active
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            // Clear face detection interval
            if (faceDetectionInterval) {
                clearInterval(faceDetectionInterval);
            }
        };
    }, [loadModels, fetchAttendanceRecords, mediaStream, faceDetectionInterval]);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsWebcamActive(true);
                detectFace();
            }
        } catch (error) {
            console.error("Webcam error:", error);
            alert("Unable to access webcam. Please grant camera permissions.");
        }
    };

    const detectFace = () => {
        if (!modelsLoaded) return;

        const interval = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                try {
                    const detections = await faceapi
                        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks();

                    if (detections.length > 0) {
                        setFaceDetected(true);

                        // Draw detection box
                        const displaySize = {
                            width: videoRef.current.videoWidth,
                            height: videoRef.current.videoHeight
                        };
                        faceapi.matchDimensions(canvasRef.current, displaySize);
                        const resizedDetections = faceapi.resizeResults(detections, displaySize);

                        const ctx = canvasRef.current.getContext("2d");
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    } else {
                        setFaceDetected(false);
                    }
                } catch (error) {
                    console.error("Face detection error:", error);
                }
            }
        }, 100);

        setFaceDetectionInterval(interval);
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported");
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setLocation(loc);
                    resolve(loc);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };

    const markAttendance = async () => {
        if (!faceDetected) {
            alert("Please ensure your face is visible to the camera");
            return;
        }

        setIsSubmitting(true);

        try {
            const loc = await getLocation();

            await addDoc(collection(db, "attendance"), {
                userId: currentUser.uid,
                userName: currentUser.displayName,
                email: currentUser.email,
                timestamp: new Date(),
                location: loc,
                verified: true
            });

            setAttendanceMarked(true);

            // Stop webcam and clear face detection
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            }
            if (faceDetectionInterval) {
                clearInterval(faceDetectionInterval);
                setFaceDetectionInterval(null);
            }
            setIsWebcamActive(false);
            setFaceDetected(false);

            // Refresh attendance records
            await fetchAttendanceRecords();

            setTimeout(() => {
                setAttendanceMarked(false);
            }, 3000);
        } catch (error) {
            console.error("Attendance marking error:", error);
            alert("Failed to mark attendance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h1>Mark Attendance</h1>
                <p>Use face verification and GPS to mark your attendance</p>
            </div>

            {/* Tab Navigation */}
            <div className="attendance-tabs">
                <button
                    className={`tab-btn ${activeTab === "mark" ? "active" : ""}`}
                    onClick={() => setActiveTab("mark")}
                >
                    <FaCamera size={18} />
                    <span>Mark Attendance</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
                    onClick={() => setActiveTab("calendar")}
                >
                    <FaCalendar size={18} />
                    <span>Attendance History</span>
                </button>
            </div>

            {/* Mark Attendance Tab */}
            {activeTab === "mark" && (
                <>
                    {!isWebcamActive ? (
                        <div className="attendance-start glass-panel">
                            <FaCamera size={64} className="camera-icon" />
                            <h2>Ready to Mark Attendance?</h2>
                            <p>We'll verify your identity using face detection and GPS location</p>
                            <button
                                className="btn-primary btn-start"
                                onClick={startWebcam}
                                disabled={!modelsLoaded}
                            >
                                {modelsLoaded ? "Start Verification" : "Loading Models..."}
                            </button>
                        </div>
                    ) : (
                        <div className="attendance-verify glass-panel">
                            <div className="video-container">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className="webcam-feed"
                                    onLoadedMetadata={detectFace}
                                />
                                <canvas ref={canvasRef} className="face-overlay" />

                                <div className="status-indicators">
                                    <div className={`status-badge ${faceDetected ? "active" : ""}`}>
                                        <FaCheckCircle />
                                        <span>Face {faceDetected ? "Detected" : "Not Detected"}</span>
                                    </div>
                                    <div className={`status-badge ${location ? "active" : ""}`}>
                                        <FaMapMarkerAlt />
                                        <span>GPS {location ? "Acquired" : "Pending"}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn-primary btn-mark"
                                onClick={markAttendance}
                                disabled={!faceDetected || isSubmitting}
                            >
                                {isSubmitting ? "Marking..." : "Mark Attendance"}
                            </button>

                            {attendanceMarked && (
                                <div className="success-message">
                                    <FaCheckCircle size={32} />
                                    <p>Attendance marked successfully!</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Calendar Tab */}
            {activeTab === "calendar" && (
                <div className="attendance-calendar-tab">
                    {isLoadingRecords ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading attendance records...</p>
                        </div>
                    ) : (
                        <>
                            <AttendanceCalendar attendanceData={attendanceRecords} />
                            
                            {attendanceRecords.length > 0 && (
                                <div className="attendance-records-list glass-panel">
                                    <h3>Recent Attendance Records</h3>
                                    <div className="records-scroll">
                                        {attendanceRecords.slice(0, 10).map((record) => {
                                            const date = record.timestamp instanceof Date
                                                ? record.timestamp
                                                : new Date(record.timestamp.seconds * 1000);
                                            
                                            return (
                                                <div key={record.id} className="record-item">
                                                    <div className="record-date">
                                                        {date.toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="record-time">
                                                        {date.toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </div>
                                                    <div className="record-status">
                                                        <FaCheckCircle className="status-icon-green" />
                                                        <span>Marked</span>
                                                    </div>
                                                    {record.location && (
                                                        <div className="record-location">
                                                            <FaMapMarkerAlt size={14} />
                                                            <span>{record.location.latitude.toFixed(4)}, {record.location.longitude.toFixed(4)}</span>
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
                                    <small>Mark your first attendance to see it here</small>
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
