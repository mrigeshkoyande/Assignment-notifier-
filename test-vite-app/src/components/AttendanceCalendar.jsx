/**
 * AttendanceCalendar Component
 * Premium monthly calendar view with stats ring, streak counter & day-photo modal
 */

import { useState, useEffect, useMemo } from "react";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaMapMarkerAlt,
    FaTimes,
    FaCamera,
    FaFire,
    FaChevronLeft,
    FaChevronRight,
    FaCalendarDay,
} from "react-icons/fa";
import "./AttendanceCalendar.css";

/* ── helpers ─────────────────────────────────────────────── */
const toDateKey = (d) => d.toISOString().split("T")[0];
const fmtTime = (d) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
const fmtFull = (d) =>
    d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

/* Circular SVG progress ring */
function ProgressRing({ pct }) {
    const r = 38;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const color = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <svg className="progress-ring" width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={r} className="ring-bg" />
            <circle
                cx="48"
                cy="48"
                r={r}
                className="ring-fill"
                style={{
                    strokeDasharray: circ,
                    strokeDashoffset: offset,
                    stroke: color,
                }}
            />
            <text x="48" y="45" textAnchor="middle" className="ring-pct">
                {pct}%
            </text>
            <text x="48" y="60" textAnchor="middle" className="ring-label">
                Present
            </text>
        </svg>
    );
}

