import { ArrowRight, Bot, Database, GitBranch, ShieldCheck, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav.jsx";

export default function Landing({ auth, onLogout }) {
  return (
    <main>
      <Nav auth={auth} onLogout={onLogout} />

      <section className="hero">
        <div className="hero-background" aria-hidden="true">
          <div className="dashboard-surface">
            <div className="surface-header">
              <span />
              <span />
              <span />
            </div>
            <div className="surface-grid">
              <div className="surface-panel tall">
                <p>Lead Pipeline</p>
                <strong>128</strong>
                <div className="mini-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="surface-panel">
                <p>AI Replies</p>
                <strong>96%</strong>
              </div>
              <div className="surface-panel">
                <p>Automation</p>
                <strong>Live</strong>
              </div>
              <div className="surface-panel wide">
                <p>Workflow Events</p>
                <div className="event-line" />
                <div className="event-line short" />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-content">
          <p className="eyebrow">AI business automation platform</p>
          <h1>NexFlow Assistant</h1>
          <p className="hero-copy">
            Capture leads, answer customer questions, automate notifications, and give admins a secure command center.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={auth?.token ? "/chat" : "/signup"}>
              Start workflow
              <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to={auth?.token ? "/admin" : "/signin"}>
              Admin access
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-band">
        <article>
          <Bot size={24} />
          <h2>AI Chat</h2>
          <p>Gemini-powered answers for business, courses, and automation queries.</p>
        </article>
        <article>
          <Database size={24} />
          <h2>Lead Storage</h2>
          <p>SQLite persistence for captured prospects and callback requests.</p>
        </article>
        <article>
          <Workflow size={24} />
          <h2>Automation</h2>
          <p>Lead submissions trigger backend workflow logging and notification hooks.</p>
        </article>
        <article>
          <ShieldCheck size={24} />
          <h2>JWT Auth</h2>
          <p>Protected chat and admin routes with role-aware dashboard access.</p>
        </article>
        <article>
          <GitBranch size={24} />
          <h2>DevOps</h2>
          <p>Docker, Jenkins, and GitHub Actions support for deployment readiness.</p>
        </article>
      </section>
    </main>
  );
}
