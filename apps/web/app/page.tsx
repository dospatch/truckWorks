import Link from "next/link";
import { Navigation } from "./components/Navigation";

const features = [
  { icon: "🌐", title: "Server Network", text: "Manage dedicated ATS and ETS2 servers, monitor connections, and keep your trucking network organized." },
  { icon: "🚛", title: "VTC Management", text: "Build your VTC community with driver management, recruitment, fleet tools, and member workflows." },
  { icon: "📦", title: "Mod Database", text: "Give your community one place to discover trucks, trailers, maps, skins, accessories, and other resources." },
  { icon: "📥", title: "Downloads", text: "Keep official TruckWorks files, server agents, resources, updates, and community downloads together." },
  { icon: "📅", title: "Convoys & Events", text: "Promote upcoming convoys and events so drivers always know what is happening next." },
  { icon: "🛠️", title: "Support", text: "Centralize support and platform assistance while keeping customer and server information separated." },
];

const stats = [
  ["🌎", "ATS + ETS2", "Built for the trucking community"],
  ["🚛", "Multi-server", "Designed to scale with your network"],
  ["🔐", "Customer portal", "One account for your TruckWorks services"],
  ["⚡", "Modern platform", "Website, API, agents, and tools"],
];

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <section className="hero hero-home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">🚛 The Truck Simulation Platform</div>
              <h1>Run your trucking community from <span>one platform.</span></h1>
              <p className="hero-lead">
                BC TRUCK WORKS brings servers, VTCs, mods, downloads, convoys,
                support, and customer tools together in one platform built for
                American Truck Simulator and Euro Truck Simulator 2 communities.
              </p>
              <div className="hero-actions">
                <Link href="/register" className="btn primary">🚛 Create your account</Link>
                <Link href="/servers" className="btn ghost">🌐 Explore servers</Link>
              </div>
              <div className="hero-note">Built for drivers. Built for VTCs. Built for growing trucking communities.</div>
            </div>
            <div className="hero-panel">
              <div className="panel-topline"><span className="status-dot" /> TruckWorks Network</div>
              <div className="network-title">Your trucking world.<br /><strong>All in one place.</strong></div>
              <div className="network-row"><span>🌎</span><div><strong>American Truck Simulator</strong><small>Servers • VTCs • Mods • Convoys</small></div><b>›</b></div>
              <div className="network-row"><span>🇪🇺</span><div><strong>Euro Truck Simulator 2</strong><small>Servers • VTCs • Mods • Convoys</small></div><b>›</b></div>
              <div className="network-footer"><span>🟢 Platform online</span><span>BC TRUCK WORKS</span></div>
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container stats-grid">
            {stats.map(([icon, title, text]) => (
              <div className="stat-mini" key={title}><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>
            ))}
          </div>
        </section>

        <section id="platform" className="section container">
          <div className="section-title centered">
            <div className="eyebrow">Everything connected</div>
            <h2>More than a website.</h2>
            <p>TruckWorks is being built as a complete platform for trucking communities and server owners.</p>
          </div>
          <div className="grid three feature-grid">
            {features.map((feature) => (
              <article className="card feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-arrow">Explore →</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section network-section">
          <div className="container split-section">
            <div>
              <div className="eyebrow">🌐 Server network</div>
              <h2>Your servers.<br /><span>Your network.</span></h2>
              <p>Give every server its own identity while managing your entire network from a single customer portal.</p>
              <div className="check-list">
                <div>✓ Dedicated server registration</div>
                <div>✓ Server connection monitoring</div>
                <div>✓ Player and server status</div>
                <div>✓ Licensing and activations</div>
              </div>
              <Link href="/dashboard/servers" className="btn primary">Manage servers</Link>
            </div>
            <div className="network-card card">
              <div className="network-card-header"><div><small>SERVER NETWORK</small><h3>TruckWorks Fleet</h3></div><span className="badge">ONLINE</span></div>
              <div className="server-preview"><span className="server-icon">🇺🇸</span><div><strong>American Haulers</strong><small>American Truck Simulator</small></div><span className="online-pill">● Online</span></div>
              <div className="server-preview"><span className="server-icon">🇪🇺</span><div><strong>Euro Freight Network</strong><small>Euro Truck Simulator 2</small></div><span className="online-pill">● Online</span></div>
              <div className="server-preview muted-row"><span className="server-icon">🚛</span><div><strong>Add your server</strong><small>Connect another dedicated server</small></div><b>+</b></div>
            </div>
          </div>
        </section>

        <section className="section container cta-section">
          <div className="cta-card">
            <div className="eyebrow">Ready to haul?</div>
            <h2>Build your TruckWorks network.</h2>
            <p>Create your account and get ready for servers, VTCs, downloads, events, and everything else coming to the platform.</p>
            <div className="hero-actions"><Link href="/register" className="btn primary">Create your account</Link><Link href="/support" className="btn ghost">Contact support</Link></div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container footer-inner"><div><strong>BC TRUCK WORKS</strong><span>© {new Date().getFullYear()} BC TRUCK WORKS. All rights reserved.</span></div><div className="footer-links"><Link href="/servers">Servers</Link><Link href="/vtc">VTC</Link><Link href="/dashboard/downloads">Downloads</Link><Link href="/support">Support</Link></div></div></footer>
    </>
  );
}
