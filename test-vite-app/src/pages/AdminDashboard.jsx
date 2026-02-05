/**
 * Admin Dashboard Component
 * Main dashboard for administrators to manage the entire system
 */

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsersCog, FaChartLine, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./AdminDashboard.css";

/**
 * AdminDashboard Component
 * Provides administrative controls and system overview
 */
function AdminDashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const menuItems = [
        { id: "users", name: "User Management", icon: FaUsersCog, path: "/admin-dashboard/users" },
        { id: "overview", name: "System Overview", icon: FaChartLine, path: "/admin-dashboard/overview" },
        { id: "settings", name: "Settings", icon: FaCog, path: "/admin-dashboard/settings" }
    ];

    return (
        <div className="dashboard-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h2>Admin Portal</h2>
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
                <div className="welcome-section glass-panel">
                    <h1>Welcome, {currentUser?.displayName?.split(" ")[0]}! 🛡️</h1>
                    <p>Oversee the entire system and manage users</p>
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
            </main>
        </div>
    );
}

export default AdminDashboard;
