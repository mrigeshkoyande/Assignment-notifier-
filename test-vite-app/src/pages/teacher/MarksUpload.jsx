/**
 * MarksUpload Component (Teacher)
 * Teachers can upload a CSV/Excel file to post student marks for a subject.
 * Parsed client-side using a lightweight built-in CSV parser (no extra deps).
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
    Timestamp,
    orderBy,
} from "firebase/firestore";
import {
    FaClipboardList,
    FaUpload,
    FaFileAlt,
    FaTable,
    FaCheck,
    FaTimes,
    FaHistory,
} from "react-icons/fa";
import "./MarksUpload.css";

// ─── Minimal CSV parser ────────────────────────────────────────────────────
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { headers: [], rows: [] };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        const obj = {};
        headers.forEach((h, i) => { obj[h] = cols[i] ?? ""; });
        return obj;
    });
    return { headers, rows };
}

function MarksUpload() {
    const { currentUser } = useAuth();

    const [classrooms, setClassrooms] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // { headers, rows }
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Load teacher's classrooms
    useEffect(() => {
        if (!currentUser) return;
        const fetch = async () => {
            const q = query(
                collection(db, "classrooms"),
                where("teacherId", "==", currentUser.uid)
            );
            const snap = await getDocs(q);
            setClassrooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        };
        fetch();
    }, [currentUser]);

    // Load upload history
    useEffect(() => {
        if (!currentUser) return;
        const fetch = async () => {
            const q = query(
                collection(db, "marksUploads"),
                where("teacherId", "==", currentUser.uid),
                orderBy("uploadedAt", "desc")
            );
            const snap = await getDocs(q);
            setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoadingHistory(false);
        };
        fetch();
    }, [uploading, currentUser]);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(null);
        setMessage({ type: "", text: "" });

        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            const parsed = parseCSV(text);
            if (parsed.headers.length === 0) {
                setMessage({ type: "error", text: "Could not parse file. Ensure it is a valid CSV." });
                return;
            }
            setPreview(parsed);
        };
        reader.readAsText(f);
    };

    const handleUpload = async () => {
        if (!selectedClass) {
            setMessage({ type: "error", text: "Please select a classroom first." });
            return;
        }
        if (!preview || preview.rows.length === 0) {
            setMessage({ type: "error", text: "No valid data to upload." });
            return;
        }

        setUploading(true);
        setMessage({ type: "", text: "" });

        try {
            const classroom = classrooms.find((c) => c.id === selectedClass);

            // Save each row as a marks record
            const batch = preview.rows.map((row) =>
                addDoc(collection(db, "marks"), {
                    ...row,
                    classroomId: selectedClass,
                    classroomName: classroom?.name || "",
                    subject: classroom?.subject || "",
                    teacherId: currentUser.uid,
                    uploadedAt: Timestamp.now(),
                })
            );
            await Promise.all(batch);

            // Log the upload event
            await addDoc(collection(db, "marksUploads"), {
                teacherId: currentUser.uid,
                teacherName: currentUser.displayName,
                classroomId: selectedClass,
                classroomName: classroom?.name || "",
                subject: classroom?.subject || "",
                rowCount: preview.rows.length,
                fileName: file.name,
                uploadedAt: Timestamp.now(),
            });

            setMessage({ type: "success", text: `✅ ${preview.rows.length} student records uploaded successfully!` });
            setFile(null);
            setPreview(null);
            setSelectedClass("");
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Upload failed. Please try again." });
        } finally {
            setUploading(false);
        }
    };

    const formatDate = (ts) =>
        ts?.toDate?.().toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        }) ?? "—";

    return (
        <div className="marks-upload-container">
            <div className="mu-header">
                <FaClipboardList size={28} />
                <div>
                    <h1>Marks Upload</h1>
                    <p>Upload student marks via CSV file for any of your classrooms</p>
                </div>
            </div>

            {message.text && (
                <div className={`message-banner ${message.type}`}>{message.text}</div>
            )}

            {/* Upload Panel */}
            <div className="glass-panel mu-panel">
                <h2>Upload Marks File</h2>

                {/* Step 1 – Select classroom */}
                <div className="mu-step">
                    <span className="step-badge">1</span>
                    <div className="mu-step-body">
                        <label>Select Classroom / Subject</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">— Choose a classroom —</option>
                            {classrooms.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} {c.subject ? `(${c.subject})` : ""}
                                </option>
                            ))}
                        </select>
                        {classrooms.length === 0 && (
                            <span className="hint-text">No classrooms found. Create one first.</span>
                        )}
                    </div>
                </div>

                {/* Step 2 – Upload CSV */}
                <div className="mu-step">
                    <span className="step-badge">2</span>
                    <div className="mu-step-body">
                        <label>Choose CSV File</label>
                        <div className="file-drop-area">
                            <input
                                type="file"
                                id="marks-file"
                                accept=".csv,text/csv"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="marks-file" className="file-drop-label">
                                <FaFileAlt size={36} />
                                <span>{file ? file.name : "Click to select a CSV file"}</span>
                                <span className="hint">Columns: studentId, studentName, marks, grade (or your custom headers)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Step 3 – Preview */}
                {preview && (
                    <div className="mu-step">
                        <span className="step-badge">3</span>
                        <div className="mu-step-body full-width">
                            <div className="preview-header">
                                <FaTable />
                                <label>Preview ({preview.rows.length} rows)</label>
                            </div>
                            <div className="preview-table-wrap">
                                <table className="preview-table">
                                    <thead>
                                        <tr>
                                            {preview.headers.map((h) => <th key={h}>{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.rows.slice(0, 10).map((row, i) => (
                                            <tr key={i}>
                                                {preview.headers.map((h) => <td key={h}>{row[h]}</td>)}
                                            </tr>
                                        ))}
                                        {preview.rows.length > 10 && (
                                            <tr>
                                                <td colSpan={preview.headers.length} className="more-rows">
                                                    + {preview.rows.length - 10} more rows not shown
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload button */}
                <div className="mu-actions">
                    {preview && file && (
                        <button className="btn-clear-file" onClick={() => { setFile(null); setPreview(null); }}>
                            <FaTimes /> Clear
                        </button>
                    )}
                    <button
                        className="btn-upload-marks"
                        onClick={handleUpload}
                        disabled={uploading || !preview || !selectedClass}
                    >
                        <FaUpload /> {uploading ? "Uploading…" : "Upload Marks"}
                    </button>
                </div>
            </div>

            {/* Upload History */}
            <div className="glass-panel mu-panel">
                <h2><FaHistory style={{ marginRight: "0.5rem" }} />Upload History</h2>
                {loadingHistory ? (
                    <p className="mu-empty">Loading…</p>
                ) : history.length === 0 ? (
                    <p className="mu-empty">No uploads yet.</p>
                ) : (
                    <div className="history-list">
                        {history.map((h) => (
                            <div key={h.id} className="history-item">
                                <FaCheck className="history-icon" />
                                <div>
                                    <strong>{h.classroomName}</strong>{h.subject ? ` — ${h.subject}` : ""}
                                    <span className="history-meta">
                                        {h.rowCount} students · {h.fileName} · {formatDate(h.uploadedAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MarksUpload;
