/**
 * Student Complaints Component
 * Allows students to submit complaints and track their status
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import {
  FaExclamationCircle,
  FaPaperPlane,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "./Complaints.css";

const CATEGORIES = ["Academic", "Technical", "Behavioural", "Infrastructure", "Other"];

function Complaints() {
  const { currentUser } = useAuth();

  const [form, setForm] = useState({ subject: "", category: "Academic", description: "" });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const q = query(
      collection(db, "complaints"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComplaints(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      await addDoc(collection(db, "complaints"), {
        userId: currentUser.uid,
        userName: currentUser.displayName || "Student",
        userEmail: currentUser.email,
        role: "student",
        subject: form.subject.trim(),
        category: form.category,
        description: form.description.trim(),
        status: "Pending",
        adminReply: "",
        createdAt: Timestamp.now(),
      });
      setForm({ subject: "", category: "Academic", description: "" });
      setMessage({ type: "success", text: "Complaint submitted successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const statusIcon = (status) => {
    if (status === "Resolved") return <FaCheckCircle className="status-icon resolved" />;
    if (status === "Reviewed") return <FaEye className="status-icon reviewed" />;
    return <FaClock className="status-icon pending" />;
  };

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <FaExclamationCircle size={28} />
        <div>
          <h1>Complaints</h1>
          <p>Submit a complaint and track its resolution status</p>
        </div>
      </div>

      {/* Submit Form */}
      <div className="glass-panel complaints-form-card">
        <h2>Submit New Complaint</h2>
        {message.text && (
          <div className={`message-banner ${message.type}`}>{message.text}</div>
        )}
        <form onSubmit={handleSubmit} className="complaints-form">
          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                placeholder="Brief subject of your complaint"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                maxLength={120}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={5}
              placeholder="Describe your complaint in detail..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              maxLength={1000}
            />
            <span className="char-count">{form.description.length}/1000</span>
          </div>
          <button type="submit" className="btn-submit" disabled={submitting}>
            <FaPaperPlane /> {submitting ? "Submitting…" : "Submit Complaint"}
          </button>
        </form>
      </div>

      {/* Past Complaints */}
      <div className="glass-panel complaints-list-card">
        <h2>My Complaints ({complaints.length})</h2>
        {loading ? (
          <div className="loading-spinner">Loading…</div>
        ) : complaints.length === 0 ? (
          <p className="no-data">No complaints submitted yet.</p>
        ) : (
          <div className="complaints-list">
            {complaints.map((c) => (
              <div key={c.id} className={`complaint-item status-${c.status.toLowerCase()}`}>
                <div
                  className="complaint-header"
                  onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                >
                  <div className="complaint-title">
                    {statusIcon(c.status)}
                    <div>
                      <h3>{c.subject}</h3>
                      <span className="complaint-meta">
                        {c.category} •{" "}
                        {c.createdAt?.toDate?.().toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="complaint-right">
                    <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                    {expandedId === c.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                {expandedId === c.id && (
                  <div className="complaint-body">
                    <p className="complaint-description">{c.description}</p>
                    {c.adminReply && (
                      <div className="admin-reply">
                        <strong>Admin Response:</strong>
                        <p>{c.adminReply}</p>
                      </div>
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

export default Complaints;
