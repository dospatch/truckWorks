import { DashboardShell } from "../components/DashboardShell";

export default function DashboardPage() {
  return <DashboardShell title="Dashboard">
    <div className="section-title"><div className="eyebrow">Customer Portal</div><h2>Welcome to BC TRUCK WORKS.</h2><p>Your account overview will become the control center for every server and service you own.</p></div>
    <div className="grid three">
      <article className="card stat"><div><div className="kicker">Servers</div><strong>0</strong><div className="kicker">No servers registered yet</div></div><span className="badge warning">Setup</span></article>
      <article className="card stat"><div><div className="kicker">Licenses</div><strong>0</strong><div className="kicker">No active licenses</div></div><span className="badge warning">Setup</span></article>
      <article className="card stat"><div><div className="kicker">Support</div><strong>0</strong><div className="kicker">Open support requests</div></div><span className="badge">Ready</span></article>
    </div>
    <div className="section"><div className="grid two"><article className="card"><h3>Next step</h3><p>Register your first dedicated server. The backend will later issue an agent identity and connect its heartbeat to this dashboard.</p><a className="btn primary" href="/dashboard/servers">Manage servers</a></article><article className="card"><h3>Platform status</h3><p>Customer portal foundation is online. API, authentication, licensing, and server-agent connectivity are being connected in the next phase.</p><span className="badge">Foundation online</span></article></div></div>
  </DashboardShell>;
}
