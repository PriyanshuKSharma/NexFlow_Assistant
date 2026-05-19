import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { apiRequest, storeAuth } from "../api";

export default function Signin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await apiRequest("/auth/signin", {
        method: "POST",
        body: JSON.stringify(form),
      });
      storeAuth(auth);
      navigate(auth.user?.role === "admin" ? "/admin" : "/chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-icon">
          <LogIn size={24} />
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to continue your automation workflow.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="button primary full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          New to NexFlow? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}
