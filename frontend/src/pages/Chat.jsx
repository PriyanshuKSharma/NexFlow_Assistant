import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { apiRequest } from "../api";
import Nav from "../components/Nav.jsx";

const initialMessages = [
  {
    role: "assistant",
    content: "Hi, I am NexFlow Assistant. Ask me about automation, AI workflows, CRM, courses, or software execution.",
  },
];

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function MessageContent({ content }) {
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  const blocks = [];
  let listItems = [];
  let listType = null;

  function flushList() {
    if (!listItems.length) return;
    const ListTag = listType === "ordered" ? "ol" : "ul";
    blocks.push(
      <ListTag key={`list-${blocks.length}`}>
        {listItems.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ListTag>
    );
    listItems = [];
    listType = null;
  }

  lines.forEach((line) => {
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    const bulletMatch = line.match(/^[-*]\s+(.*)$/);

    if (orderedMatch) {
      if (listType && listType !== "ordered") flushList();
      listType = "ordered";
      listItems.push(orderedMatch[2]);
      return;
    }

    if (bulletMatch) {
      if (listType && listType !== "bullet") flushList();
      listType = "bullet";
      listItems.push(bulletMatch[1]);
      return;
    }

    flushList();
    blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
  });

  flushList();

  return <div className="message-content">{blocks}</div>;
}

export default function Chat({ auth, onLogout }) {
  const [messages, setMessages] = useState(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [lead, setLead] = useState({ name: "", email: "", phone: "", interest: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt.trim() };
    setMessages((current) => [...current, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const data = await apiRequest("/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content }),
      });
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((current) => [...current, { role: "assistant", content: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(event) {
    event.preventDefault();
    setStatus("");
    try {
      await apiRequest("/leads", {
        method: "POST",
        body: JSON.stringify(lead),
      });
      setLead({ name: "", email: "", phone: "", interest: "" });
      setStatus("Lead captured successfully. Our team will follow up shortly.");
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <main>
      <Nav auth={auth} onLogout={onLogout} />
      <section className="workspace">
        <div className="chat-shell">
          <div className="section-heading">
            <Sparkles size={22} />
            <div>
              <h1>AI Chatbot</h1>
              <p>Signed in as {auth?.user?.name}</p>
            </div>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                <MessageContent content={message.content} />
              </div>
            ))}
            {loading && <div className="message assistant">Thinking...</div>}
          </div>

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask about business automation..."
            />
            <button type="submit" aria-label="Send message">
              <Send size={19} />
            </button>
          </form>
        </div>

        <aside className="lead-panel">
          <h2>Request a callback</h2>
          <p>Capture a lead and trigger the backend automation workflow.</p>
          <form onSubmit={submitLead}>
            <input placeholder="Full name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} required />
            <input
              type="email"
              placeholder="Email address"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              required
            />
            <input placeholder="Phone" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
            <textarea
              placeholder="What are you interested in?"
              value={lead.interest}
              onChange={(e) => setLead({ ...lead, interest: e.target.value })}
            />
            <button className="button primary full" type="submit">
              Submit lead
            </button>
          </form>
          {status && <p className="status">{status}</p>}
        </aside>
      </section>
    </main>
  );
}