/* ── main component ──────────────────────────────────────── */
function AttendanceCalendar({ attendanceData = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedRecord, setSelectedRecord] = useState(null);

    /* Build a date-keyed map from raw attendance records */
    const attendanceMap = useMemo(() => {
        const map = {};
        attendanceData.forEach((record) => {
            if (!record.timestamp) return;
            const date =
                record.timestamp instanceof Date
                    ? record.timestamp
                    : new Date(record.timestamp.seconds * 1000);
            const key = toDateKey(date);
            if (!map[key]) {
                map[key] = {
                    present: true,
                    time: fmtTime(date),
                    fullDate: date,
                    location: record.location,
                    photoSnapshot: record.photoSnapshot || null,
                    userName: record.userName || record.email || "User",
                };
            }
        });
        return map;
    }, [attendanceData]);

    /* Month-level stats */
    const { daysPresent, daysAbsent, totalPast, pct } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysInMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ).getDate();

        let present = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            if (toDateKey(dt) in attendanceMap) present++;
        }

        // count past days (incl today) in this month
        let past = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            if (dt <= today) past++;
        }

        return {
            daysPresent: present,
            daysAbsent: Math.max(0, past - present),
            totalPast: past,
            pct: past > 0 ? Math.round((present / past) * 100) : 0,
        };
    }, [attendanceMap, currentDate]);

    /* Current streak */
    const streak = useMemo(() => {
        let count = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let cursor = new Date(today);
        while (true) {
            if (toDateKey(cursor) in attendanceMap) {
                count++;
                cursor.setDate(cursor.getDate() - 1);
            } else break;
        }
        return count;
    }, [attendanceMap]);

    /* Calendar helpers */
    const getDaysInMonth = (d) =>
        new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const getFirstDay = (d) =>
        new Date(d.getFullYear(), d.getMonth(), 1).getDay();

    const previousMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const goToToday = () => setCurrentDate(new Date());

    const getStatus = (day) => {
        const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return attendanceMap[toDateKey(dt)];
    };

    const getStatusClass = (day) => {
        const status = getStatus(day);
        if (status) return "present";
        const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dt > today ? "future" : "absent";
    };

    const handleDayClick = (day) => {
        const status = getStatus(day);
        if (status) setSelectedRecord(status);
    };

    /* Render day cells */
    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDay(currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cells = [];

        for (let i = 0; i < firstDay; i++)
            cells.push(<div key={`e${i}`} className="cal-day empty" />);

        for (let day = 1; day <= daysInMonth; day++) {
            const status = getStatus(day);
            const cls = getStatusClass(day);
            const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = dt.toDateString() === new Date().toDateString();

            cells.push(
                <div
                    key={day}
                    className={`cal-day ${cls}${isToday ? " today" : ""}${status ? " clickable" : ""}`}
                    title={status ? `✅ Marked at ${status.time} — click for details` : ""}
                    onClick={() => handleDayClick(day)}
                >
                    {status?.photoSnapshot && (
                        <span className="photo-dot" title="Photo available" />
                    )}
                    <span className="day-num">{day}</span>
                    <span className="day-icon">
                        {status ? (
                            <FaCheckCircle className="icon-present" />
                        ) : dt <= today ? (
                            <FaTimesCircle className="icon-absent" />
                        ) : (
                            <FaClock className="icon-future" />
                        )}
                    </span>
                    {status && <span className="day-time">{status.time}</span>}
                </div>
            );
        }
        return cells;
    };

    const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });
    const isCurrentMonth =
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

    return (
        <>
            <div className="ac-wrap">
                {/* ── Top Stats Row ── */}
                <div className="ac-stats-row">
                    <ProgressRing pct={pct} />

                    <div className="stats-chips">
                        <div className="stat-chip present-chip">
                            <FaCheckCircle />
                            <div>
                                <span className="chip-val">{daysPresent}</span>
                                <span className="chip-lbl">Present</span>
                            </div>
                        </div>
                        <div className="stat-chip absent-chip">
                            <FaTimesCircle />
                            <div>
                                <span className="chip-val">{daysAbsent}</span>
                                <span className="chip-lbl">Absent</span>
                            </div>
                        </div>
                        <div className="stat-chip streak-chip">
                            <FaFire />
                            <div>
                                <span className="chip-val">{streak}</span>
                                <span className="chip-lbl">Day Streak</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Attendance bar ── */}
                <div className="ac-bar-wrap">
                    <div
                        className="ac-bar-fill"
                        style={{ width: `${pct}%`, background: pct >= 75 ? "linear-gradient(90deg,#10b981,#34d399)" : pct >= 50 ? "linear-gradient(90deg,#f59e0b,#fcd34d)" : "linear-gradient(90deg,#ef4444,#f87171)" }}
                    />
                </div>

                {/* ── Calendar navigation ── */}
                <div className="ac-nav">
                    <button className="nav-btn" onClick={previousMonth} aria-label="Previous month">
                        <FaChevronLeft />
                    </button>
                    <div className="nav-month">
                        <h3>{monthName}</h3>
                    </div>
                    <button className="nav-btn" onClick={nextMonth} aria-label="Next month">
                        <FaChevronRight />
                    </button>
                    {!isCurrentMonth && (
                        <button className="btn-today" onClick={goToToday}>
                            <FaCalendarDay /> Today
                        </button>
                    )}
                </div>

                {/* ── Weekday headers ── */}
                <div className="cal-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="wday">{d}</div>
                    ))}
                    {renderDays()}
                </div>

                {/* Legend */}
                <div className="ac-legend">
                    <span className="leg-item"><FaCheckCircle className="icon-present" /> Present</span>
                    <span className="leg-item"><FaTimesCircle className="icon-absent" /> Absent</span>
                    <span className="leg-item"><FaClock className="icon-future" /> Upcoming</span>
                    <span className="leg-item"><span className="photo-dot-demo" /> Has photo</span>
                </div>
            </div>

            {/* ── Day Detail Modal ── */}
            {selectedRecord && (
                <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedRecord(null)}>
                            <FaTimes />
                        </button>

                        <div className="modal-head">
                            <FaCheckCircle className="modal-check" />
                            <h3>Attendance Verified</h3>
                            <p>{selectedRecord.fullDate instanceof Date ? fmtFull(selectedRecord.fullDate) : ""}</p>
                        </div>

                        {selectedRecord.photoSnapshot ? (
                            <div className="modal-photo-wrap">
                                <div className="modal-photo-label">
                                    <FaCamera size={13} /> Captured Photo
                                </div>
                                <div className="modal-photo-frame">
                                    <img
                                        src={selectedRecord.photoSnapshot}
                                        alt="Attendance photo"
                                        className="modal-photo"
                                    />
                                    <span className="modal-verified-badge">✅ Verified</span>
                                </div>
                            </div>
                        ) : (
                            <div className="modal-no-photo">
                                <FaCamera size={30} />
                                <p>No photo captured for this record</p>
                            </div>
                        )}

                        <div className="modal-meta">
                            <div className="meta-row">
                                <span className="meta-label">🕐 Time</span>
                                <span className="meta-value">{selectedRecord.time}</span>
                            </div>
                            <div className="meta-row">
                                <span className="meta-label">👤 User</span>
                                <span className="meta-value">{selectedRecord.userName}</span>
                            </div>
                            {selectedRecord.location && selectedRecord.location.latitude !== 0 && (
                                <div className="meta-row">
                                    <span className="meta-label"><FaMapMarkerAlt size={11} /> GPS</span>
                                    <span className="meta-value">
                                        {selectedRecord.location.latitude.toFixed(5)},&nbsp;
                                        {selectedRecord.location.longitude.toFixed(5)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AttendanceCalendar;
