import Link from "next/link";
import { DashboardShell } from "../components/DashboardShell";

export default function DashboardPage() {
  return <DashboardShell title="Dashboard">
    <div className="section-title">
      <div className="eyebrow">Operations Center</div>
      <h2>BC TRUCK WORKS Dashboard</h2>
      <p>Your control center for ATS, ETS2, servers, VTC services, and live simulator telemetry.</p>
    </div>

    <div className="grid three">
      <article className="card stat"><div><div className="kicker">Live telemetry</div><strong>ATS / ETS2</strong><div className="kicker">Connect your simulator on this PC</div></div><span className="badge">Ready</span></article>
      <article className="card stat"><div><div className="kicker">Servers</div><strong>0</strong><div className="kicker">Register a TruckWorks server</div></div><span className="badge warning">Setup</span></article>
      <article className="card stat"><div><div className="kicker">Platform</div><strong>ONLINE</strong><div className="kicker">Web platform is deployed</div></div><span className="badge">Online</span></article>
    </div>

    <div className="section">
      <div className="grid two">
        <article className="card">
          <div className="eyebrow">LIVE SIMULATOR</div>
          <h3>See your actual truck data</h3>
          <p>Open Live Telemetry to read speed, truck, RPM, fuel, job, cargo, route, and other values directly from ATS or ETS2.</p>
          <Link className="btn primary" href="/dashboard/telemetry">Open Live Telemetry</Link>
        </article>
        <article className="card">
          <div className="eyebrow">COMPANY NETWORK</div>
          <h3>Connect your drivers</h3>
          <p>Once servers and agents are registered, telemetry can be synchronized into the TruckWorks API for centralized driver and fleet statistics.</p>
          <Link className="btn ghost" href="/dashboard/servers">Manage servers</Link>
        </article>
      </div>
    </div>
  </DashboardShell>;
}
