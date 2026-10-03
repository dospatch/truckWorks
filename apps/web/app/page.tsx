"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Telemetry = Record<string, any>;

function pick(data: Telemetry | null, paths: string[], fallback: any = "—") {
  for (const path of paths) {
    const value = path.split(".").reduce((obj, key) => obj?.[key], data);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const telemetryUrl = "http://127.0.0.1:25555/api/ets2/telemetry";

const sections = [
  ["DRIVE", [["▶","Drive","/ats"],["🎙","Co-Driver","#"],["➤","Navigation","#"],["▣","Truck Health","/dashboard/telemetry"],["⚙","Under the Hood","#"],["⇅","Shift Coach","#"]]],
  ["WORK", [["⛟","Dispatch & BOL","#"],["▤","Trip History","#"],["▥","Earnings & Stats","#"],["📷","Journal","#"],["🏢","Company","/vtc"],["★","Career","#"]]],
  ["CONVOY", [["◉","Convoy Hub","#"],["◎","Convoy","#"],["🏆","Leaderboard","#"],["⌖","Convoy Radar","#"],["⚑","Convoy Sessions","#"],["✔","Convoy Pre-Flight","#"],["✦","Convoy Intelligence","#"],["⌘","Command Center","#"],["◉","Companion CB","#"]]],
  ["STREAM", [["🎥","Stream Studio","#"],["🎚","Mixer & OBS","#"]]],
  ["SETUP", [["⚠","Alerts & Discord","#alerts"],["▦","Dashboard Studio","#"],["◆","Mods","/dashboard/downloads"],["⚙","Settings","#"],["💡","Suggestions","/support"]]]
] as const;

export default function Home() {
  const [data, setData] = useState<Telemetry | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(telemetryUrl + "?truckworks_ts=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error();
      setData(await response.json());
    } catch {
      setData(null);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 1000);
    return () => window.clearInterval(timer);
  }, [load]);

  const connected = Boolean(pick(data, ["game.connected"], false)) &&
    String(pick(data, ["game.gameName"], "ATS")).toUpperCase().includes("ATS");

  const truck = [pick(data, ["truck.make"], ""), pick(data, ["truck.model"], "")].filter(Boolean).join(" ") || "—";
  const speed = num(pick(data, ["truck.speed"], null));
  const fuel = num(pick(data, ["truck.fuelAmount", "truck.fuel"], null));
  const rpm = num(pick(data, ["truck.rpm", "truck.engineRpm"], null));
  const job = pick(data, ["job.cargo"], "no job");
  const destination = pick(data, ["job.destinationCity", "job.destinationCityName"], "—");
  const source = pick(data, ["job.sourceCity", "job.sourceCityName"], "—");
  const distance = num(pick(data, ["navigation.estimatedDistance", "job.remainingDistanceKm"], null));

  return (
    <div className="companion">
      <aside className="companion-sidebar">
        <div className="companion-brand">
          <div className="brand-mark">BC</div>
          <div><strong>BC TRUCK WORKS</strong><small>ATS / ETS2 COMPANION</small></div>
        </div>
        <div className="version">LIVE COMPANION v1.0.0</div>

        <nav className="companion-nav">
          {sections.map(([title, items]) => (
            <div key={title} className="nav-section">
              <div className="nav-heading">{title}</div>
              {items.map(([icon, label, href]) =>
                href === "#" ? (
                  <button key={label} className="companion-link"><span>{icon}</span>{label}</button>
                ) : (
                  <Link key={label} href={href} className="companion-link"><span>{icon}</span>{label}</Link>
                )
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-game">
          <div className="mini-label">SIMULATOR</div>
          <strong>🇺🇸 American Truck Simulator</strong>
          <span className={connected ? "live-dot" : "offline-dot"}>● {connected ? "LIVE" : "OFFLINE"}</span>
        </div>
      </aside>

      <main className="companion-main">
        <header className="companion-header">
          <div><div className="crumb">BC TRUCK WORKS / DRIVE</div><h1>ATS Live Companion</h1></div>
          <div className={connected ? "connection live" : "connection"}><span>●</span> Telemetry {connected ? "LIVE" : "OFFLINE"}</div>
        </header>

        <div className="companion-content">
          {!connected && (
            <div className="telemetry-warning">
              <strong>Telemetry OFFLINE</strong>
              <span>Start your ATS telemetry server to populate live data.</span>
            </div>
          )}

          <section className="drive-hero">
            <div>
              <div className="eyebrow">AMERICAN TRUCK SIMULATOR</div>
              <h2>{connected ? "You're on the road." : "Waiting for your truck."}</h2>
              <p>{connected ? truck + " • " + source + " → " + destination : "BC TRUCK WORKS is ready to receive live ATS telemetry from this PC."}</p>
            </div>
            <Link href="/dashboard/telemetry" className="hero-action">Open Full Telemetry →</Link>
          </section>

          <section className="telemetry-grid">
            <article className="metric-card primary-metric"><div className="metric-label">SPEED</div><strong>{connected && speed !== null ? Math.round(speed) : "—"}</strong><small>MPH • Speed limit —</small></article>
            <article className="metric-card"><div className="metric-label">TRUCK</div><strong>{connected ? truck : "—"}</strong><small>Current vehicle</small></article>
            <article className="metric-card"><div className="metric-label">FUEL</div><strong>{connected && fuel !== null ? fuel.toFixed(1) : "—"}</strong><small>Current fuel</small></article>
            <article className="metric-card"><div className="metric-label">ENGINE RPM</div><strong>{connected && rpm !== null ? Math.round(rpm).toLocaleString() : "—"}</strong><small>Engine speed</small></article>
            <article className="metric-card"><div className="metric-label">TO DESTINATION</div><strong>{connected && distance !== null ? distance.toFixed(1) + " km" : "—"}</strong><small>{connected ? destination : "no job"}</small></article>
            <article className="metric-card"><div className="metric-label">ALERTS</div><strong>0</strong><small>Active alerts</small></article>
          </section>

          <div className="content-columns">
            <section className="panel" id="alerts">
              <div className="panel-header"><div><div className="eyebrow">ALERTS</div><h3>Active Alerts</h3></div><span className="clear-pill">● ALL CLEAR</span></div>
              <div className="alert-empty"><div className="alert-icon">✓</div><div><strong>No active alerts</strong><p>Drive safe. BC TRUCK WORKS will show truck, cargo, rest, speed, and deadline warnings here.</p></div></div>
              <div className="panel-divider" />
              <div className="panel-header compact"><h3>Alert History</h3><span>THIS SESSION</span></div>
              <p className="muted">No alerts this session.</p>
            </section>

            <section className="panel">
              <div className="eyebrow">CURRENT DELIVERY</div>
              <h3>{connected ? job : "No active job"}</h3>
              <div className="route-line"><span>{source}</span><b>→</b><span>{destination}</span></div>
              <div className="delivery-stats">
                <div><small>CARGO</small><strong>{connected ? job : "—"}</strong></div>
                <div><small>DISTANCE</small><strong>{distance !== null ? distance.toFixed(1) + " km" : "—"}</strong></div>
                <div><small>DEADLINE</small><strong>—</strong></div>
              </div>
              <Link href="/ats" className="panel-button">Open ATS Dashboard →</Link>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header"><div><div className="eyebrow">WORK</div><h3>Trip & Career Tools</h3></div><span className="muted">READY</span></div>
            <div className="tool-grid">
              {["⛟ Dispatch & BOL","▤ Trip History","▥ Earnings & Stats","📷 Driver Journal","🏢 Company","★ Career"].map(x => <button key={x} className="tool-card"><span>{x.slice(0,2)}</span><div><strong>{x.slice(3)}</strong><small>BC TRUCK WORKS</small></div></button>)}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header"><div><div className="eyebrow">CONVOY</div><h3>Convoy Command</h3></div><span className="muted">READY</span></div>
            <div className="tool-grid convoy-grid">
              {["◉ Convoy Hub","◎ Convoy","🏆 Leaderboard","⌖ Convoy Radar","⚑ Sessions","✔ Pre-Flight","✦ Intelligence","⌘ Command Center"].map(x => <button key={x} className="tool-card compact-tool"><span>{x.slice(0,2)}</span><strong>{x.slice(3)}</strong></button>)}
            </div>
          </section>

          <section className="panel setup-panel">
            <div><div className="eyebrow">SETUP</div><h3>Alerts, Discord & Driver Settings</h3><p>Configure notifications, Discord trip summaries, desktop alerts, voice dispatcher settings, telemetry thresholds, and dashboard preferences.</p></div>
            <div className="setup-actions"><Link href="/dashboard/telemetry" className="panel-button">Telemetry Settings</Link><Link href="/support" className="panel-button secondary">Support</Link></div>
          </section>
        </div>
      </main>
    </div>
  );
}
