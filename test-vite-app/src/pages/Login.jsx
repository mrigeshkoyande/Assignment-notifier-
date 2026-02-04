import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

function Login() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/role-select");
        } catch (error) {
            console.error("Login error:", error);
            alert("Failed to login. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="login-header">
                    <h1 className="login-title">College Management System</h1>
                    <p className="login-subtitle">
                        Unified platform for Assignments, Attendance, and Mentorship
                    </p>
                </div>

                <button className="btn-google" onClick={handleLogin}>
                    <FcGoogle size={24} />
                    <span>Sign in with Google</span>
                </button>

                <div className="login-footer">
                    <p>Secure authentication powered by Firebase</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
