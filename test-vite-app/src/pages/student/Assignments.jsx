import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaBook, FaCalendar, FaClock, FaCloudDownloadAlt } from "react-icons/fa";
import "./Assignments.css";

function Assignments() {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

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
            </div>

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

export default Assignments;
