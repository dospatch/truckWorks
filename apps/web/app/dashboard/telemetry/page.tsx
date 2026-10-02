"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "../../components/DashboardShell";

type Telemetry = Record<string, any>;

function pick(data: Telemetry, paths: string[], fallback = "—") {
  for (const path of paths) {
    const value = path.split(".").reduce((obj, key) => obj?.[key], data);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function numberValue(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function TelemetryPage() {
  const [data, setData] = useState<Telemetry | null>(null);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [source, setSource] = useState("http://127.0.0.1:25555/api/ets2/telemetry");

  useEffect(() => {
    const saved = window.localStorage.getItem("truckworks.telemetryUrl");
    if (saved) setSource(saved);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(source + (source.includes("?") ? "&" : "?") + "truckworks_ts=" + Date.now(), {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Telemetry server returned HTTP " + response.status);
        const payload = await response.json();
        setData(payload);
        setError("");
        setLastUpdate(new Date());
      } catch (err: any) {
        setError(err?.message || "Unable to reach local telemetry server.");
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [source]);

  const gameName = String(pick(data || {}, ["game.gameName", "game.name"], "ATS / ETS2"));
  const connected = Boolean(pick(data || {}, ["game.connected"], false));
  const speed = numberValue(pick(data || {}, ["truck.speed", "truck.speedKph"], null));
  const rpm = numberValue(pick(data || {}, ["truck.engineRpm", "truck.rpm"], null));
  const fuel = numberValue(pick(data || {}, ["truck.fuel", "truck.fuelAmount"], null));
  const fuelCapacity = numberValue(pick(data || {}, ["truck.fuelCapacity"], null));
  const truck = [pick(data || {}, ["truck.make"], ""), pick(data || {}, ["truck.model"], "")].filter(Boolean).join(" ") || "Truck not detected";
  const jobSource = pick(data || {}, ["job.sourceCity", "job.sourceCityName"], "—");
  const jobDestination = pick(data || {}, ["job.destinationCity", "job.destinationCityName"], "—");
  const cargo = pick(data || {}, ["job.cargo"], "—");
  const cargoMass = numberValue(pick(data || {}, ["job.cargoMass"], null));
  const routeDistance = numberValue(pick(data || {}, ["job.remainingDistanceKm", "job.remainingDistance"], null));
  const damage = numberValue(pick(data || {}, ["truck.damage", "truck.damageCabin"], null));

  const speedDisplay = useMemo(() => {
    if (speed === null) return "—";
    return Math.round(speed);
  }, [speed]);

  function saveSource() {
    window.localStorage.setItem("truckworks.telemetryUrl", source);
    setError("");
  }

  return (
    <DashboardShell title="Live Telemetry">
      <div className="section-title">
        <div className="eyebrow">ATS / ETS2</div>
        <h2>Live truck telemetry</h2>
        <p>Real-time data from the simulator running on this computer. This is not demo data.</p>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="grid two">
          <div>
            <div className="kicker">Telemetry source</div>
            <input value={source} onChange={(e) => setSource(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: 10 }}>
            <button className="btn primary" onClick={saveSource}>Save source</button>
            <span className={"badge " + (connected ? "" : "warning")}>
              {connected ? "● LIVE" : "○ WAITING"}
            </span>
          </div>
        </div>
        {error && <p style={{ color: "#ff9b7a", marginBottom: 0 }}>Telemetry connection: {error}</p>}
      </div>

      <div className="grid three">
        <article className="card stat"><div><div className="kicker">Game</div><strong>{gameName}</strong><div className="kicker">{connected ? "Connected" : "Not connected"}</div></div><span className="badge">{connected ? "LIVE" : "OFFLINE"}</span></article>
        <article className="card stat"><div><div className="kicker">Truck</div><strong>{truck}</strong><div className="kicker">Detected from telemetry</div></div><span className="badge">Truck</span></article>
        <article className="card stat"><div><div className="kicker">Speed</div><strong>{speedDisplay}</strong><div className="kicker">Telemetry speed value</div></div><span className="badge">Live</span></article>
      </div>

      <div className="section">
        <div className="grid three">
          <article className="card"><div className="kicker">Engine RPM</div><h3>{rpm === null ? "—" : Math.round(rpm).toLocaleString()}</h3><p>Current engine revolutions.</p></article>
          <article className="card"><div className="kicker">Fuel</div><h3>{fuel === null ? "—" : fuel.toFixed(1)}</h3><p>{fuelCapacity === null ? "Fuel telemetry value" : "Capacity: " + fuelCapacity.toFixed(1)}</p></article>
          <article className="card"><div className="kicker">Truck damage</div><h3>{damage === null ? "—" : (damage * 100).toFixed(1) + "%"}</h3><p>Reported vehicle damage when available.</p></article>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <div className="section-title">
            <div className="eyebrow">CURRENT JOB</div>
            <h2>{jobSource} → {jobDestination}</h2>
            <p>{cargo}{cargoMass !== null ? " · " + cargoMass.toLocaleString() + " kg" : ""}{routeDistance !== null ? " · " + routeDistance.toFixed(1) + " km remaining" : ""}</p>
          </div>
          <div className="list">
            <div className="list-row"><div><strong>Last telemetry update</strong><small>{lastUpdate ? lastUpdate.toLocaleTimeString() : "Waiting for telemetry..."}</small></div><span className="badge">{connected ? "Receiving" : "Waiting"}</span></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <div className="eyebrow">WHAT THIS CONNECTS</div>
          <h3>Actual game data</h3>
          <p>The telemetry bridge is designed to read the SCS telemetry stream and can expose truck identity, speed, RPM, fuel, job information, cargo, route data, damage, game connection state, and other telemetry fields supplied by the simulator.</p>
          <p className="kicker">For company-wide driver statistics, each driver/server installation needs its own authenticated TruckWorks agent so their telemetry can be recorded centrally.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
