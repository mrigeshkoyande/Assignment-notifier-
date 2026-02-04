import { useAuth } from "../context/AuthContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import { FaCalendarCheck, FaComments, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import Attendance from "./student/Attendance";
import Assignments from "./student/Assignments";
import Chat from "./student/Chat";
import "./StudentDashboard.css";

function StudentDashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

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
