import Link from "next/link";
import { Navigation } from "../components/Navigation";

export default function ServersPage() {
  return <><Navigation /><main className="section container"><div className="section-title"><div className="eyebrow">Server Network</div><h1 style={{ fontSize: 48 }}>Manage your dedicated servers.</h1><p>Customer-owned servers will connect through the TruckWorks agent and appear in a secure management portal.</p></div><div className="grid three"><article className="card"><h3>Register</h3><p>Add a supported server to your account and prepare its agent connection.</p></article><article className="card"><h3>Monitor</h3><p>See connection health, agent version, player data, and service status.</p></article><article className="card"><h3>Protect</h3><p>Server identities and licenses are scoped to the owning customer account.</p></article></div><div style={{ marginTop: 24 }}><Link href="/register" className="btn primary">Create a customer account</Link></div></main></>;
}
