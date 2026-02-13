/**
 * Attendance Calendar Component
 * Displays a monthly calendar view of student attendance with status indicators
 */

import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "./AttendanceCalendar.css";

function AttendanceCalendar({ attendanceData = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceMap, setAttendanceMap] = useState({});

    useEffect(() => {
        // Create a map of dates to attendance status
        const map = {};
        
        attendanceData.forEach((record) => {
            if (record.timestamp) {
                // Handle both Date objects and timestamps
                const date = record.timestamp instanceof Date 
                    ? record.timestamp 
                    : new Date(record.timestamp.seconds * 1000);
                
                const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                map[dateKey] = {
                    present: true,
                    time: date.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    }),
                    location: record.location
                };
            }
        });
        
        setAttendanceMap(map);
    }, [attendanceData]);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getAttendanceStatus = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateKey = date.toISOString().split('T')[0];
        return attendanceMap[dateKey];
    };

    const getStatusClass = (day) => {
        const status = getAttendanceStatus(day);
        if (!status) {
            // Check if the date is in the future
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date > today) {
                return "future";
            }
            return "absent";
        }
        return "present";
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const status = getAttendanceStatus(day);
            const statusClass = getStatusClass(day);
            
            days.push(
                <div
                    key={day}
                    className={`calendar-day ${statusClass}`}
                    title={status ? `Marked at ${status.time}` : 'Not marked'}
                >
                    <div className="day-number">{day}</div>
                    <div className="status-indicator">
                        {status ? (
                            <FaCheckCircle className="icon-present" />
                        ) : (
                            <>
                                {new Date(currentDate.getFullYear(), currentDate.getMonth(), day) <= new Date() ? (
                                    <FaTimesCircle className="icon-absent" />
                                ) : (
                                    <FaClock className="icon-future" />
                                )}
                            </>
                        )}
                    </div>
                    {status && <div className="time-text">{status.time}</div>}
                </div>
            );
        }

        return days;
    };

    const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const daysAbsent = Object.values(attendanceMap).length;
    const monthDays = getDaysInMonth(currentDate);
    const attendancePercentage = monthDays > 0 ? Math.round((daysAbsent / monthDays) * 100) : 0;

    return (
        <div className="attendance-calendar-container">
            <div className="calendar-header">
                <div className="header-title">
                    <h2>Attendance Calendar</h2>
                    <p className="attendance-stats">
                        <span>{daysAbsent} days present</span>
                        <span className="separator">•</span>
                        <span>{attendancePercentage}% attendance</span>
                    </p>
                </div>
            </div>

            <div className="calendar-controls">
                <button className="btn-nav" onClick={previousMonth}>← Previous</button>
                <div className="month-year">
                    <h3>{monthName}</h3>
                </div>
                <button className="btn-nav" onClick={nextMonth}>Next →</button>
                <button className="btn-today" onClick={goToToday}>Today</button>
            </div>

            <div className="calendar-legend">
                <div className="legend-item">
                    <FaCheckCircle className="icon-present" />
                    <span>Present</span>
                </div>
                <div className="legend-item">
                    <FaTimesCircle className="icon-absent" />
                    <span>Absent</span>
                </div>
                <div className="legend-item">
                    <FaClock className="icon-future" />
                    <span>Future</span>
                </div>
            </div>

            <div className="calendar">
                <div className="weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="weekday-header">{day}</div>
                    ))}
                </div>
                <div className="days-grid">
                    {renderCalendarDays()}
                </div>
            </div>

            <div className="calendar-info">
                <p>📍 Click on any date to see location details</p>
            </div>
        </div>
    );
}

export default AttendanceCalendar;
