import { Link, NavLink } from "react-router-dom";
import { Bot, LayoutDashboard, LogOut, MessageSquare, ShieldCheck } from "lucide-react";

export default function Nav({ auth, onLogout }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">
          <Bot size={20} />
        </span>
        <span>NexFlow</span>
      </Link>

      <nav className="nav-links">
        {auth?.token ? (
          <>
            <NavLink to="/chat">
              <MessageSquare size={17} />
              Chat
            </NavLink>
            {auth.user?.role === "admin" && (
              <NavLink to="/admin">
                <LayoutDashboard size={17} />
                Admin
              </NavLink>
            )}
            <button className="ghost-button" type="button" onClick={onLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/signin">
              <ShieldCheck size={17} />
              Sign in
            </NavLink>
            <Link className="primary-link" to="/signup">
              Create account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
