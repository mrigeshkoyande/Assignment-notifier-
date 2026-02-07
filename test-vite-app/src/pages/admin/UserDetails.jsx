/**
 * User Details Component
 * Displays detailed information about a specific user (Student or Teacher)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/firebase.config";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { FaArrowLeft, FaEnvelope, FaUserTag, FaCalendarCheck, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import Analytics from "../teacher/Analytics";
import Assignments from "../student/Assignments"; // Reusing Assignments component
import "./UserDetails.css";

function UserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            // Fetch User Profile
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser(userData);

                // If user is a student, fetch attendance
                if (userData.role === "student") {
                    fetchAttendance(userId);
                }
            } else {
                console.error("User not found");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async (uid) => {
        try {
            const q = query(
                collection(db, "attendance"),
                where("userId", "==", uid),
                // orderBy("timestamp", "desc") // Requires index, doing client-side sort for now to avoid error
            );
            const querySnapshot = await getDocs(q);
            const attendanceList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Client-side sort
            attendanceList.sort((a, b) => b.timestamp - a.timestamp);

            setAttendance(attendanceList);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleString();
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    if (loading) return <div className="loading">Loading user details...</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <div className="user-details-container">
            <button className="back-btn" onClick={() => navigate("/admin-dashboard/users")}>
                <FaArrowLeft /> Back to Users
            </button>

            <div className="glass-panel profile-header">
                <div className="profile-avatar">
                    {getInitials(user.name)}
                </div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    <p><FaEnvelope /> {user.email}</p>
                    <p><FaUserTag /> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                </div>
            </div>

            {user.role === "student" && (
                <>
                    <div className="detail-section">
                        <h2>Attendance History</h2>
                        <div className="glass-panel">
                            {attendance.length > 0 ? (
                                <div className="attendance-list">
                                    {attendance.map(record => (
                                        <div key={record.id} className="attendance-item">
                                            <div>
                                                <div className="attendance-date">
                                                    <FaCalendarCheck />
                                                    {formatDate(record.timestamp)}
                                                </div>
                                                {record.location && (
                                                    <div className="attendance-location">
                                                        <FaMapMarkerAlt size={12} />
                                                        Lat: {record.location.latitude.toFixed(4)},
                                                        Lng: {record.location.longitude.toFixed(4)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="attendance-status">
                                                <FaCheckCircle /> Verified
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">No attendance records found</div>
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2>Assignments</h2>
                        {/* 
                            Reusing the Assignments component. 
                            Note: In a real app, we'd pass userId to filter assignments specifically for this user 
                            if assignments were user-specific (submissions). 
                            Currently Assignments.jsx lists ALL assignments (coursework), which is fine to view here.
                        */}
                        <Assignments />
                    </div>
                </>
            )}

            {user.role === "teacher" && (
                <div className="detail-section">
                    <h2>Class Analytics</h2>
                    <Analytics />
                </div>
            )}
        </div>
    );
}

export default UserDetails;
