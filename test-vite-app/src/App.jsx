import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import RoleSelect from "./pages/RoleSelect";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!userRole) {
    return <Navigate to="/role-select" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser, userRole } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            userRole ? (
              <Navigate to={`/${userRole}-dashboard`} replace />
            ) : (
              <Navigate to="/role-select" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/role-select"
        element={
          currentUser ? (
            userRole ? (
              <Navigate to={`/${userRole}-dashboard`} replace />
            ) : (
              <RoleSelect />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/student-dashboard/*"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-dashboard/*"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
