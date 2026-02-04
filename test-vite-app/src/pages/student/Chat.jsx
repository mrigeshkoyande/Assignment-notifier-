import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase.config";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDocs
} from "firebase/firestore";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import "./Chat.css";

function Chat() {
    const { currentUser, userRole } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (selectedTeacher) {
            const chatId = getChatId(currentUser.uid, selectedTeacher.id);

            const q = query(
                collection(db, "chats", chatId, "messages"),
                orderBy("timestamp", "asc")
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(msgs);
                scrollToBottom();
            });

            return () => unsubscribe();
        }
    }, [selectedTeacher, currentUser.uid]);

    const fetchTeachers = async () => {
        try {
            const q = query(collection(db, "users"), where("role", "==", "teacher"));
            const querySnapshot = await getDocs(q);

            const teacherList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If no teachers in DB, use demo data
            if (teacherList.length === 0) {
                setTeachers([
                    { id: "demo1", name: "Dr. Sarah Johnson", email: "sarah.j@college.edu" },
                    { id: "demo2", name: "Prof. Michael Chen", email: "michael.c@college.edu" },
                    { id: "demo3", name: "Dr. Emily Rodriguez", email: "emily.r@college.edu" }
                ]);
            } else {
                setTeachers(teacherList);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    const getChatId = (userId1, userId2) => {
        return [userId1, userId2].sort().join("_");
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedTeacher) return;

        const chatId = getChatId(currentUser.uid, selectedTeacher.id);

        try {
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage,
                senderId: currentUser.uid,
                senderName: currentUser.displayName,
                timestamp: serverTimestamp()
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="chat-container">
                <div className="loading">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-sidebar glass-panel">
                <h2>Mentors</h2>
                <div className="teacher-list">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className={`teacher-item ${selectedTeacher?.id === teacher.id ? 'active' : ''}`}
                            onClick={() => setSelectedTeacher(teacher)}
                        >
                            <div className="teacher-avatar">
                                <FaUser />
                            </div>
                            <div className="teacher-info">
                                <h4>{teacher.name}</h4>
                                <p>{teacher.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-main glass-panel">
                {selectedTeacher ? (
                    <>
                        <div className="chat-header">
                            <div className="teacher-avatar">
                                <FaUser />
                            </div>
                            <div>
                                <h3>{selectedTeacher.name}</h3>
                                <p className="status">Online</p>
                            </div>
                        </div>

                        <div className="messages-container">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        <p className="message-sender">{msg.senderName}</p>
                                        <p className="message-text">{msg.text}</p>
                                        <span className="message-time">
                                            {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="message-input-form" onSubmit={sendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="message-input"
                            />
                            <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="chat-empty">
                        <FaUser size={64} className="empty-icon" />
                        <h2>Select a Mentor</h2>
                        <p>Choose a teacher from the list to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
