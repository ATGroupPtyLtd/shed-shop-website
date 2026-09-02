"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { claddingProfiles, colours, purposes, styles } from "@/lib/site-data";

export function ShedBuilder({ initialPurpose = "home" }: { initialPurpose?: string }) {
  const safePurpose = purposes.some(item => item.id === initialPurpose) ? initialPurpose : "home";
  const [purpose, setPurpose] = useState(safePurpose);
  const [style, setStyle] = useState("gable");
  const [profile, setProfile] = useState("corrugated");
  const [colour, setColour] = useState("monument");
  const currentPurpose = purposes.find(item => item.id === purpose) ?? purposes[0];
  const currentStyle = styles.find(item => item.id === style) ?? styles[0];
  const currentProfile = claddingProfiles.find(item => item.id === profile) ?? claddingProfiles[0];
  const currentColour = colours.find(item => item.id === colour) ?? colours[0];
  const image = `/configurator/${purpose}/${style}/${profile}/${colour}.webp`;

  const reset = () => { setPurpose(safePurpose); setStyle("gable"); setProfile("corrugated"); setColour("monument"); };

  return <div className="builder-app">
    <aside className="builder-preview">
      <div className="builder-canvas">
        <Image key={image} src={image} alt={`${currentColour.label} ${currentProfile.label} ${currentStyle.label} ${currentPurpose.title}`} fill priority sizes="(max-width: 980px) 100vw, 52vw" />
        <div className="render-status"><i /> Live catalogue render</div>
        <div className="render-count">720 render combinations</div>
      </div>
      <div className="build-readout">
        <div><span>Your concept</span><h2>{currentStyle.label} {currentPurpose.title}</h2><p>{currentColour.label} · {currentProfile.label}</p></div>
        <button type="button" onClick={reset}><RotateCcw /> Reset</button>
      </div>
      <p className="render-disclaimer">Concept visualisation only. Final scale, openings, structure, finishes and engineering are confirmed in your project drawings.</p>
    </aside>

    <div className="builder-controls">
      <div className="builder-progress"><span>Design direction</span><b>04 selections complete</b><i /></div>
      <BuilderStep number="01" title="What is the shed for?">
        <div className="purpose-options">{purposes.map(item => <button type="button" className={purpose === item.id ? "selected" : ""} onClick={() => setPurpose(item.id)} key={item.id}><small>{item.label}</small><strong>{item.title}</strong><span>{item.description}</span>{purpose === item.id ? <Check /> : null}</button>)}</div>
      </BuilderStep>
      <BuilderStep number="02" title="Choose a building style">
        <div className="builder-card-grid style-options">{styles.map(item => <button type="button" className={style === item.id ? "selected" : ""} onClick={() => setStyle(item.id)} key={item.id}><span className={`roof-icon roof-${item.id}`} /><strong>{item.label}</strong><small>{item.note}</small></button>)}</div>
      </BuilderStep>
      <BuilderStep number="03" title="Choose a cladding profile">
        <div className="builder-card-grid profile-options">{claddingProfiles.map(item => <button type="button" className={profile === item.id ? "selected" : ""} onClick={() => setProfile(item.id)} key={item.id}><span className={`profile-sample profile-${item.id}`} /><strong>{item.label}</strong><small>{item.note}</small></button>)}</div>
      </BuilderStep>
      <BuilderStep number="04" title="Choose a Colorbond finish">
        <div className="finish-options">{colours.map(item => <button type="button" className={colour === item.id ? "selected" : ""} onClick={() => setColour(item.id)} key={item.id} title={item.label}><i style={{ background: item.hex }} /><span>{item.label}</span>{colour === item.id ? <Check /> : null}</button>)}</div>
      </BuilderStep>
      <div className="builder-submit"><div><span>Design direction ready</span><strong>{currentPurpose.title} · {currentStyle.label} · {currentColour.label}</strong></div><Link href={`/quote?purpose=${purpose}&style=${style}&profile=${profile}&colour=${colour}`}>Continue to project brief <ArrowRight /></Link></div>
    </div>
  </div>;
}

function BuilderStep({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="builder-step"><header><span>{number}</span><h3>{title}</h3></header>{children}</section>;
}
