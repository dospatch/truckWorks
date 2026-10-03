import Link from "next/link";
import { CompanionShell } from "../../components/CompanionShell";

export default function Page() {
  return <CompanionShell game="GENERAL"><div className="companion-content">
    <div className="tool-page-hero"><div className="eyebrow">BC TRUCK WORKS / COMPANION</div><h2>Driver Journal</h2><p>Control and monitor your trucking operations from the BC TRUCK WORKS live companion.</p></div>
    <section className="panel"><div className="eyebrow">SYSTEM READY</div><h3>Driver Journal</h3><p className="muted">This companion module is connected to the BC TRUCK WORKS interface and ready for live simulator data.</p><div className="tool-page-actions"><Link className="panel-button" href="/ats">ATS</Link><Link className="panel-button secondary" href="/ets2">ETS2</Link><Link className="panel-button secondary" href="/dashboard/telemetry">Telemetry</Link></div></section>
  </div></CompanionShell>;
}
