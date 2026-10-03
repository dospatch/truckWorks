"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CompanionShell } from "./CompanionShell";

type T = Record<string, any>;
const url = "http://127.0.0.1:25555/api/ets2/telemetry";
const pick=(d:T|null, paths:string[], f:any="—")=>{for(const p of paths){const v=p.split(".").reduce((o,k)=>o?.[k],d);if(v!==undefined&&v!==null&&v!=="")return v}return f};
const num=(v:any)=>{const n=Number(v);return Number.isFinite(n)?n:null};

export function CompanionGame({ game }: { game: "ATS"|"ETS2" }) {
 const [d,setD]=useState<T|null>(null); const [live,setLive]=useState(false);
 const load=useCallback(async()=>{try{const r=await fetch(url+"?bc_ts="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;const x=await r.json();setD(x);setLive(Boolean(x?.game?.connected)&&String(x?.game?.gameName||"").toUpperCase().includes(game));}catch{setLive(false)}},[game]);
 useEffect(()=>{load();const t=window.setInterval(load,1000);return()=>window.clearInterval(t)},[load]);
 const truck=[pick(d,["truck.make"],""),pick(d,["truck.model"],"")].filter(Boolean).join(" ")||"Truck not detected";
 const speed=num(pick(d,["truck.speed"],null)); const rpm=num(pick(d,["truck.rpm","truck.engineRpm"],null)); const fuel=num(pick(d,["truck.fuelAmount","truck.fuel"],null));
 const source=pick(d,["job.sourceCity","job.sourceCityName"],"—"), dest=pick(d,["job.destinationCity","job.destinationCityName"],"—"), cargo=pick(d,["job.cargo"],"No active job");
 const distance=num(pick(d,["navigation.estimatedDistance","job.remainingDistanceKm"],null)); const damage=num(pick(d,["truck.damage"],null));
 return <CompanionShell game={game}><div className="companion-content">
 {!live&&<div className="telemetry-warning"><strong>{game} TELEMETRY OFFLINE</strong><span>Start your simulator telemetry server on this PC to populate live values.</span></div>}
 <section className="drive-hero"><div><div className="eyebrow">{game==="ATS"?"AMERICAN TRUCK SIMULATOR":"EURO TRUCK SIMULATOR 2"}</div><h2>{live?truck:"Waiting for your truck."}</h2><p>{live?source+" → "+dest:"BC TRUCK WORKS is ready for live simulator telemetry."}</p></div><Link href="/dashboard/telemetry" className="hero-action">Telemetry Settings →</Link></section>
 <section className="telemetry-grid">
 {[["SPEED",live&&speed!==null?Math.round(speed)+" MPH":"—","Current speed"],["TRUCK",live?truck:"—","Current vehicle"],["FUEL",live&&fuel!==null?fuel.toFixed(1):"—","Fuel level"],["ENGINE RPM",live&&rpm!==null?Math.round(rpm).toLocaleString():"—","Engine speed"],["TO DESTINATION",live&&distance!==null?distance.toFixed(1)+" km":"—",live?dest:"No active route"],["DAMAGE",live&&damage!==null?(damage*100).toFixed(1)+"%":"—","Vehicle condition"]].map(x=><article className="metric-card" key={x[0]}><div className="metric-label">{x[0]}</div><strong>{x[1]}</strong><small>{x[2]}</small></article>)}
 </section>
 <div className="content-columns"><section className="panel"><div className="eyebrow">CURRENT DELIVERY</div><h3>{live?cargo:"No active delivery"}</h3><div className="route-line"><span>{source}</span><b>→</b><span>{dest}</span></div><div className="delivery-stats"><div><small>CARGO</small><strong>{live?cargo:"—"}</strong></div><div><small>DISTANCE</small><strong>{distance!==null?distance.toFixed(1)+" km":"—"}</strong></div><div><small>STATUS</small><strong>{live?"IN PROGRESS":"WAITING"}</strong></div></div></section>
 <section className="panel"><div className="eyebrow">TRUCK HEALTH</div><h3>{live?"Vehicle systems":"Waiting for vehicle"}</h3><div className="health-list"><div><span>Telemetry</span><b>{live?"RECEIVING":"OFFLINE"}</b></div><div><span>Engine RPM</span><b>{rpm!==null?Math.round(rpm).toLocaleString():"—"}</b></div><div><span>Damage</span><b>{damage!==null?(damage*100).toFixed(1)+"%":"—"}</b></div></div></section></div>
 <section className="panel"><div className="panel-header"><div><div className="eyebrow">DRIVER TOOLS</div><h3>{game} Companion</h3></div><span className="muted">LIVE CONTROL CENTER</span></div><div className="tool-grid">{[["⛟","Dispatch & BOL","/companion/dispatch"],["▤","Trip History","/companion/trips"],["▥","Earnings & Stats","/companion/earnings"],["🎙","Co-Driver","/companion/codriver"],["➤","Navigation","/companion/navigation"],["⚠","Alerts & Discord","/companion/alerts"]].map(([i,n,h])=><Link className="tool-card" href={h} key={n}><span>{i}</span><div><strong>{n}</strong><small>BC TRUCK WORKS</small></div></Link>)}</div></section>
 </div></CompanionShell>;
}
