/**
 * Timetable Management Component for Admin
 * Allows admin to create and manage lecture timetables for all classrooms
 */

import { useState, useEffect } from "react";
import { db } from "../../services/firebase.config";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "firebase/firestore";
import { FaClock, FaMapMarkerAlt, FaBook, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "./TimetableManagement.css";

function TimetableManagement() {
    const [timetables, setTimetables] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        classroomId: "",
        classroomName: "",
        subject: "",
        teacherId: "",
        teacherName: "",
        dayOfWeek: "Monday",
        startTime: "",
        endTime: "",
        lectureHall: "",
        duration: "60"
    });

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        fetchClassrooms();
        fetchTimetables();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const classroomsSnapshot = await getDocs(collection(db, "classrooms"));
            const classroomsList = classroomsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClassrooms(classroomsList);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        }
    };

    const fetchTimetables = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "timetables"), orderBy("dayOfWeek"));
            const timetableSnapshot = await getDocs(q);
            const timetableList = timetableSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTimetables(timetableList);
        } catch (error) {
            console.error("Error fetching timetables:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-fill classroom name when classroom is selected
        if (name === "classroomId") {
            const selectedClassroom = classrooms.find(c => c.id === value);
            if (selectedClassroom) {
                setFormData(prev => ({
                    ...prev,
                    classroomName: selectedClassroom.name,
                    teacherId: selectedClassroom.teacherId || "",
                    teacherName: selectedClassroom.teacherName || ""
                }));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            classroomId: "",
            classroomName: "",
            subject: "",
            teacherId: "",
            teacherName: "",
            dayOfWeek: "Monday",
            startTime: "",
            endTime: "",
            lectureHall: "",
            duration: "60"
        });
        setShowAddForm(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const timetableData = {
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (editingId) {
                await updateDoc(doc(db, "timetables", editingId), timetableData);
                alert("Timetable updated successfully!");
            } else {
                await addDoc(collection(db, "timetables"), timetableData);
                alert("Timetable added successfully!");
            }

            resetForm();
            fetchTimetables();
        } catch (error) {
            console.error("Error saving timetable:", error);
            alert("Failed to save timetable. Please try again.");
        }
    };

    const handleEdit = (timetable) => {
        setFormData({
            classroomId: timetable.classroomId,
            classroomName: timetable.classroomName,
            subject: timetable.subject,
            teacherId: timetable.teacherId,
            teacherName: timetable.teacherName,
            dayOfWeek: timetable.dayOfWeek,
            startTime: timetable.startTime,
            endTime: timetable.endTime,
            lectureHall: timetable.lectureHall,
            duration: timetable.duration
        });
        setEditingId(timetable.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this timetable entry?")) {
            try {
                await deleteDoc(doc(db, "timetables", id));
                alert("Timetable deleted successfully!");
                fetchTimetables();
            } catch (error) {
                console.error("Error deleting timetable:", error);
                alert("Failed to delete timetable. Please try again.");
            }
        }
    };

    const groupedTimetables = timetables.reduce((acc, tt) => {
        if (!acc[tt.dayOfWeek]) {
            acc[tt.dayOfWeek] = [];
        }
        acc[tt.dayOfWeek].push(tt);
        return acc;
    }, {});

    return (
        <div className="timetable-management glass-panel">
            <div className="timetable-header">
                <div>
                    <h2>📅 Timetable Management</h2>
                    <p>Create and manage lecture schedules for all classrooms</p>
                </div>
                <button
                    className="btn-add-timetable"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? <FaTimes /> : <FaPlus />}
                    {showAddForm ? "Cancel" : "Add Lecture"}
                </button>
            </div>

            {showAddForm && (
                <form className="timetable-form glass-panel" onSubmit={handleSubmit}>
                    <h3>{editingId ? "Edit Lecture" : "Add New Lecture"}</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Classroom</label>
                            <select
                                name="classroomId"
                                value={formData.classroomId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Classroom</option>
                                {classrooms.map(classroom => (
                                    <option key={classroom.id} value={classroom.id}>
                                        {classroom.name} - {classroom.section || ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="e.g., Mathematics, Physics"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Day of Week</label>
                            <select
                                name="dayOfWeek"
                                value={formData.dayOfWeek}
                                onChange={handleInputChange}
                                required
                            >
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Lecture Hall</label>
                            <input
                                type="text"
                                name="lectureHall"
                                value={formData.lectureHall}
                                onChange={handleInputChange}
                                placeholder="e.g., Room 101, Lab A"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            <FaSave /> {editingId ? "Update" : "Save"} Lecture
                        </button>
                        <button type="button" className="btn-cancel" onClick={resetForm}>
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="loading-state">Loading timetables...</div>
            ) : (
                <div className="timetable-view">
                    {daysOfWeek.map(day => (
                        <div key={day} className="day-section glass-panel">
                            <h3 className="day-header">{day}</h3>
                            <div className="lectures-list">
                                {groupedTimetables[day]?.length > 0 ? (
                                    groupedTimetables[day]
                                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                        .map(lecture => (
                                            <div key={lecture.id} className="lecture-card">
                                                <div className="lecture-info">
                                                    <div className="lecture-header">
                                                        <h4><FaBook /> {lecture.subject}</h4>
                                                        <span className="classroom-badge">
                                                            {lecture.classroomName}
                                                        </span>
                                                    </div>
                                                    <div className="lecture-details">
                                                        <span>
                                                            <FaClock /> {lecture.startTime} - {lecture.endTime}
                                                        </span>
                                                        <span>
                                                            <FaMapMarkerAlt /> {lecture.lectureHall}
                                                        </span>
                                                    </div>
                                                    {lecture.teacherName && (
                                                        <p className="teacher-name">👨‍🏫 {lecture.teacherName}</p>
                                                    )}
                                                </div>
                                                <div className="lecture-actions">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEdit(lecture)}
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(lecture.id)}
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="no-lectures">No lectures scheduled for {day}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TimetableManagement;
