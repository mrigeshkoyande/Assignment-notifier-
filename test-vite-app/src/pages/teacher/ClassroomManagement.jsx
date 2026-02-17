/**
 * Classroom Management Component for Teachers
 * Allows teachers to create and manage their own subject classrooms
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaBook, FaTimes } from "react-icons/fa";
import "./ClassroomManagement.css";

/**
 * ClassroomManagement Component
 * Teachers can create, view, edit, and delete their own classrooms
 */
function ClassroomManagement() {
    const { currentUser } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [formData, setFormData] = useState({
        subjectName: "",
        subjectCode: ""
    });

    useEffect(() => {
        fetchClassrooms();
    }, [currentUser]);

    const fetchClassrooms = async () => {
        try {
            const q = query(
                collection(db, "classrooms"),
                where("teacherId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const classroomList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClassrooms(classroomList);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "classrooms"), {
                subjectName: formData.subjectName,
                subjectCode: formData.subjectCode,
                teacherId: currentUser.uid,
                teacherName: currentUser.displayName,
                enrolledStudents: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setFormData({ subjectName: "", subjectCode: "" });
            setShowCreateModal(false);
            fetchClassrooms();
        } catch (error) {
            console.error("Error creating classroom:", error);
            alert("Failed to create classroom. Please try again.");
        }
    };

    const handleEditClassroom = async (e) => {
        e.preventDefault();
        try {
            const classroomRef = doc(db, "classrooms", editingClassroom.id);
            await updateDoc(classroomRef, {
                subjectName: formData.subjectName,
                subjectCode: formData.subjectCode,
                updatedAt: serverTimestamp()
            });
            setFormData({ subjectName: "", subjectCode: "" });
            setShowEditModal(false);
            setEditingClassroom(null);
            fetchClassrooms();
        } catch (error) {
            console.error("Error updating classroom:", error);
            alert("Failed to update classroom. Please try again.");
        }
    };

    const handleDeleteClassroom = async (classroomId) => {
        if (!window.confirm("Are you sure you want to delete this classroom? This action cannot be undone.")) {
            return;
        }
        try {
            await deleteDoc(doc(db, "classrooms", classroomId));
            fetchClassrooms();
        } catch (error) {
            console.error("Error deleting classroom:", error);
            alert("Failed to delete classroom. Please try again.");
        }
    };

    const openCreateModal = () => {
        setFormData({ subjectName: "", subjectCode: "" });
        setShowCreateModal(true);
    };

    const openEditModal = (classroom) => {
        setEditingClassroom(classroom);
        setFormData({
            subjectName: classroom.subjectName,
            subjectCode: classroom.subjectCode
        });
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingClassroom(null);
        setFormData({ subjectName: "", subjectCode: "" });
    };

    if (loading) {
        return (
            <div className="classroom-management-container">
                <div className="loading">Loading classrooms...</div>
            </div>
        );
    }

    return (
        <div className="classroom-management-container">
            <div className="classroom-header">
                <div>
                    <h1>My Classrooms</h1>
                    <p>Manage your subject classrooms</p>
                </div>
                <button className="btn-create" onClick={openCreateModal}>
                    <FaPlus /> Create Classroom
                </button>
            </div>

            {classrooms.length > 0 ? (
                <div className="classrooms-grid">
                    {classrooms.map((classroom) => (
                        <div key={classroom.id} className="classroom-card glass-panel">
                            <div className="classroom-card-header">
                                <div className="subject-icon">
                                    <FaBook size={32} />
                                </div>
                                <div className="classroom-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => openEditModal(classroom)}
                                        title="Edit Classroom"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="btn-icon btn-danger"
                                        onClick={() => handleDeleteClassroom(classroom.id)}
                                        title="Delete Classroom"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <h3>{classroom.subjectName}</h3>
                            <p className="subject-code">{classroom.subjectCode}</p>
                            <div className="classroom-meta">
                                <div className="meta-item">
                                    <FaUsers />
                                    <span>{classroom.enrolledStudents?.length || 0} Students</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-panel">
                    <FaBook size={64} className="empty-icon" />
                    <h2>No Classrooms Yet</h2>
                    <p>Create your first classroom to get started</p>
                    <button className="btn-primary" onClick={openCreateModal}>
                        <FaPlus /> Create Classroom
                    </button>
                </div>
            )}

            {/* Create Classroom Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Classroom</h2>
                            <button className="btn-close" onClick={closeModals}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClassroom} className="classroom-form">
                            <div className="form-group">
                                <label htmlFor="subjectName">Subject Name</label>
                                <input
                                    type="text"
                                    id="subjectName"
                                    value={formData.subjectName}
                                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                                    placeholder="e.g., Data Structures"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subjectCode">Subject Code</label>
                                <input
                                    type="text"
                                    id="subjectCode"
                                    value={formData.subjectCode}
                                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                                    placeholder="e.g., CS201"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModals}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Create Classroom
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Classroom Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Classroom</h2>
                            <button className="btn-close" onClick={closeModals}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleEditClassroom} className="classroom-form">
                            <div className="form-group">
                                <label htmlFor="editSubjectName">Subject Name</label>
                                <input
                                    type="text"
                                    id="editSubjectName"
                                    value={formData.subjectName}
                                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editSubjectCode">Subject Code</label>
                                <input
                                    type="text"
                                    id="editSubjectCode"
                                    value={formData.subjectCode}
                                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModals}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClassroomManagement;
