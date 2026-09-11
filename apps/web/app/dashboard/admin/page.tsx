"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardShell";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const types = [
  ["server_recruitment", "🚛 Server Recruitment"],
  ["convoy", "🚦 Convoy Updates"],
  ["vtc_recruitment", "👥 VTC Recruitment"],
  ["changelog", "📋 Changelog"],
  ["maintenance", "🔧 Maintenance"],
] as const;

type Setting = { post_type: string; enabled: boolean; interval_hours: number; channel_ids: string[]; message: string | null };

export default function AdminPage() {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [status, setStatus] = useState("Loading admin controls…");

  useEffect(() => {
    fetch(`${API}/api/admin/autopost`, { credentials: "include" })
      .then(async r => { if (!r.ok) throw new Error("Administrator access required."); return r.json(); })
      .then(data => { setSettings(Object.fromEntries((data.settings || []).map((s: Setting) => [s.post_type, s]))); setStatus("Auto-post settings loaded."); })
      .catch(e => setStatus(e.message));
  }, []);

  async function save(postType: string) {
    const s = settings[postType] || { enabled: false, interval_hours: 24, channel_ids: [], message: null };
    const response = await fetch(`${API}/api/admin/autopost/${postType}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postType, enabled: s.enabled, intervalHours: Number(s.interval_hours), channelIds: s.channel_ids || [], message: s.message || null }) });
    setStatus(response.ok ? `${postType} saved.` : "Could not save settings.");
  }

  function update(postType: string, patch: Partial<Setting>) { setSettings(prev => ({ ...prev, [postType]: { ...(prev[postType] || { post_type: postType, enabled: false, interval_hours: 24, channel_ids: [], message: null }), ...patch } })); }

  return <DashboardShell title="Admin Panel">
    <div className="section-title"><div className="eyebrow">Platform Operations</div><h2>BC TRUCK WORKS Administration</h2><p>Control exactly which Discord channels receive automatic updates. Unconfigured update types remain off.</p></div>
    <div className="card" style={{ marginBottom: 18 }}><strong>🔐 Admin controls</strong><p>{status}</p></div>
    <div className="grid two">
      {types.map(([key, label]) => { const s = settings[key] || { enabled: false, interval_hours: 24, channel_ids: [], message: null } as Setting; return <article className="card" key={key}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}><h3>{label}</h3><button className="btn" onClick={() => update(key, { enabled: !s.enabled })}>{s.enabled ? "🟢 ON" : "🔴 OFF"}</button></div>
        <div className="form">
          <div className="field"><label>Discord channel IDs (one per line)</label><textarea value={(s.channel_ids || []).join("\n")} onChange={e => update(key, { channel_ids: e.target.value.split(/\n|,/).map(x => x.trim()).filter(Boolean) })} rows={3} style={{width:"100%",border:"1px solid var(--border)",background:"#080d15",color:"var(--text)",borderRadius:10,padding:12}} /></div>
          <div className="field"><label>Interval in hours</label><input type="number" min="1" value={s.interval_hours} onChange={e => update(key, { interval_hours: Number(e.target.value) })} /></div>
          <div className="field"><label>Custom message (optional)</label><textarea value={s.message || ""} onChange={e => update(key, { message: e.target.value })} rows={3} style={{width:"100%",border:"1px solid var(--border)",background:"#080d15",color:"var(--text)",borderRadius:10,padding:12}} /></div>
          <button className="btn primary" onClick={() => save(key)}>Save {label}</button>
        </div>
      </article> })}
    </div>
    <div className="section-title" style={{marginTop:40}}><div className="eyebrow">Player Presence</div><h2>ATS / ETS player alerts</h2><p>Customer server agents can report Steam/display names to the platform. The API stores presence and can associate a player with their BC TRUCK WORKS account. The Discord notification layer can then announce joins/leaves without exposing private account credentials.</p></div>
    <div className="grid three"><article className="card"><h3>🎮 Steam identity</h3><p>Store a Steam ID and current display name from the server agent.</p></article><article className="card"><h3>🚛 ATS / ETS activity</h3><p>Record which registered customer server the player is currently using.</p></article><article className="card"><h3>🔔 Discord alerts</h3><p>Send configurable join/leave alerts to selected Discord channels.</p></article></div>
  </DashboardShell>;
}
