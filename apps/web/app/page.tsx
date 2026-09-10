import Link from "next/link";
import { Navigation } from "./components/Navigation";

const features = [
  ["Server Management", "Register dedicated servers, monitor connectivity, and manage each server from one customer portal."],
  ["Licensing", "Keep licenses, activations, plans, and expiration details organized per server."],
  ["Downloads", "Give customers a central place for agents, resources, updates, and supported platform files."],
  ["VTC Tools", "Build VTC management into the same platform with member and fleet workflows ready for expansion."],
  ["Support", "Centralize support requests and platform help without mixing customer data between servers."],
  ["Admin Control", "Provide platform administrators with a dedicated control surface for customers, servers, and operations."],
];

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <section className="hero container">
          <div className="eyebrow">The Truck Simulation Platform</div>
          <h1>One platform for your servers, VTC, licenses, and trucking community.</h1>
          <p>BC TRUCK WORKS brings dedicated-server management, customer accounts, licensing, downloads, VTC tools, support, and administration into one modern platform.</p>
          <div className="hero-actions">
            <Link href="/register" className="btn primary">Create your account</Link>
            <Link href="/login" className="btn ghost">Customer login</Link>
          </div>
        </section>

        <section id="features" className="section container">
          <div className="section-title">
            <div className="eyebrow">Platform</div>
            <h2>Built for a multi-server future.</h2>
            <p>Each customer can manage their own servers while the platform keeps infrastructure, licensing, and account data separated.</p>
          </div>
          <div className="grid three">
            {features.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="section container">
          <div className="card" style={{ padding: 34 }}>
            <div className="eyebrow">Ready when you are</div>
            <h2 style={{ fontSize: 34, marginBottom: 10 }}>Start building your TruckWorks network.</h2>
            <p>Create an account now. Server registration, licensing, and the customer API will connect to the dashboard as the platform backend comes online.</p>
            <Link href="/register" className="btn primary">Get started</Link>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container">© {new Date().getFullYear()} BC TRUCK WORKS. All rights reserved.</div></footer>
    </>
  );
}
