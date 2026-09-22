"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { claddingProfiles, colours, purposes, styles } from "@/lib/site-data";

export function ShedBuilder({
  initialPurpose = "home",
}: {
  initialPurpose?: string;
}) {
  const safePurpose = purposes.some((item) => item.id === initialPurpose)
    ? initialPurpose
    : "home";
  const [purpose, setPurpose] = useState(safePurpose);
  const [style, setStyle] = useState("gable");
  const [profile, setProfile] = useState("corrugated");
  const [colour, setColour] = useState("monument");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const currentPurpose =
    purposes.find((item) => item.id === purpose) ?? purposes[0];
  const currentStyle = styles.find((item) => item.id === style) ?? styles[0];
  const currentProfile =
    claddingProfiles.find((item) => item.id === profile) ?? claddingProfiles[0];
  const currentColour =
    colours.find((item) => item.id === colour) ?? colours[0];
  const image = `/concepts/${purpose}-${style}.webp`;
  const dimensionsReady = [width, length, height].every(
    (value) => Number(value) > 0,
  );
  const quoteHref = `/quote?purpose=${purpose}&style=${style}&profile=${profile}&colour=${colour}&width=${encodeURIComponent(width)}&length=${encodeURIComponent(length)}&height=${encodeURIComponent(height)}`;

  const reset = () => {
    setPurpose(safePurpose);
    setStyle("gable");
    setProfile("corrugated");
    setColour("monument");
    setWidth("");
    setLength("");
    setHeight("");
  };

  return (
    <div className="builder-app">
      <aside className="builder-preview">
        <div className="builder-canvas">
          <Image
            key={image}
            src={image}
            alt={`${currentStyle.label} concept for ${currentPurpose.title}`}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 52vw"
          />
          <div className="render-status">
            <i /> Structure preview
          </div>
          <div className="render-count">20 structural concepts</div>
          <div
            className="finish-preview"
            aria-label={`Selected finish: ${currentColour.label}`}
          >
            <i style={{ backgroundColor: currentColour.hex }} />
            <span>
              Selected finish
              <b>{currentColour.label}</b>
            </span>
          </div>
        </div>
        <div className="build-readout">
          <div>
            <span>Your concept</span>
            <h2>
              {currentStyle.label} {currentPurpose.title}
            </h2>
            <p>
              {currentProfile.label} · {currentColour.label}
              {dimensionsReady ? ` · ${width} × ${length} × ${height} m` : ""}
            </p>
          </div>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </div>
        <p className="render-disclaimer">
          The image previews purpose and building form. Your cladding and
          finish selections are recorded for the project brief and confirmed in
          the final drawings.
        </p>
      </aside>

      <div className="builder-controls">
        <div className="builder-progress">
          <span>Design direction</span>
          <b>{dimensionsReady ? "Ready for your brief" : "Add your approximate size"}</b>
          <i />
        </div>
        <BuilderStep number="01" title="What is the shed for?">
          <div className="purpose-options">
            {purposes.map((item) => (
              <button
                type="button"
                className={purpose === item.id ? "selected" : ""}
                onClick={() => setPurpose(item.id)}
                key={item.id}
              >
                <small>{item.label}</small>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                {purpose === item.id ? <Check /> : null}
              </button>
            ))}
          </div>
        </BuilderStep>
        <BuilderStep number="02" title="Choose a building style">
          <div className="builder-card-grid style-options">
            {styles.map((item) => (
              <button
                type="button"
                className={style === item.id ? "selected" : ""}
                onClick={() => setStyle(item.id)}
                key={item.id}
              >
                <span className={`roof-icon roof-${item.id}`} aria-hidden="true">
                  {item.id === "barn" ? <i /> : null}
                </span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>
        </BuilderStep>
        <BuilderStep number="03" title="Choose a cladding profile">
          <div className="builder-card-grid profile-options">
            {claddingProfiles.map((item) => (
              <button
                type="button"
                className={profile === item.id ? "selected" : ""}
                onClick={() => setProfile(item.id)}
                key={item.id}
              >
                <span className={`profile-sample profile-${item.id}`} />
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>
        </BuilderStep>
        <BuilderStep number="04" title="Choose a Colorbond finish">
          <div className="finish-options">
            {colours.map((item) => (
              <button
                type="button"
                className={colour === item.id ? "selected" : ""}
                onClick={() => setColour(item.id)}
                key={item.id}
                title={item.label}
              >
                <i style={{ background: item.hex }} />
                <span>{item.label}</span>
                {colour === item.id ? <Check /> : null}
              </button>
            ))}
          </div>
        </BuilderStep>
        <BuilderStep number="05" title="Add the approximate size">
          <p className="builder-size-intro">
            These dimensions are required for a useful quote. Estimates are
            completely fine—we will confirm them with you later.
          </p>
          <div className="builder-size-grid">
            <label>
              Width <span>metres</span>
              <input
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
                placeholder="e.g. 9"
                aria-label="Approximate shed width in metres"
              />
            </label>
            <label>
              Length <span>metres</span>
              <input
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={length}
                onChange={(event) => setLength(event.target.value)}
                placeholder="e.g. 15"
                aria-label="Approximate shed length in metres"
              />
            </label>
            <label>
              Eave height <span>metres</span>
              <input
                type="number"
                min="1.8"
                max="30"
                step="0.1"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                placeholder="e.g. 3.6"
                aria-label="Approximate shed eave height in metres"
              />
            </label>
          </div>
        </BuilderStep>
        <div className="builder-submit">
          <div>
            <span>Design direction ready</span>
            <strong>
              {dimensionsReady
                ? `${width} × ${length} × ${height} m · ${currentStyle.label}`
                : `${currentPurpose.title} · ${currentStyle.label}`}
            </strong>
          </div>
          {dimensionsReady ? (
            <Link href={quoteHref}>
              Continue to project brief <ArrowRight />
            </Link>
          ) : (
            <span className="builder-submit-disabled">
              Add dimensions to continue
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BuilderStep({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="builder-step">
      <header>
        <span>{number}</span>
        <h3>{title}</h3>
      </header>
      {children}
    </section>
  );
}
