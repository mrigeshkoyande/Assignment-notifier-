/**
 * Assignments Component
 * Displays and manages student assignments
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaBook, FaCalendar, FaClock, FaCloudDownloadAlt } from "react-icons/fa";
import "./Assignments.css";

/**
 * Assignments Component
 * Shows assignment list with details and download options
 */
export default Assignments;

function Assignments() {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraStatus, setCameraStatus] = useState("");

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            // In a real app, you'd filter by class/course
            const q = query(collection(db, "assignments"));
            const querySnapshot = await getDocs(q);

            const assignmentList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAssignments(assignmentList);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToDrive = (assignment) => {
        // This would integrate with Google Drive API
        // For now, we'll show a placeholder
        alert(`Save to Drive feature coming soon!\n\nAssignment: ${assignment.title}`);
    };

    const toggleCamera = () => {
        setCameraActive(!cameraActive);
        setCapturedImage(null);
        setCameraStatus("");
    };

    const captureImage = async () => {
        try {
            setCameraStatus("Capturing...");
            const response = await fetch('http://localhost:5000/capture');
            const data = await response.json();

            if (data.status === 'success') {
                setCameraStatus("Image captured successfully!");
                setCapturedImage(data.image_url);
            } else {
                setCameraStatus("Failed to capture: " + data.message);
            }
        } catch (error) {
            console.error("Error capturing image:", error);
            setCameraStatus("Error: Ensure Python backend is running");
        }
    };

    // Demo data if no assignments in Firestore
    const demoAssignments = [
        {
            id: "demo1",
            title: "Data Structures - Assignment 3",
            subject: "Computer Science",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            description: "Implement Binary Search Tree with insert, delete, and search operations",
            status: "pending"
        },
        {
            id: "demo2",
            title: "Calculus - Problem Set 5",
            subject: "Mathematics",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            description: "Solve integration problems from Chapter 7",
            status: "pending"
        },
        {
            id: "demo3",
            title: "Research Paper - AI Ethics",
            subject: "Philosophy",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            description: "Write a 2000-word essay on ethical implications of AI",
            status: "pending"
        }
    ];

    const displayAssignments = assignments.length > 0 ? assignments : demoAssignments;

    const formatDate = (date) => {
        if (date instanceof Date) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        return new Date(date?.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysRemaining = (dueDate) => {
        const date = dueDate instanceof Date ? dueDate : new Date(dueDate?.seconds * 1000);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="assignments-container">
                <div className="loading">Loading assignments...</div>
            </div>
        );
    }

    return (
        <div className="assignments-container">
            <div className="assignments-header">
                <h1>My Assignments</h1>
                <p>Track and manage your coursework</p>
                <button
                    className="btn-primary"
                    onClick={toggleCamera}
                    style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaClock /> {cameraActive ? "Close Scammer" : "Scan Assignment"}
                </button>
            </div>

            {cameraActive && (
                <div className="camera-section glass-panel" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h3>Scan Assignment</h3>

                    {capturedImage ? (
                        <div className="captured-preview">
                            <div className="image-container" style={{
                                width: '100%',
                                maxWidth: '640px',
                                margin: '1rem auto',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '2px solid #10b981'
                            }}>
                                <img
                                    src={capturedImage}
                                    alt="Captured Assignment"
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </div>
                            <div className="camera-controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        setCapturedImage(null);
                                        setCameraStatus("");
                                    }}
                                    style={{ backgroundColor: '#6b7280' }}
                                >
                                    Retake
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        alert("Image saved successfully!");
                                        toggleCamera();
                                    }}
                                >
                                    Save & Close
                                </button>
                            </div>
                            <p style={{ marginTop: '0.5rem', color: '#10b981' }}>Image captured successfully!</p>
                        </div>
                    ) : (
                        <>
                            <div className="camera-feed" style={{
                                width: '100%',
                                maxWidth: '640px',
                                height: '480px',
                                margin: '1rem auto',
                                backgroundColor: '#000',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="http://localhost:5000/video_feed"
                                    alt="Camera Feed"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    display: 'none',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexDirection: 'column'
                                }}>
                                    <p>Camera stream unavailable.</p>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Is the Python backend running?</p>
                                </div>
                            </div>

                            <div className="camera-controls">
                                <button
                                    className="btn-primary"
                                    onClick={captureImage}
                                    disabled={cameraStatus === "Capturing..."}
                                >
                                    {cameraStatus === "Capturing..." ? "Capturing..." : "Capture Image"}
                                </button>
                            </div>
                            {cameraStatus && <p style={{ marginTop: '1rem', color: cameraStatus.includes('Error') || cameraStatus.includes('Failed') ? '#ef4444' : '#10b981' }}>{cameraStatus}</p>}
                        </>
                    )}
                </div>
            )}

            <div className="assignments-grid">
                {displayAssignments.map((assignment) => {
                    const daysRemaining = getDaysRemaining(assignment.dueDate);
                    const isUrgent = daysRemaining <= 3;

                    return (
                        <div key={assignment.id} className={`assignment-card glass-panel ${isUrgent ? 'urgent' : ''}`}>
                            <div className="assignment-header">
                                <div className="subject-badge">
                                    <FaBook />
                                    <span>{assignment.subject}</span>
                                </div>
                                {isUrgent && <span className="urgent-badge">Urgent</span>}
                            </div>

                            <h3 className="assignment-title">{assignment.title}</h3>
                            <p className="assignment-description">{assignment.description}</p>

                            <div className="assignment-meta">
                                <div className="meta-item">
                                    <FaCalendar />
                                    <span>Due: {formatDate(assignment.dueDate)}</span>
                                </div>
                                <div className="meta-item">
                                    <FaClock />
                                    <span>{daysRemaining} days left</span>
                                </div>
                            </div>

                            <button
                                className="btn-drive"
                                onClick={() => handleSaveToDrive(assignment)}
                            >
                                <FaCloudDownloadAlt />
                                <span>Save to Drive</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {displayAssignments.length === 0 && (
                <div className="empty-state glass-panel">
                    <FaBook size={64} className="empty-icon" />
                    <h2>No Assignments Yet</h2>
                    <p>Check back later for new assignments</p>
                </div>
            )}
        </div>
    );
}
