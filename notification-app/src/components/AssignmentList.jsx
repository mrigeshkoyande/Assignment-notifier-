import React from "react";
import { assignments } from "../data/assignments";
import "./AssignmentList.css";

function AssignmentList({ filter }) {
  const filtered = assignments.filter(
    (a) => filter === "all" || a.status === filter
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Assignment Dashboard</h1>
        <p>Track, review, and manage your class submissions with ease.</p>
      </header>

      <div className="assignment-grid">
        {filtered.map((a) => (
          <div key={a.id} className={`card ${a.status}`}>
            <h3>{a.title}</h3>
            <p><strong>Due:</strong> {a.dueDate}</p>
            <span className={`status-tag ${a.status}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignmentList;
