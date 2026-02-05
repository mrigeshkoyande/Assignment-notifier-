/**
 * Role Selection Component
 * Allows new users to choose their role (Student, Teacher, or Admin)
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";
import "./RoleSelect.css";

/**
 * RoleSelect Component
 * Displays role options and handles role assignment
 */
function RoleSelect() {
    const { currentUser, assignRole } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    const roles = [
        {
            id: "student",
            name: "Student",
            icon: FaUserGraduate,
            description: "Access assignments, attendance, and mentor chat"
        },
        {
            id: "teacher",
            name: "Teacher",
            icon: FaChalkboardTeacher,
            description: "Manage classes, view analytics, and mentor students"
        },
        {
            id: "admin",
            name: "Admin",
            icon: FaUserShield,
            description: "Oversee the entire system and manage users"
        }
    ];

    const handleRoleSelect = async () => {
        if (!selectedRole) {
            alert("Please select a role");
            return;
        }

        try {
            await assignRole(
                currentUser.uid,
                selectedRole,
                currentUser.displayName,
                currentUser.email
            );
            navigate(`/${selectedRole}-dashboard`);
        } catch (error) {
            console.error("Role assignment error:", error);
            alert("Failed to assign role. Please try again.");
        }
    };

    return (
        <div className="role-select-container">
            <div className="role-select-card glass-panel">
                <h1 className="role-title">Select Your Role</h1>
                <p className="role-subtitle">Choose how you'll use the platform</p>

                <div className="roles-grid">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <div
                                key={role.id}
                                className={`role-option ${selectedRole === role.id ? "selected" : ""}`}
                                onClick={() => setSelectedRole(role.id)}
                            >
                                <Icon className="role-icon" size={48} />
                                <h3>{role.name}</h3>
                                <p>{role.description}</p>
                            </div>
                        );
                    })}
                </div>

                <button
                    className="btn-primary btn-continue"
                    onClick={handleRoleSelect}
                    disabled={!selectedRole}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default RoleSelect;
