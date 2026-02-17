/**
 * Teacher Settings Component
 * Allows teachers to manage their profile and account settings
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../services/firebase.config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nickname: "",
        mobileNo: "",
        photoURL: ""
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (currentUser) {
            // Load existing user data
            setFormData({
                nickname: currentUser.displayName || "",
                mobileNo: currentUser.phoneNumber || "",
                photoURL: currentUser.photoURL || ""
            });
            setPhotoPreview(currentUser.photoURL || "");
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: "error", text: "Image size should be less than 5MB" });
                return;
            }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const uploadPhoto = async () => {
        if (!photoFile) return formData.photoURL;

        try {
            const photoRef = ref(storage, `profile-photos/${currentUser.uid}`);
            await uploadBytes(photoRef, photoFile);
            const photoURL = await getDownloadURL(photoRef);
            return photoURL;
        } catch (error) {
            console.error("Error uploading photo:", error);
            throw error;
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Validate mobile number (optional field)
            if (formData.mobileNo && !/^[\d\s\+\-\(\)]+$/.test(formData.mobileNo)) {
                setMessage({ type: "error", text: "Please enter a valid mobile number" });
                setLoading(false);
                return;
            }

            // Upload photo if changed
            let photoURL = formData.photoURL;
            if (photoFile) {
                photoURL = await uploadPhoto();
            }

            // Update Firestore
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                nickname: formData.nickname,
                mobileNo: formData.mobileNo,
                photoURL: photoURL,
                updatedAt: new Date()
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setPhotoFile(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            // Soft delete - mark account as deleted
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                accountStatus: "deleted",
                deletedAt: new Date()
            });

            // Logout and redirect
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            setMessage({ type: "error", text: "Failed to delete account. Please try again." });
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your profile and account preferences</p>
            </div>

            {message.text && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Profile Settings Section */}
            <div className="glass-panel settings-section">
                <h2>Profile Information</h2>

                <div className="profile-photo-section">
                    <div className="photo-preview">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" />
                        ) : (
                            <div className="photo-placeholder">
                                <FaUser size={48} />
                            </div>
                        )}
                    </div>
                    <div className="photo-upload">
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                        />
                        <label htmlFor="photo-upload" className="btn-upload">
                            <FaCamera /> Change Photo
                        </label>
                        <p className="upload-hint">JPG, PNG or GIF. Max 5MB</p>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="nickname">
                        <FaUser /> Nickname
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        placeholder="Enter your nickname"
                        maxLength={50}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        <FaEnvelope /> Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={currentUser?.email || ""}
                        disabled
                        className="read-only"
                    />
                    <span className="field-hint">Email cannot be changed</span>
                </div>

                <div className="form-group">
                    <label htmlFor="mobileNo">
                        <FaPhone /> Mobile Number
                    </label>
                    <input
                        type="tel"
                        id="mobileNo"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                <div className="form-actions">
                    <button
                        className="btn-save"
                        onClick={handleSaveChanges}
                        disabled={loading}
                    >
                        <FaSave /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Account Management Section */}
            <div className="glass-panel settings-section danger-zone">
                <h2>Account Management</h2>
                <p>Once you delete your account, there is no going back. Please be certain.</p>

                <button
                    className="btn-delete-account"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={loading}
                >
                    <FaTrash /> Delete My Account
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Account?</h2>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <p className="warning-text">All your data, class materials, and student records will be permanently removed.</p>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={loading}
                            >
                                <FaTimes /> Cancel
                            </button>
                            <button
                                className="btn-confirm-delete"
                                onClick={handleDeleteAccount}
                                disabled={loading}
                            >
                                <FaTrash /> {loading ? "Deleting..." : "Yes, Delete My Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
