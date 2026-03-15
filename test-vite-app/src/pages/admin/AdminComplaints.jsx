/**
 * Admin Complaints Panel
 * View, filter, and respond to all complaints from students and teachers
 */

import { useState, useEffect } from "react";
import { db } from "../../services/firebase.config";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
} from "firebase/firestore";
import {
    FaBell,
    FaClock,
    FaEye,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaFilter,
    FaReply,
} from "react-icons/fa";
import "./AdminComplaints.css";

const STATUS_OPTIONS = ["All", "Pending", "Reviewed", "Resolved"];
const ROLE_OPTIONS = ["All", "student", "teacher"];

function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterRole, setFilterRole] = useState("All");
    const [expandedId, setExpandedId] = useState(null);
    const [replyDraft, setReplyDraft] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [message, setMessage] = useState({ id: null, type: "", text: "" });

    useEffect(() => {
        const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setComplaints(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsub;
    }, []);

    const filtered = complaints.filter((c) => {
        const statusMatch = filterStatus === "All" || c.status === filterStatus;
        const roleMatch = filterRole === "All" || c.role === filterRole;
        return statusMatch && roleMatch;
    });

    const counts = {
        Pending: complaints.filter((c) => c.status === "Pending").length,
        Reviewed: complaints.filter((c) => c.status === "Reviewed").length,
        Resolved: complaints.filter((c) => c.status === "Resolved").length,
    };

    const handleStatusChange = async (id, newStatus) => {
        setSavingId(id);
        try {
            await updateDoc(doc(db, "complaints", id), { status: newStatus });
            setMessage({ id, type: "success", text: `Marked as ${newStatus}` });
        } catch (err) {
            console.error(err);
            setMessage({ id, type: "error", text: "Failed to update status." });
        } finally {
            setSavingId(null);
            setTimeout(() => setMessage({ id: null, type: "", text: "" }), 2500);
        }
    };

    const handleReplySubmit = async (id) => {
        const reply = replyDraft[id]?.trim();
        if (!reply) return;
        setSavingId(id);
        try {
            await updateDoc(doc(db, "complaints", id), {
                adminReply: reply,
                status: "Reviewed",
            });
            setReplyDraft((prev) => ({ ...prev, [id]: "" }));
            setMessage({ id, type: "success", text: "Reply sent & marked as Reviewed" });
        } catch (err) {
            setMessage({ id, type: "error", text: "Failed to save reply." });
        } finally {
            setSavingId(null);
            setTimeout(() => setMessage({ id: null, type: "", text: "" }), 2500);
        }
    };

    const statusIcon = (status) => {
        if (status === "Resolved") return <FaCheckCircle className="status-icon resolved" />;
        if (status === "Reviewed") return <FaEye className="status-icon reviewed" />;
        return <FaClock className="status-icon pending" />;
    };

    const formatDate = (ts) =>
        ts?.toDate?.().toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        }) ?? "—";

    return (
        <div className="admin-complaints-container">
            <div className="ac-header">
                <FaBell size={28} />
                <div>
                    <h1>Complaints Management</h1>
                    <p>Review and respond to all student & teacher complaints</p>
                </div>
            </div>

            {/* Summary tiles */}
            <div className="ac-summary-row">
                {[
                    { label: "Pending", count: counts.Pending, color: "pending" },
                    { label: "Reviewed", count: counts.Reviewed, color: "reviewed" },
                    { label: "Resolved", count: counts.Resolved, color: "resolved" },
                    { label: "Total", count: complaints.length, color: "total" },
                ].map((t) => (
                    <div key={t.label} className={`glass-panel ac-tile tile-${t.color}`}>
                        <span className="ac-tile-count">{t.count}</span>
                        <span className="ac-tile-label">{t.label}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-panel ac-filters">
                <FaFilter />
                <div className="filter-group">
                    <label>Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Role</label>
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                </div>
                <span className="filter-result">{filtered.length} complaint{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* List */}
            <div className="glass-panel ac-list-panel">
                {loading ? (
                    <div className="ac-empty">Loading complaints…</div>
                ) : filtered.length === 0 ? (
                    <div className="ac-empty">No complaints match the selected filters.</div>
                ) : (
                    <div className="ac-list">
                        {filtered.map((c) => (
                            <div key={c.id} className={`ac-item status-${c.status.toLowerCase()}`}>
                                {/* Header */}
                                <div
                                    className="ac-item-header"
                                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                                >
                                    <div className="ac-item-left">
                                        {statusIcon(c.status)}
                                        <div>
                                            <h3 className="ac-subject">{c.subject}</h3>
                                            <span className="ac-meta">
                                                <span className={`role-chip role-${c.role}`}>{c.role}</span>
                                                {c.userName} · {c.category} · {formatDate(c.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ac-item-right">
                                        <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                                        {expandedId === c.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                </div>

                                {/* Expanded body */}
                                {expandedId === c.id && (
                                    <div className="ac-item-body">
                                        <p className="ac-description">{c.description}</p>
                                        <p className="ac-email">📧 {c.userEmail}</p>

                                        {/* Status buttons */}
                                        <div className="ac-actions">
                                            <span>Change Status:</span>
                                            {["Pending", "Reviewed", "Resolved"].map((s) => (
                                                <button
                                                    key={s}
                                                    className={`btn-status ${s.toLowerCase()} ${c.status === s ? "active" : ""}`}
                                                    onClick={() => handleStatusChange(c.id, s)}
                                                    disabled={savingId === c.id || c.status === s}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Reply box */}
                                        <div className="ac-reply-section">
                                            <label><FaReply /> Admin Reply</label>
                                            {c.adminReply && (
                                                <div className="existing-reply">
                                                    <strong>Current reply:</strong> {c.adminReply}
                                                </div>
                                            )}
                                            <textarea
                                                rows={3}
                                                placeholder="Type a response to the user…"
                                                value={replyDraft[c.id] ?? ""}
                                                onChange={(e) =>
                                                    setReplyDraft((prev) => ({ ...prev, [c.id]: e.target.value }))
                                                }
                                            />
                                            <button
                                                className="btn-reply"
                                                onClick={() => handleReplySubmit(c.id)}
                                                disabled={savingId === c.id || !replyDraft[c.id]?.trim()}
                                            >
                                                {savingId === c.id ? "Saving…" : "Send Reply"}
                                            </button>
                                        </div>

                                        {message.id === c.id && message.text && (
                                            <div className={`inline-msg ${message.type}`}>{message.text}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminComplaints;
