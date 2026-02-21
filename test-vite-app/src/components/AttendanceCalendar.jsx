/**
 * AttendanceCalendar Component
 * Monthly calendar view with clickable day-photo modal
 */

import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaTimes, FaCamera } from "react-icons/fa";
import "./AttendanceCalendar.css";

function AttendanceCalendar({ attendanceData = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceMap, setAttendanceMap] = useState({});
    const [selectedRecord, setSelectedRecord] = useState(null); // day detail modal

    useEffect(() => {
        const map = {};
        attendanceData.forEach((record) => {
            if (record.timestamp) {
                const date =
                    record.timestamp instanceof Date
                        ? record.timestamp
                        : new Date(record.timestamp.seconds * 1000);
                const dateKey = date.toISOString().split("T")[0];
                map[dateKey] = {
                    present: true,
                    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
                    fullDate: date,
                    location: record.location,
                    photoSnapshot: record.photoSnapshot || null,
                    userName: record.userName || record.email || "User",
                };
            }
        });
        setAttendanceMap(map);
    }, [attendanceData]);

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const goToToday = () => setCurrentDate(new Date());

    const getAttendanceStatus = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateKey = date.toISOString().split("T")[0];
        return attendanceMap[dateKey];
    };

    const getStatusClass = (day) => {
        const status = getAttendanceStatus(day);
        if (!status) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date > today ? "future" : "absent";
        }
        return "present";
    };

    const handleDayClick = (day) => {
        const status = getAttendanceStatus(day);
        if (status) setSelectedRecord(status);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const status = getAttendanceStatus(day);
            const statusClass = getStatusClass(day);
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = dayDate.toDateString() === new Date().toDateString();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${statusClass} ${isToday ? "today" : ""} ${status ? "clickable" : ""}`}
                    title={status ? `✅ Marked at ${status.time} — click to view photo` : "Not marked"}
                    onClick={() => handleDayClick(day)}
                >
                    <div className="day-number">{day}</div>
                    <div className="status-indicator">
                        {status ? (
                            <FaCheckCircle className="icon-present" />
                        ) : (
                            <>
                                {dayDate <= today ? (
                                    <FaTimesCircle className="icon-absent" />
                                ) : (
                                    <FaClock className="icon-future" />
                                )}
                            </>
                        )}
                    </div>
                    {status && <div className="time-text">{status.time}</div>}
                    {status?.photoSnapshot && (
                        <div className="has-photo-indicator" title="Photo available">📷</div>
                    )}
                </div>
            );
        }
        return days;
    };

    const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });
    const daysPresent = Object.values(attendanceMap).filter((v) => {
        const d = v.fullDate instanceof Date ? v.fullDate : new Date(v.fullDate);
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    }).length;
    const monthDays = getDaysInMonth(currentDate);
    const attendancePercentage = monthDays > 0 ? Math.round((daysPresent / monthDays) * 100) : 0;

    return (
        <>
            <div className="attendance-calendar-container">
                <div className="calendar-header">
                    <div className="header-title">
                        <h2>📅 Attendance Calendar</h2>
                        <p className="attendance-stats">
                            <span>{daysPresent} days present</span>
                            <span className="separator">•</span>
                            <span>{attendancePercentage}% this month</span>
                        </p>
                    </div>
                </div>

                <div className="calendar-controls">
                    <button className="btn-nav" onClick={previousMonth}>← Previous</button>
                    <div className="month-year"><h3>{monthName}</h3></div>
                    <button className="btn-nav" onClick={nextMonth}>Next →</button>
                    <button className="btn-today" onClick={goToToday}>Today</button>
                </div>

                <div className="calendar-legend">
                    <div className="legend-item"><FaCheckCircle className="icon-present" /><span>Present (click to view photo)</span></div>
                    <div className="legend-item"><FaTimesCircle className="icon-absent" /><span>Absent</span></div>
                    <div className="legend-item"><FaClock className="icon-future" /><span>Future</span></div>
                </div>

                <div className="calendar">
                    <div className="weekdays">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="weekday-header">{d}</div>
                        ))}
                    </div>
                    <div className="days-grid">{renderCalendarDays()}</div>
                </div>

                <div className="calendar-info">
                    <p>💡 Click on any <strong>green ✅ day</strong> to view your attendance photo and details</p>
                </div>
            </div>

            {/* Day Detail / Photo Modal */}
            {selectedRecord && (
                <div className="day-modal-overlay" onClick={() => setSelectedRecord(null)}>
                    <div className="day-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="day-modal-close" onClick={() => setSelectedRecord(null)}>
                            <FaTimes />
                        </button>

                        <div className="day-modal-header">
                            <FaCheckCircle className="modal-check-icon" />
                            <h3>Attendance Record</h3>
                            <p>
                                {selectedRecord.fullDate instanceof Date
                                    ? selectedRecord.fullDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                                    : ""}
                            </p>
                        </div>

                        {/* Captured Photo */}
                        {selectedRecord.photoSnapshot ? (
                            <div className="day-modal-photo-section">
                                <h4><FaCamera size={16} /> Captured Photo</h4>
                                <div className="day-modal-photo-frame">
                                    <img src={selectedRecord.photoSnapshot} alt="Attendance photo" className="day-modal-photo" />
                                    <div className="day-modal-photo-badge">✅ Verified</div>
                                </div>
                            </div>
                        ) : (
                            <div className="day-modal-no-photo">
                                <FaCamera size={32} />
                                <p>No photo available for this record</p>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="day-modal-meta">
                            <div className="day-modal-meta-row">
                                <span className="modal-meta-label">🕐 Time</span>
                                <span className="modal-meta-value">{selectedRecord.time}</span>
                            </div>
                            <div className="day-modal-meta-row">
                                <span className="modal-meta-label">👤 User</span>
                                <span className="modal-meta-value">{selectedRecord.userName}</span>
                            </div>
                            {selectedRecord.location && selectedRecord.location.latitude !== 0 && (
                                <div className="day-modal-meta-row">
                                    <span className="modal-meta-label"><FaMapMarkerAlt size={12} /> GPS</span>
                                    <span className="modal-meta-value">
                                        {selectedRecord.location.latitude.toFixed(5)}, {selectedRecord.location.longitude.toFixed(5)}
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
