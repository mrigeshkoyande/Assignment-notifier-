/**
 * MyMarks Component (Student)
 * Displays all marks posted for the logged-in student by their teachers.
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { FaGraduationCap, FaMedal, FaBook, FaCalendarAlt } from "react-icons/fa";
import "./MyMarks.css";

function MyMarks() {
    const { currentUser } = useAuth();
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSubject, setFilterSubject] = useState("All");

    useEffect(() => {
        if (!currentUser) return;

        // Query marks where studentId equals current user's UID
        const q = query(
            collection(db, "marks"),
            where("studentId", "==", currentUser.uid),
            orderBy("uploadedAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            setMarks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, () => {
            // Fallback: if index not yet ready, try without orderBy
            const qFallback = query(
                collection(db, "marks"),
                where("studentId", "==", currentUser.uid)
            );
            onSnapshot(qFallback, (snap) => {
                const data = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => {
                        const ta = a.uploadedAt?.seconds ?? 0;
                        const tb = b.uploadedAt?.seconds ?? 0;
                        return tb - ta;
                    });
                setMarks(data);
                setLoading(false);
            });
        });

        return unsub;
    }, [currentUser]);

    const subjects = ["All", ...new Set(marks.map((m) => m.subject || m.classroomName || "General").filter(Boolean))];
    const filtered = filterSubject === "All"
        ? marks
        : marks.filter((m) => (m.subject || m.classroomName) === filterSubject);

    const getGradeColor = (grade) => {
        if (!grade) return "";
        const g = grade.toUpperCase();
        if (g === "A+" || g === "A") return "grade-a";
        if (g === "B+" || g === "B") return "grade-b";
        if (g === "C+" || g === "C") return "grade-c";
        return "grade-d";
    };

    const formatDate = (ts) =>
        ts?.toDate?.().toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        }) ?? "—";

    return (
        <div className="my-marks-container">
            <div className="mm-header">
                <FaGraduationCap size={32} />
                <div>
                    <h1>My Marks</h1>
                    <p>View all your results uploaded by your teachers</p>
                </div>
            </div>

            {/* Summary strip */}
            {!loading && marks.length > 0 && (
                <div className="mm-summary-row">
                    <div className="glass-panel mm-tile">
                        <span className="mm-tile-value">{marks.length}</span>
                        <span className="mm-tile-label">Total Records</span>
                    </div>
                    <div className="glass-panel mm-tile">
                        <span className="mm-tile-value">{subjects.length - 1}</span>
                        <span className="mm-tile-label">Subjects</span>
                    </div>
                    {marks.some((m) => m.marks) && (
                        <div className="glass-panel mm-tile">
                            <span className="mm-tile-value">
                                {Math.round(
                                    marks.reduce((acc, m) => acc + (parseFloat(m.marks) || 0), 0) / marks.filter((m) => m.marks).length
                                )}
                            </span>
                            <span className="mm-tile-label">Avg. Marks</span>
                        </div>
                    )}
                </div>
            )}

            {/* Filter */}
            {subjects.length > 2 && (
                <div className="glass-panel mm-filter">
                    <FaBook style={{ opacity: 0.6 }} />
                    <label>Filter by Subject:</label>
                    <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                        {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>
            )}

            {/* Marks table */}
            <div className="glass-panel mm-table-panel">
                {loading ? (
                    <p className="mm-empty">Loading your marks…</p>
                ) : filtered.length === 0 ? (
                    <div className="mm-empty-state">
                        <FaMedal size={48} style={{ opacity: 0.2 }} />
                        <p>No marks posted yet.</p>
                        <span>Your teachers will upload results here after evaluations.</span>
                    </div>
                ) : (
                    <div className="mm-table-wrap">
                        <table className="mm-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th><FaBook /> Subject</th>
                                    <th>Student Name</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                    <th><FaCalendarAlt /> Uploaded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((m, i) => (
                                    <tr key={m.id}>
                                        <td>{i + 1}</td>
                                        <td>{m.subject || m.classroomName || "—"}</td>
                                        <td>{m.studentName || currentUser?.displayName || "—"}</td>
                                        <td className="td-marks">{m.marks ?? "—"}</td>
                                        <td>
                                            {m.grade ? (
                                                <span className={`grade-chip ${getGradeColor(m.grade)}`}>{m.grade}</span>
                                            ) : "—"}
                                        </td>
                                        <td>{formatDate(m.uploadedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyMarks;
