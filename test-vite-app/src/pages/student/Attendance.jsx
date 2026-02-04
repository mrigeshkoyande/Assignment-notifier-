import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import * as faceapi from "face-api.js";
import { FaCamera, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
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

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
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
    };

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

    const detectFace = async () => {
        if (!modelsLoaded) return;

        const interval = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
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
            }
        }, 100);

        return () => clearInterval(interval);
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

            // Stop webcam
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            setIsWebcamActive(false);

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
        </div>
    );
}

export default Attendance;
