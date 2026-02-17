/**
 * My Classrooms Component for Students
 * Allows students to view and join classrooms
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    query,
    where
} from "firebase/firestore";
import { FaBook, FaUsers, FaSignInAlt, FaCheckCircle } from "react-icons/fa";
import "./MyClassrooms.css";

/**
 * MyClassrooms Component
 * Students can view all available classrooms and join them
 */
function MyClassrooms() {
    const { currentUser } = useAuth();
    const [allClassrooms, setAllClassrooms] = useState([]);
    const [enrolledClassrooms, setEnrolledClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("available"); // available or enrolled

    useEffect(() => {
        fetchClassrooms();
    }, [currentUser]);

    const fetchClassrooms = async () => {
        try {
            const classroomsRef = collection(db, "classrooms");
            const querySnapshot = await getDocs(classroomsRef);
            const classroomList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Separate enrolled and available classrooms
            const enrolled = classroomList.filter(classroom =>
                classroom.enrolledStudents?.includes(currentUser.uid)
            );
            const available = classroomList.filter(classroom =>
                !classroom.enrolledStudents?.includes(currentUser.uid)
            );

            setEnrolledClassrooms(enrolled);
            setAllClassrooms(available);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClassroom = async (classroomId) => {
        try {
            const classroomRef = doc(db, "classrooms", classroomId);
            await updateDoc(classroomRef, {
                enrolledStudents: arrayUnion(currentUser.uid)
            });
            fetchClassrooms(); // Refresh the list
        } catch (error) {
            console.error("Error joining classroom:", error);
            alert("Failed to join classroom. Please try again.");
        }
    };

    const renderClassroomCard = (classroom, isEnrolled) => (
        <div key={classroom.id} className="classroom-card glass-panel">
            <div className="classroom-card-header">
                <div className="subject-icon">
                    <FaBook size={32} />
                </div>
                {isEnrolled && (
                    <div className="enrolled-badge">
                        <FaCheckCircle /> Enrolled
                    </div>
                )}
            </div>
            <h3>{classroom.subjectName}</h3>
            <p className="subject-code">{classroom.subjectCode}</p>
            <p className="teacher-name">Teacher: {classroom.teacherName}</p>
            <div className="classroom-meta">
                <div className="meta-item">
                    <FaUsers />
                    <span>{classroom.enrolledStudents?.length || 0} Students</span>
                </div>
            </div>
            {!isEnrolled && (
                <button
                    className="btn-join"
                    onClick={() => handleJoinClassroom(classroom.id)}
                >
                    <FaSignInAlt /> Join Classroom
                </button>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="my-classrooms-container">
                <div className="loading">Loading classrooms...</div>
            </div>
        );
    }

    return (
        <div className="my-classrooms-container">
            <div className="classrooms-header">
                <h1>My Classrooms</h1>
                <p>View and join your subject classrooms</p>
            </div>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === "enrolled" ? "active" : ""}`}
                    onClick={() => setActiveTab("enrolled")}
                >
                    Enrolled Classrooms ({enrolledClassrooms.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === "available" ? "active" : ""}`}
                    onClick={() => setActiveTab("available")}
                >
                    Available Classrooms ({allClassrooms.length})
                </button>
            </div>

            {activeTab === "enrolled" && (
                <>
                    {enrolledClassrooms.length > 0 ? (
                        <div className="classrooms-grid">
                            {enrolledClassrooms.map((classroom) =>
                                renderClassroomCard(classroom, true)
                            )}
                        </div>
                    ) : (
                        <div className="empty-state glass-panel">
                            <FaBook size={64} className="empty-icon" />
                            <h2>No Enrolled Classrooms</h2>
                            <p>Join a classroom to get started</p>
                            <button
                                className="btn-primary"
                                onClick={() => setActiveTab("available")}
                            >
                                Browse Available Classrooms
                            </button>
                        </div>
                    )}
                </>
            )}

            {activeTab === "available" && (
                <>
                    {allClassrooms.length > 0 ? (
                        <div className="classrooms-grid">
                            {allClassrooms.map((classroom) =>
                                renderClassroomCard(classroom, false)
                            )}
                        </div>
                    ) : (
                        <div className="empty-state glass-panel">
                            <FaCheckCircle size={64} className="empty-icon" />
                            <h2>All Caught Up!</h2>
                            <p>You've joined all available classrooms</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MyClassrooms;
