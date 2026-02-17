/**
 * User Details Component
 * Displays detailed information about a specific user with admin controls
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/firebase.config";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FaArrowLeft, FaEnvelope, FaUserTag, FaCalendarCheck, FaMapMarkerAlt, FaCheckCircle, FaPause, FaPlay, FaTrash, FaPhone, FaUser, FaTimes } from "react-icons/fa";
import Analytics from "../teacher/Analytics";
import Assignments from "../student/Assignments";
import "./UserDetails.css";

function UserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            // Fetch User Profile
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = { id: userId, ...userDoc.data() };
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
                where("userId", "==", uid)
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

    const handleTogglePause = async () => {
        setActionLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const newStatus = user.accountStatus === "paused" ? "active" : "paused";
            const userRef = doc(db, "users", userId);

            await updateDoc(userRef, {
                accountStatus: newStatus,
                updatedAt: new Date()
            });

            setUser(prev => ({ ...prev, accountStatus: newStatus }));
            setMessage({
                type: "success",
                text: `Account ${newStatus === "paused" ? "paused" : "resumed"} successfully!`
            });
        } catch (error) {
            console.error("Error toggling account status:", error);
            setMessage({ type: "error", text: "Failed to update account status" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setActionLoading(true);

        try {
            const userRef = doc(db, "users", userId);

            // Soft delete - mark as deleted
            await updateDoc(userRef, {
                accountStatus: "deleted",
                deletedAt: new Date()
            });

            setMessage({ type: "success", text: "User deleted successfully. Redirecting..." });
            setTimeout(() => {
                navigate("/admin-dashboard/users");
            }, 2000);
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage({ type: "error", text: "Failed to delete user" });
            setActionLoading(false);
            setShowDeleteModal(false);
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

    const getStatusBadge = (status) => {
        const statusColors = {
            active: { bg: "rgba(34, 197, 94, 0.2)", border: "#22c55e", color: "#22c55e" },
            paused: { bg: "rgba(234, 179, 8, 0.2)", border: "#eab308", color: "#eab308" },
            deleted: { bg: "rgba(239, 68, 68, 0.2)", border: "#ef4444", color: "#ef4444" }
        };

        const style = statusColors[status] || statusColors.active;

        return (
            <span
                className="status-badge"
                style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    color: style.color
                }}
            >
                {status?.toUpperCase()}
            </span>
        );
    };

    if (loading) return <div className="loading">Loading user details...</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <div className="user-details-container">
            <button className="back-btn" onClick={() => navigate("/admin-dashboard/users")}>
                <FaArrowLeft /> Back to Users
            </button>

            {message.text && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="glass-panel profile-header">
                <div className="profile-left">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="profile-photo" />
                    ) : (
                        <div className="profile-avatar">
                            {getInitials(user.name)}
                        </div>
                    )}
                    <div className="profile-info">
                        <div className="profile-name-status">
                            <h1>{user.nickname || user.name}</h1>
                            {getStatusBadge(user.accountStatus || "active")}
                        </div>
                        <p><FaEnvelope /> {user.email}</p>
                        {user.mobileNo && <p><FaPhone /> {user.mobileNo}</p>}
                        <p><FaUserTag /> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                        {user.createdAt && (
                            <p className="created-date">
                                <FaCalendarCheck /> Joined {formatDate(user.createdAt)}
                            </p>
                        )}
                    </div>
                </div>

                {user.role !== "admin" && (
                    <div className="profile-actions">
                        <button
                            className={`btn-action ${user.accountStatus === "paused" ? "btn-resume" : "btn-pause"}`}
                            onClick={handleTogglePause}
                            disabled={actionLoading || user.accountStatus === "deleted"}
                        >
                            {user.accountStatus === "paused" ? (
                                <><FaPlay /> Resume Account</>
                            ) : (
                                <><FaPause /> Pause Account</>
                            )}
                        </button>
                        <button
                            className="btn-action btn-delete"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={actionLoading || user.accountStatus === "deleted"}
                        >
                            <FaTrash /> Delete User
                        </button>
                    </div>
                )}
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete User Account?</h2>
                        <p>Are you sure you want to delete <strong>{user.name}</strong>'s account?</p>
                        <p className="warning-text">
                            This will mark the account as deleted and the user will no longer be able to log in.
                            All their data will be preserved but inaccessible.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={actionLoading}
                            >
                                <FaTimes /> Cancel
                            </button>
                            <button
                                className="btn-confirm-delete"
                                onClick={handleDeleteUser}
                                disabled={actionLoading}
                            >
                                <FaTrash /> {actionLoading ? "Deleting..." : "Yes, Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDetails;
