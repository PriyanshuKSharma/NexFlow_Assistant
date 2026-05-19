import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react";
import { apiRequest, storeAuth } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });
      storeAuth(auth);
      navigate("/chat");
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
          <UserPlus size={24} />
        </div>
        <h1>Create your NexFlow account</h1>
        <p>The first registered account becomes the admin for the dashboard.</p>
        <form onSubmit={submit}>
          <label>
            Full name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="button primary full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
            <ArrowRight size={18} />
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
