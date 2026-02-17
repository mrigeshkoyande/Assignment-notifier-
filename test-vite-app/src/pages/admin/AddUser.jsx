/**
 * Add User Component
 * Allows administrators to create new user accounts (students, teachers, or admins)
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { FaUser, FaEnvelope, FaUserTag, FaKey, FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

function AddUser() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "student"
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [generatedPassword, setGeneratedPassword] = useState("");

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Validate inputs
            if (!formData.name.trim() || !formData.email.trim()) {
                setMessage({ type: "error", text: "Please fill in all required fields" });
                setLoading(false);
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setMessage({ type: "error", text: "Please enter a valid email address" });
                setLoading(false);
                return;
            }

            // Generate password
            const password = generatePassword();
            setGeneratedPassword(password);

            // Create user ID (using email as base)
            const userId = formData.email.split("@")[0] + "_" + Date.now();

            // Save user to Firestore with metadata
            await setDoc(doc(db, "users", userId), {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                accountStatus: "active",
                createdAt: new Date(),
                createdBy: currentUser.uid,
                tempPassword: password, // Store temporarily for admin to share
                passwordChanged: false
            });

            setMessage({
                type: "success",
                text: `User created successfully! Temporary password: ${password}`
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                role: "student"
            });

        } catch (error) {
            console.error("Error creating user:", error);
            setMessage({ type: "error", text: "Failed to create user. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const copyPassword = () => {
        if (generatedPassword) {
            navigator.clipboard.writeText(generatedPassword);
            setMessage({ type: "success", text: "Password copied to clipboard!" });
        }
    };

    return (
        <div className="add-user-container">
            <div className="add-user-header">
                <button className="btn-back" onClick={() => navigate("/admin-dashboard/users")}>
                    <FaArrowLeft /> Back to Users
                </button>
                <h1>Add New User</h1>
                <p>Create a new student, teacher, or administrator account</p>
            </div>

            {message.text && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                    {generatedPassword && message.type === "success" && (
                        <button className="btn-copy-password" onClick={copyPassword}>
                            <FaKey /> Copy Password
                        </button>
                    )}
                </div>
            )}

            <div className="glass-panel add-user-form-section">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">
                            <FaUser /> Full Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope /> Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="user@example.com"
                            required
                        />
                        <span className="field-hint">User will use this email to log in</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            <FaUserTag /> User Role *
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Administrator</option>
                        </select>
                        <span className="field-hint">
                            {formData.role === "student" && "Students can access assignments, attendance, and chat"}
                            {formData.role === "teacher" && "Teachers can manage classes, view analytics, and export data"}
                            {formData.role === "admin" && "Administrators have full system access"}
                        </span>
                    </div>

                    <div className="info-box">
                        <FaKey className="info-icon" />
                        <div>
                            <h4>Password Generation</h4>
                            <p>A temporary password will be automatically generated for this user. Make sure to share it securely.</p>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/admin-dashboard/users")}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-create-user"
                            disabled={loading}
                        >
                            <FaUserPlus /> {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-panel info-section">
                <h3>Important Notes</h3>
                <ul>
                    <li>The new user will receive a temporary password that must be changed on first login</li>
                    <li>Make sure to securely communicate the credentials to the new user</li>
                    <li>Users can update their profile information after logging in</li>
                    <li>You can manage user status (pause/delete) from the User Management page</li>
                </ul>
            </div>
        </div>
    );
}

export default AddUser;
