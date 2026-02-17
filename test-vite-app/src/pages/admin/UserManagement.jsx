/**
 * User Management Component
 * Allows admins to view and filter all users in the system
 */

import { useState, useEffect } from "react";
import { db } from "../../services/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaUserPlus } from "react-icons/fa";
import "./UserManagement.css";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, student, teacher
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        // Filter out deleted users by default
        if (user.accountStatus === "deleted") return false;

        const matchesFilter = filter === "all" || user.role === filter;
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: "#22c55e",
            paused: "#eab308",
            deleted: "#ef4444"
        };
        return status || "active";
    };

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <div>
                    <h1>User Management</h1>
                    <p>View and manage all students, teachers, and administrators</p>
                </div>
                <button
                    className="btn-add-user"
                    onClick={() => navigate("/admin-dashboard/add-user")}
                >
                    <FaUserPlus /> Add New User
                </button>
            </div>

            <div className="glass-panel filters-bar">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === "student" ? "active" : ""}`}
                    onClick={() => setFilter("student")}
                >
                    Students
                </button>
                <button
                    className={`filter-btn ${filter === "teacher" ? "active" : ""}`}
                    onClick={() => setFilter("teacher")}
                >
                    Teachers
                </button>
                <button
                    className={`filter-btn ${filter === "admin" ? "active" : ""}`}
                    onClick={() => setFilter("admin")}
                >
                    Admins
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading users...</div>
            ) : (
                <div className="users-list">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className="glass-panel user-card"
                                onClick={() => navigate(`/admin-dashboard/users/${user.id}`)}
                            >
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="user-details">
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                                <div className="user-meta">
                                    <div className={`user-role-badge role-${user.role}`}>
                                        {user.role}
                                    </div>
                                    {user.accountStatus && user.accountStatus !== "active" && (
                                        <span className={`status-indicator status-${user.accountStatus}`}>
                                            {user.accountStatus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            No users found matching your criteria
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserManagement;
