import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="card auth-card">
        <Link href="/" className="brand">BC <span>TRUCK WORKS</span></Link>
        <h1>Welcome back</h1>
        <p className="kicker">Sign in to manage your servers, licenses, downloads, and VTC tools.</p>
        <form className="form">
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" placeholder="you@example.com" required /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" placeholder="••••••••" required /></div>
          <button className="btn primary" type="submit">Sign in</button>
        </form>
        <div className="auth-footer">Need an account? <Link href="/register" style={{ color: "var(--accent)" }}>Create one</Link></div>
      </section>
    </main>
  );
}
