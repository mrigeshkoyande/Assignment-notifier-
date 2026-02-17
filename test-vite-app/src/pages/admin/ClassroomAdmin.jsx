/**
 * Classroom Admin Component
 * Allows admins to manage ALL classrooms in the system
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where
} from "firebase/firestore";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaBook, FaTimes, FaSearch, FaChartBar } from "react-icons/fa";
import "./ClassroomAdmin.css";

/**
 * ClassroomAdmin Component
 * Admins have full control over all classrooms
 */
function ClassroomAdmin() {
    const { currentUser } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        subjectName: "",
        subjectCode: "",
        teacherId: "",
        teacherName: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all classrooms
            const classroomsSnapshot = await getDocs(collection(db, "classrooms"));
            const classroomList = classroomsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClassrooms(classroomList);

            // Fetch all teachers
            const teachersQuery = query(collection(db, "users"), where("role", "==", "teacher"));
            const teachersSnapshot = await getDocs(teachersQuery);
            const teacherList = teachersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTeachers(teacherList);

            // Fetch all students
            const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
            const studentsSnapshot = await getDocs(studentsQuery);
            const studentList = studentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudents(studentList);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
        try {
            await addDoc(collection(db, "classrooms"), {
                subjectName: formData.subjectName,
                subjectCode: formData.subjectCode,
                teacherId: formData.teacherId,
                teacherName: selectedTeacher?.name || "Unknown",
                enrolledStudents: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setFormData({ subjectName: "", subjectCode: "", teacherId: "", teacherName: "" });
            setShowCreateModal(false);
            fetchData();
        } catch (error) {
            console.error("Error creating classroom:", error);
            alert("Failed to create classroom. Please try again.");
        }
    };

    const handleEditClassroom = async (e) => {
        e.preventDefault();
        const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
        try {
            const classroomRef = doc(db, "classrooms", editingClassroom.id);
            await updateDoc(classroomRef, {
                subjectName: formData.subjectName,
                subjectCode: formData.subjectCode,
                teacherId: formData.teacherId,
                teacherName: selectedTeacher?.name || editingClassroom.teacherName,
                updatedAt: serverTimestamp()
            });
            setFormData({ subjectName: "", subjectCode: "", teacherId: "", teacherName: "" });
            setShowEditModal(false);
            setEditingClassroom(null);
            fetchData();
        } catch (error) {
            console.error("Error updating classroom:", error);
            alert("Failed to update classroom. Please try again.");
        }
    };

    const handleDeleteClassroom = async (classroomId, classroomName) => {
        if (!window.confirm(`Are you sure you want to delete "${classroomName}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await deleteDoc(doc(db, "classrooms", classroomId));
            fetchData();
        } catch (error) {
            console.error("Error deleting classroom:", error);
            alert("Failed to delete classroom. Please try again.");
        }
    };

    const openCreateModal = () => {
        setFormData({ subjectName: "", subjectCode: "", teacherId: "", teacherName: "" });
        setShowCreateModal(true);
    };

    const openEditModal = (classroom) => {
        setEditingClassroom(classroom);
        setFormData({
            subjectName: classroom.subjectName,
            subjectCode: classroom.subjectCode,
            teacherId: classroom.teacherId,
            teacherName: classroom.teacherName
        });
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingClassroom(null);
        setFormData({ subjectName: "", subjectCode: "", teacherId: "", teacherName: "" });
    };

    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStudents = classrooms.reduce((sum, classroom) =>
        sum + (classroom.enrolledStudents?.length || 0), 0
    );

    if (loading) {
        return (
            <div className="classroom-admin-container">
                <div className="loading">Loading classroom data...</div>
            </div>
        );
    }

    return (
        <div className="classroom-admin-container">
            <div className="admin-header">
                <div>
                    <h1>Classroom Administration</h1>
                    <p>Manage all classrooms across the system</p>
                </div>
                <button className="btn-create" onClick={openCreateModal}>
                    <FaPlus /> Create Classroom
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="analytics-grid">
                <div className="analytics-card glass-panel">
                    <FaBook className="analytics-icon" />
                    <div className="analytics-info">
                        <h3>{classrooms.length}</h3>
                        <p>Total Classrooms</p>
                    </div>
                </div>
                <div className="analytics-card glass-panel">
                    <FaUsers className="analytics-icon" />
                    <div className="analytics-info">
                        <h3>{totalStudents}</h3>
                        <p>Enrolled Students</p>
                    </div>
                </div>
                <div className="analytics-card glass-panel">
                    <FaChartBar className="analytics-icon" />
                    <div className="analytics-info">
                        <h3>{teachers.length}</h3>
                        <p>Active Teachers</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar glass-panel">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search classrooms by subject, code, or teacher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Classrooms Grid */}
            {filteredClassrooms.length > 0 ? (
                <div className="classrooms-grid">
                    {filteredClassrooms.map((classroom) => (
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
                                        onClick={() => handleDeleteClassroom(classroom.id, classroom.subjectName)}
                                        title="Delete Classroom"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <h3>{classroom.subjectName}</h3>
                            <p className="subject-code">{classroom.subjectCode}</p>
                            <p className="teacher-name">Teacher: {classroom.teacherName}</p>
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
                    <h2>{searchTerm ? "No Matching Classrooms" : "No Classrooms Yet"}</h2>
                    <p>{searchTerm ? "Try a different search term" : "Create your first classroom to get started"}</p>
                    {!searchTerm && (
                        <button className="btn-primary" onClick={openCreateModal}>
                            <FaPlus /> Create Classroom
                        </button>
                    )}
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
                            <div className="form-group">
                                <label htmlFor="teacherId">Assign Teacher</label>
                                <select
                                    id="teacherId"
                                    value={formData.teacherId}
                                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a teacher</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name} ({teacher.email})
                                        </option>
                                    ))}
                                </select>
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
                            <div className="form-group">
                                <label htmlFor="editTeacherId">Assign Teacher</label>
                                <select
                                    id="editTeacherId"
                                    value={formData.teacherId}
                                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a teacher</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name} ({teacher.email})
                                        </option>
                                    ))}
                                </select>
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

export default ClassroomAdmin;
