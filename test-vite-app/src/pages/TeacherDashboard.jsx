/**
 * Teacher Dashboard Component
 * Main dashboard for teachers to manage classes, view analytics, and communicate with students
 */

import { useAuth } from "../context/AuthContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import { FaChartPie, FaUsers, FaFileExcel, FaComments, FaSignOutAlt } from "react-icons/fa";
import Analytics from "./teacher/Analytics";
import ExportData from "./teacher/ExportData";
import Chat from "./student/Chat"; // Reuse chat component
import "./TeacherDashboard.css";

/**
 * TeacherDashboard Component
 * Provides navigation and routing for teacher features
 */
function TeacherDashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const menuItems = [
        { id: "analytics", name: "Class Analytics", icon: FaChartPie, path: "/teacher-dashboard/analytics" },
        { id: "students", name: "Student Management", icon: FaUsers, path: "/teacher-dashboard/students" },
        { id: "export", name: "Export Data", icon: FaFileExcel, path: "/teacher-dashboard/export" },
        { id: "chat", name: "Student Chat", icon: FaComments, path: "/teacher-dashboard/chat" }
    ];

    return (
        <div className="dashboard-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h2>Teacher Portal</h2>
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
                                <h1>Welcome, {currentUser?.displayName?.split(" ")[0]}! 📚</h1>
                                <p>Manage your classes, track performance, and mentor students</p>
                            </div>

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
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/students" element={<div className="coming-soon glass-panel" style={{ padding: '4rem', textAlign: 'center', margin: '2rem' }}><h2>Student Management Coming Soon</h2></div>} />
                    <Route path="/export" element={<ExportData />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </main>
        </div>
    );
}

export default TeacherDashboard;
