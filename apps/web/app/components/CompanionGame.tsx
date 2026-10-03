"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CompanionShell } from "./CompanionShell";

type T = Record<string, any>;
const TELEMETRY_URL = "http://127.0.0.1:25555/api/ets2/telemetry";

function pick(d: T | null, paths: string[], fallback: any = "—") {
  for (const path of paths) {
    const value = path.split(".").reduce((o, key) => o?.[key], d);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}
function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function CompanionGame({ game }: { game: "ATS" | "ETS2" }) {
  const [data, setData] = useState<T | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(TELEMETRY_URL + "?bc_ts=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("telemetry");
      const payload = await response.json();
      setData(payload);
      setLive(Boolean(payload?.game?.connected) && String(payload?.game?.gameName || "").toUpperCase().includes(game));
    } catch {
      setLive(false);
    }
  }, [game]);

  useEffect(() => {
    load();
    if (paused) return;
    const timer = window.setInterval(load, 1000);
    return () => window.clearInterval(timer);
  }, [load, paused]);

  const values = useMemo(() => {
    const truck = [pick(data, ["truck.make"], ""), pick(data, ["truck.model"], "")].filter(Boolean).join(" ") || "—";
    return {
      truck,
      speed: num(pick(data, ["truck.speed"], null)),
      limit: num(pick(data, ["navigation.speedLimit", "truck.speedLimit"], null)),
      fuel: num(pick(data, ["truck.fuelAmount", "truck.fuel"], null)),
      rpm: num(pick(data, ["truck.rpm", "truck.engineRpm"], null)),
      gear: pick(data, ["truck.gear", "truck.gearDisplay"], "0"),
      damage: num(pick(data, ["truck.damage"], null)),
      source: pick(data, ["job.sourceCity", "job.sourceCityName"], "—"),
      destination: pick(data, ["job.destinationCity", "job.destinationCityName"], "—"),
      cargo: pick(data, ["job.cargo", "job.cargoName"], "—"),
      distance: num(pick(data, ["navigation.estimatedDistance", "job.remainingDistanceKm"], null)),
      income: num(pick(data, ["job.income", "job.revenue"], null))
    };
  }, [data]);

  const gameName = game === "ATS" ? "American Truck Simulator" : "Euro Truck Simulator 2";
  const units = game === "ATS" ? "MPH" : "KM/H";

  return (
    <CompanionShell game={game}>
      <div className="companion-content">
        <div className="telemetry-status-row">
          <div className={live ? "live-status" : "offline-status"}>● TELEMETRY {live ? "LIVE" : "OFFLINE"}</div>
          <button className="small-action" onClick={() => setPaused(!paused)}>{paused ? "Resume stream" : "Pause stream"}</button>
        </div>

        {!live && <div className="telemetry-warning"><strong>WAITING FOR {game}</strong><span>Start your local SCS telemetry stream and BC TRUCK WORKS will populate this dashboard automatically.</span></div>}

        <section className="drive-hero">
          <div><div className="eyebrow">{gameName.toUpperCase()} • LIVE COMPANION</div><h2>{live ? values.truck : "WAITING FOR " + game}</h2><p>{live ? values.source + " → " + values.destination : "Your truck, trip, fuel and route data will appear here."}</p></div>
          <div className="hero-actions-stack"><Link href="/dashboard/telemetry" className="hero-action">Telemetry Setup →</Link><Link href={game === "ATS" ? "/ets2" : "/ats"} className="hero-action secondary">{game === "ATS" ? "Open ETS2" : "Open ATS"}</Link></div>
        </section>

        <section className="telemetry-grid">
          {[
            ["SPEED", live && values.speed !== null ? Math.round(values.speed) + " " + units : "—", "Current speed"],
            ["SPEED LIMIT", live && values.limit !== null ? Math.round(values.limit) + " " + units : "—", "Road limit"],
            ["FUEL", live && values.fuel !== null ? values.fuel.toFixed(1) : "—", game === "ATS" ? "Gallons" : "Liters"],
            ["RPM", live && values.rpm !== null ? Math.round(values.rpm).toLocaleString() : "—", "Engine speed"],
            ["GEAR", live ? String(values.gear) : "—", "Current gear"],
            ["TO DESTINATION", live && values.distance !== null ? values.distance.toFixed(1) + " km" : "—", live ? values.destination : "No active job"]
          ].map(([label,value,sub]) => <article className="metric-card" key={label}><div className="metric-label">{label}</div><strong>{value}</strong><small>{sub}</small></article>)}
        </section>

        <div className="content-columns">
          <section className="panel"><div className="panel-header"><div><div className="eyebrow">CURRENT DELIVERY</div><h3>{live ? values.cargo : "No active job."}</h3></div><span className="clear-pill">{live ? "IN PROGRESS" : "STANDBY"}</span></div><div className="route-line"><span>{values.source}</span><b>→</b><span>{values.destination}</span></div><div className="delivery-stats"><div><small>CARGO</small><strong>{live ? values.cargo : "—"}</strong></div><div><small>DISTANCE</small><strong>{values.distance !== null ? values.distance.toFixed(1) + " km" : "—"}</strong></div><div><small>INCOME</small><strong>{values.income !== null ? "$" + values.income.toLocaleString() : "$0"}</strong></div></div></section>

          <section className="panel"><div className="eyebrow">ALERTS</div><div className="alert-empty"><div className="alert-icon">✓</div><div><strong>0 active alerts</strong><p>BC TRUCK WORKS will surface speeding, fuel, damage and route warnings here.</p></div></div><div className="panel-divider" /><div className="panel-header compact"><h3>Smart Shift</h3><span>READY</span></div><p className="muted">Gearbox data will be used to provide shift coaching when available.</p></section>
        </div>

        <div className="content-columns">
          <section className="panel"><div className="eyebrow">TRUCK</div><div className="truck-preview"><div className="truck-photo">{photo ? <img src={photo} alt="Stored truck" /> : <span>🚛</span>}</div><div><strong>{live ? values.truck : "Truck not detected"}</strong><small>Stored locally in this browser for the detected truck.</small></div><label className="panel-button secondary upload-button">Choose photo<input type="file" accept="image/*" onChange={e => { const f=e.target.files?.[0]; if(f){const reader=new FileReader();reader.onload=()=>setPhoto(String(reader.result));reader.readAsDataURL(f);}}} /></label></div></section>

          <section className="panel"><div className="eyebrow">TRUCK HEALTH</div><div className="health-list"><div><span>Telemetry</span><b>{live ? "RECEIVING" : "OFFLINE"}</b></div><div><span>Engine RPM</span><b>{values.rpm !== null ? Math.round(values.rpm).toLocaleString() : "—"}</b></div><div><span>Damage</span><b>{values.damage !== null ? (values.damage * 100).toFixed(1) + "%" : "—"}</b></div><div><span>Fuel</span><b>{values.fuel !== null ? values.fuel.toFixed(1) : "—"}</b></div></div></section>
        </div>

        <section className="panel"><div className="panel-header"><div><div className="eyebrow">TRIP LOGGER</div><h3>Active Trip</h3></div><span className="muted">STANDBY</span></div><div className="trip-grid">{[["TRIP TIME","0:00"],["CARGO",live ? values.cargo : "—"],["ROUTE",live ? values.source + " → " + values.destination : "—"],["MILES","0.0 mi"],["FUEL USED","0.0 gal"],["MAX SPEED","0 " + units],["SPEEDING","0:00"],["NAVIGATION",values.distance !== null ? values.distance.toFixed(1) + " km" : "0.0 mi"],["INCOME",values.income !== null ? "$" + values.income.toLocaleString() : "$0"]].map(([label,value])=><div className="trip-stat" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></section>

        <section className="panel"><div className="panel-header"><div><div className="eyebrow">QUICK SYSTEMS</div><h3>Vehicle Controls</h3></div><span className="muted">TELEMETRY VIEW</span></div><div className="systems-grid">{["Parking","Low Beam","High Beam","Left Signal","Right Signal","Hazards","Beacon","Brake Lights"].map(item => <div className="system-toggle" key={item}><span>{item}</span><b>OFF</b></div>)}</div></section>

        <section className="panel setup-panel"><div><div className="eyebrow">BC TRUCK WORKS</div><h3>Driver Companion Systems</h3><p>Dispatch, navigation, trip history, earnings, alerts, Discord summaries, voice dispatch and convoy tools all live inside one control center.</p></div><div className="setup-actions"><Link href="/companion/dispatch" className="panel-button">Open Dispatch</Link><Link href="/companion/settings" className="panel-button secondary">Settings</Link></div></section>
      </div>
    </CompanionShell>
  );
}
