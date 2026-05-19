import { useEffect, useState } from "react";
import { Download, LayoutDashboard, RefreshCcw } from "lucide-react";
import { apiRequest } from "../api";
import Nav from "../components/Nav.jsx";

export default function AdminDashboard({ auth, onLogout }) {
  const [data, setData] = useState({ leads: [], metrics: {} });
  const [error, setError] = useState("");

  async function loadLeads() {
    setError("");
    try {
      setData(await apiRequest("/admin/leads"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  function downloadCsv() {
    const headers = ["id", "name", "email", "phone", "interest", "status", "created_at"];
    const rows = data.leads.map((lead) => headers.map((header) => JSON.stringify(lead[header] || "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexflow_leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <Nav auth={auth} onLogout={onLogout} />
      <section className="admin-page">
        <div className="section-heading">
          <LayoutDashboard size={24} />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Lead intelligence and callback queue.</p>
          </div>
        </div>

        <div className="metrics-row">
          <div>
            <span>Total leads</span>
            <strong>{data.metrics.total_leads || 0}</strong>
          </div>
          <div>
            <span>New leads</span>
            <strong>{data.metrics.new_leads || 0}</strong>
          </div>
          <div>
            <span>Admin</span>
            <strong>{data.metrics.admin || auth?.user?.email}</strong>
          </div>
        </div>

        <div className="table-actions">
          <button className="button secondary" type="button" onClick={loadLeads}>
            <RefreshCcw size={17} />
            Refresh
          </button>
          <button className="button primary" type="button" onClick={downloadCsv} disabled={!data.leads.length}>
            <Download size={17} />
            Export CSV
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Interest</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || "-"}</td>
                  <td>{lead.interest || "-"}</td>
                  <td>{lead.status}</td>
                  <td>{new Date(lead.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!data.leads.length && (
                <tr>
                  <td colSpan="6">No leads captured yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
