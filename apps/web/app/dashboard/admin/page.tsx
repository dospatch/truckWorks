import { DashboardShell } from "../../components/DashboardShell";

export default function AdminPage() {
  return <DashboardShell title="Admin Panel">
    <div className="section-title"><div className="eyebrow">Platform Operations</div><h2>Administration</h2><p>Restricted controls for platform administrators will live here.</p></div>
    <div className="grid three"><article className="card"><h3>Customers</h3><p>Review customer accounts, roles, status, and service ownership.</p><span className="badge">Planned</span></article><article className="card"><h3>Servers</h3><p>Monitor all registered customer servers and agent connectivity.</p><span className="badge">Planned</span></article><article className="card"><h3>Licenses</h3><p>Manage plans, activations, expirations, and license assignments.</p><span className="badge">Planned</span></article></div>
  </DashboardShell>;
}
