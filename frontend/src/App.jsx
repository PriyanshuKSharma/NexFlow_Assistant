import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { clearAuth, getStoredAuth } from "./api";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Landing from "./pages/Landing.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

function ProtectedRoute({ children, adminOnly = false }) {
  const auth = getStoredAuth();
  if (!auth?.token) {
    return <Navigate to="/signin" replace />;
  }
  if (adminOnly && auth.user?.role !== "admin") {
    return <Navigate to="/chat" replace />;
  }
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const auth = getStoredAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("nexflow_theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nexflow_theme", theme);
  }, [theme]);

  function logout() {
    clearAuth();
    navigate("/");
  }

  return (
    <>
      <button
        className="theme-toggle"
        type="button"
        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to black theme"}
        title={theme === "dark" ? "Light theme" : "Black theme"}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        <span>{theme === "dark" ? "Light theme" : "Black theme"}</span>
      </button>

      <Routes>
        <Route path="/" element={<Landing auth={auth} onLogout={logout} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat auth={auth} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard auth={auth} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
