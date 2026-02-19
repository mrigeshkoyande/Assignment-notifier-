/**
 * My Lectures Component for Students
 * Displays lecture timetable with location and provides reminders
 */

import { useState, useEffect } from "react";
import { db } from "../../services/firebase.config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { FaClock, FaMapMarkerAlt, FaBook, FaBell, FaCalendarDay } from "react-icons/fa";
import "./MyLectures.css";

function MyLectures() {
    const { currentUser } = useAuth();
    const [myClassrooms, setMyClassrooms] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [upcomingLecture, setUpcomingLecture] = useState(null);
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function getCurrentDay() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[new Date().getDay()];
    }

    useEffect(() => {
        fetchMyClassrooms();
    }, [currentUser]);

    useEffect(() => {
        if (myClassrooms.length > 0) {
            fetchTimetable();
        }
    }, [myClassrooms]);

    useEffect(() => {
        if (timetable.length > 0) {
            checkCurrentAndUpcomingLecture();
            const interval = setInterval(checkCurrentAndUpcomingLecture, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [timetable]);

    const fetchMyClassrooms = async () => {
        if (!currentUser) return;
        
        try {
            // Fetch classrooms where current user is a student
            const classroomsQuery = query(
                collection(db, "classrooms"),
                where("studentIds", "array-contains", currentUser.uid)
            );
            const classroomsSnapshot = await getDocs(classroomsQuery);
            const classroomsList = classroomsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMyClassrooms(classroomsList);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        }
    };

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const classroomIds = myClassrooms.map(c => c.id);
            
            if (classroomIds.length === 0) {
                setTimetable([]);
                return;
            }

            // Fetch all timetables for user's classrooms
            const timetableQuery = query(
                collection(db, "timetables"),
                where("classroomId", "in", classroomIds)
            );
            const timetableSnapshot = await getDocs(timetableQuery);
            const timetableList = timetableSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setTimetable(timetableList);
        } catch (error) {
            console.error("Error fetching timetable:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkCurrentAndUpcomingLecture = () => {
        const now = new Date();
        const currentDay = getCurrentDay();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Time in minutes

        const todayLectures = timetable
            .filter(lecture => lecture.dayOfWeek === currentDay)
            .map(lecture => {
                const [startHour, startMin] = lecture.startTime.split(':').map(Number);
                const [endHour, endMin] = lecture.endTime.split(':').map(Number);
                return {
                    ...lecture,
                    startTimeMinutes: startHour * 60 + startMin,
                    endTimeMinutes: endHour * 60 + endMin
                };
            })
            .sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);

        // Find current lecture
        const current = todayLectures.find(
            lecture => currentTime >= lecture.startTimeMinutes && currentTime <= lecture.endTimeMinutes
        );
        setCurrentLecture(current || null);

        // Find upcoming lecture (within next 2 hours)
        const upcoming = todayLectures.find(
            lecture => lecture.startTimeMinutes > currentTime && lecture.startTimeMinutes <= currentTime + 120
        );
        setUpcomingLecture(upcoming || null);

        // Show notification for upcoming lecture (15 minutes before)
        if (upcoming && upcoming.startTimeMinutes - currentTime <= 15 && upcoming.startTimeMinutes - currentTime > 0) {
            showNotification(upcoming);
        }
    };

    const showNotification = (lecture) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("📚 Upcoming Lecture", {
                body: `${lecture.subject} starts in ${lecture.startTimeMinutes - (new Date().getHours() * 60 + new Date().getMinutes())} minutes at ${lecture.lectureHall}`,
                icon: "/notification-icon.png"
            });
        }
    };

    const requestNotificationPermission = () => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    };

    const getDayLectures = (day) => {
        return timetable
            .filter(lecture => lecture.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    if (loading) {
        return (
            <div className="my-lectures glass-panel">
                <div className="loading-state">Loading your lecture schedule...</div>
            </div>
        );
    }

    if (myClassrooms.length === 0) {
        return (
            <div className="my-lectures glass-panel">
                <div className="empty-state">
                    <FaBook size={64} />
                    <h3>No Classrooms Enrolled</h3>
                    <p>You are not enrolled in any classrooms yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-lectures">
            <div className="lectures-header glass-panel">
                <div>
                    <h2>📚 Where is My Lecture?</h2>
                    <p>Your lecture schedule and location information</p>
                </div>
                <button className="btn-notifications" onClick={requestNotificationPermission}>
                    <FaBell /> Enable Reminders
                </button>
            </div>

            {/* Current & Upcoming Lectures Alert */}
            <div className="lecture-alerts">
                {currentLecture && (
                    <div className="alert-card current-lecture glass-panel">
                        <div className="alert-icon">🎓</div>
                        <div className="alert-content">
                            <h3>Current Lecture</h3>
                            <h4>{currentLecture.subject}</h4>
                            <div className="lecture-details">
                                <span><FaClock /> {currentLecture.startTime} - {currentLecture.endTime}</span>
                                <span><FaMapMarkerAlt /> {currentLecture.lectureHall}</span>
                            </div>
                            <p className="teacher-info">👨‍🏫 {currentLecture.teacherName}</p>
                        </div>
                    </div>
                )}

                {upcomingLecture && !currentLecture && (
                    <div className="alert-card upcoming-lecture glass-panel">
                        <div className="alert-icon">⏰</div>
                        <div className="alert-content">
                            <h3>Next Lecture</h3>
                            <h4>{upcomingLecture.subject}</h4>
                            <div className="lecture-details">
                                <span><FaClock /> {upcomingLecture.startTime} - {upcomingLecture.endTime}</span>
                                <span><FaMapMarkerAlt /> {upcomingLecture.lectureHall}</span>
                            </div>
                            <p className="teacher-info">👨‍🏫 {upcomingLecture.teacherName}</p>
                        </div>
                    </div>
                )}

                {!currentLecture && !upcomingLecture && (
                    <div className="alert-card no-lectures glass-panel">
                        <div className="alert-icon">✅</div>
                        <div className="alert-content">
                            <h3>No Upcoming Lectures</h3>
                            <p>You're free for now! Check your weekly schedule below.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Day Selector */}
            <div className="day-selector glass-panel">
                <FaCalendarDay />
                {daysOfWeek.map(day => (
                    <button
                        key={day}
                        className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Daily Timetable */}
            <div className="daily-timetable glass-panel">
                <h3>{selectedDay}'s Schedule</h3>
                <div className="lectures-list">
                    {getDayLectures(selectedDay).length > 0 ? (
                        getDayLectures(selectedDay).map(lecture => (
                            <div key={lecture.id} className="lecture-item">
                                <div className="lecture-time">
                                    <FaClock />
                                    <div>
                                        <strong>{lecture.startTime}</strong>
                                        <span>{lecture.endTime}</span>
                                    </div>
                                </div>
                                <div className="lecture-info">
                                    <h4><FaBook /> {lecture.subject}</h4>
                                    <p className="classroom-name">{lecture.classroomName}</p>
                                    <div className="lecture-meta">
                                        <span className="location">
                                            <FaMapMarkerAlt /> {lecture.lectureHall}
                                        </span>
                                        <span className="teacher">
                                            👨‍🏫 {lecture.teacherName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-lectures-day">
                            <p>No lectures scheduled for {selectedDay}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Overview */}
            <div className="weekly-overview glass-panel">
                <h3>📅 Weekly Overview</h3>
                <div className="week-grid">
                    {daysOfWeek.map(day => {
                        const dayLectures = getDayLectures(day);
                        return (
                            <div key={day} className="week-day-card">
                                <h4>{day}</h4>
                                <div className="day-summary">
                                    <span className="lecture-count">
                                        {dayLectures.length} {dayLectures.length === 1 ? 'Lecture' : 'Lectures'}
                                    </span>
                                    {dayLectures.length > 0 && (
                                        <span className="time-range">
                                            {dayLectures[0].startTime} - {dayLectures[dayLectures.length - 1].endTime}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MyLectures;
