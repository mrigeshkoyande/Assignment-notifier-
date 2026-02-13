/**
 * Student Dashboard Component
 * Main dashboard for students to access attendance, assignments, and chat
 */

import { useAuth } from "../context/AuthContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import { FaCalendarCheck, FaComments, FaFileAlt, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import useAttendance from "../hooks/useAttendance";
import Attendance from "./student/Attendance";
import Assignments from "./student/Assignments";
import Chat from "./student/Chat";
import "./StudentDashboard.css";

/**
 * StudentDashboard Component
 * Provides navigation and routing for student features
 */
function StudentDashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { stats, isLoading: attendanceLoading } = useAttendance(currentUser?.uid);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const menuItems = [
        { id: "attendance", name: "Mark Attendance", icon: FaCalendarCheck, path: "/student-dashboard/attendance" },
        { id: "assignments", name: "Assignments", icon: FaFileAlt, path: "/student-dashboard/assignments" },
        { id: "chat", name: "Mentor Chat", icon: FaComments, path: "/student-dashboard/chat" }
    ];

    return (
        <div className="dashboard-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h2>Student Portal</h2>
                    <p>{currentUser?.displayName}</p>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className="nav-item"
                                onClick={() => navigate(item.path)}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <button className="btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="dashboard-main">
                <Routes>
                    <Route path="/" element={
                        <>
                            <div className="welcome-section glass-panel">
                                <h1>Welcome back, {currentUser?.displayName?.split(" ")[0]}! 👋</h1>
                                <p>Your learning hub for assignments, attendance, and mentorship</p>
                            </div>

                            {/* Attendance Statistics Card */}
                            {!attendanceLoading && (
                                <div className="stats-container">
                                    <div className="stat-card glass-panel attendance-stat">
                                        <div className="stat-icon">
                                            <FaChartLine size={32} />
                                        </div>
                                        <div className="stat-content">
                                            <h3>Attendance Overview</h3>
                                            <div className="stat-values">
                                                <div className="stat-value">
                                                    <span className="value">{stats.totalDaysMarked}</span>
                                                    <span className="label">Days Present</span>
                                                </div>
                                                <div className="stat-value">
                                                    <span className="value">{stats.attendancePercentage}%</span>
                                                    <span className="label">Attendance</span>
                                                </div>
                                            </div>
                                            <button 
                                                className="btn-view-details"
                                                onClick={() => navigate("/student-dashboard/attendance")}
                                            >
                                                View Calendar →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="dashboard-grid">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            className="dashboard-card glass-panel"
                                            onClick={() => navigate(item.path)}
                                        >
                                            <Icon className="card-icon" size={48} />
                                            <h3>{item.name}</h3>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    } />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </main>
        </div>
    );
}

export default StudentDashboard;
