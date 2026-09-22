"use client";

import { ArrowRight, Check } from "lucide-react";
import Script from "next/script";
import { type FormEvent, useState } from "react";
import {
  accessoryOptions,
  buildTimelines,
  frameSystems,
  projectScopes,
  quantityOptions,
  quoteGoals,
  rollerDoorSizes,
  roofInsulationOptions,
  wallInsulationOptions,
  windowSizes,
} from "@/lib/quote-options";
import { claddingProfiles, colours, purposes, styles } from "@/lib/site-data";

type Defaults = {
  purpose?: string;
  style?: string;
  profile?: string;
  colour?: string;
  width?: string;
  length?: string;
  height?: string;
};

type TurnstileWindow = Window & {
  turnstile?: { reset: () => void };
};

const purposeLabels = Object.fromEntries(
  purposes.map((item) => [item.id, item.title]),
) as Record<string, string>;
const styleLabels = Object.fromEntries(
  styles.map((item) => [item.id, item.label]),
) as Record<string, string>;
const profileLabels = Object.fromEntries(
  claddingProfiles.map((item) => [item.id, item.label]),
) as Record<string, string>;
const colourLabels = Object.fromEntries(
  colours.map((item) => [item.id, item.label]),
) as Record<string, string>;

const openingQuantities = quantityOptions(10);
const smallQuantities = quantityOptions(5);

export function QuoteForm({
  defaults,
  turnstileSiteKey,
}: {
  defaults?: Defaults;
  turnstileSiteKey: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [rollerDoors, setRollerDoors] = useState("0");
  const [rollerDoorSize, setRollerDoorSize] = useState("unsure");
  const [windows, setWindows] = useState("0");
  const [windowSize, setWindowSize] = useState("unsure");
  const turnstileReady =
    Boolean(turnstileSiteKey) &&
    !turnstileSiteKey.startsWith("REPLACE_WITH_");
  const selectionSummary = [
    defaults?.purpose ? purposeLabels[defaults.purpose] : "",
    defaults?.style ? styleLabels[defaults.style] : "",
    defaults?.profile ? profileLabels[defaults.profile] : "",
    defaults?.colour ? colourLabels[defaults.colour] : "",
    defaults?.width && defaults?.length && defaults?.height
      ? `${defaults.width} × ${defaults.length} × ${defaults.height} m`
      : "",
  ].filter(Boolean);

  const resetTurnstile = () =>
    (window as TurnstileWindow).turnstile?.reset();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as {
        error?: string;
        reference?: string;
      };
      if (!response.ok) {
        throw new Error(result.error || "Your project brief could not be sent.");
      }
      setReference(result.reference ?? "RECEIVED");
      setStatus("sent");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Your project brief could not be sent.",
      );
      setStatus("idle");
      resetTurnstile();
    }
  };

  if (status === "sent") {
    return (
      <div className="form-success">
        <Check />
        <span>Project brief received · {reference}</span>
        <h2>Thanks—we’ll take it from here.</h2>
        <p>
          Your brief has been emailed to our Traralgon team. We’ll review the
          details and contact you about the next practical step.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setReference("");
            window.setTimeout(resetTurnstile, 0);
          }}
        >
          Send another brief
        </button>
      </div>
    );
  }

  return (
    <>
      {turnstileReady ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <form className="quote-form" onSubmit={submit}>
        <div className="form-head">
          <span>PROJECT BRIEF</span>
          <strong>About 5 minutes · * Required</strong>
        </div>
        {selectionSummary.length ? (
          <div className="builder-selection">
            <span>PRE-FILLED FROM YOUR SHED BUILDER</span>
            <strong>{selectionSummary.join(" · ")}</strong>
            <small>Everything remains editable before you submit.</small>
          </div>
        ) : null}

        <label className="quote-honeypot" aria-hidden="true">
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>

        <FormSection
          number="01"
          title="Your details"
          note="Where should we send the quote and where is the project?"
        >
          <div className="form-grid">
            <Field label="Your name" required>
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="e.g. Matthew Smith"
              />
            </Field>
            <Field label="Phone" required>
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="04xx xxx xxx"
              />
            </Field>
          </div>
          <div className="form-grid">
            <Field label="Email" required>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Project location" required hint="Suburb and postcode is enough for now.">
              <input
                name="location"
                required
                autoComplete="address-level2"
                placeholder="e.g. Traralgon VIC 3844"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          number="02"
          title="Building essentials"
          note="The core information we need to understand and price the shed."
        >
          <div className="form-grid">
            <Field label="What is the shed for?" required>
              <select name="type" required defaultValue={defaults?.purpose ?? ""}>
                <option value="" disabled>Select one</option>
                {purposes.map((item) => (
                  <option value={item.id} key={item.id}>{item.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Project scope" required>
              <select name="scope" required defaultValue="turnkey">
                {projectScopes.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="form-grid">
            <Field label="Building style" required>
              <select name="style" required defaultValue={defaults?.style ?? ""}>
                <option value="" disabled>Select one</option>
                {styles.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Frame system" hint="Choose ‘recommend’ unless you already have a preference.">
              <select name="frame" defaultValue="unsure">
                {frameSystems.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="form-grid">
            <Field label="Cladding profile" required>
              <select name="profile" required defaultValue={defaults?.profile ?? ""}>
                <option value="" disabled>Select one</option>
                {claddingProfiles.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
            <Field label="COLORBOND® finish" required>
              <select name="colour" required defaultValue={defaults?.colour ?? ""}>
                <option value="" disabled>Select one</option>
                {colours.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="dimension-heading">
            <strong>Overall shed dimensions *</strong>
            <span>Use approximate measurements if the final size is not confirmed.</span>
          </div>
          <div className="form-grid three">
            <Field label="Width" required>
              <input
                name="width"
                type="number"
                required
                min="1"
                max="500"
                step="0.1"
                defaultValue={defaults?.width}
                placeholder="e.g. 9"
              />
            </Field>
            <Field label="Length" required>
              <input
                name="length"
                type="number"
                required
                min="1"
                max="500"
                step="0.1"
                defaultValue={defaults?.length}
                placeholder="e.g. 15"
              />
            </Field>
            <Field label="Eave height" required>
              <input
                name="height"
                type="number"
                required
                min="1.8"
                max="30"
                step="0.1"
                defaultValue={defaults?.height}
                placeholder="e.g. 3.6"
              />
            </Field>
          </div>
          <p className="dimension-note">All dimensions are in metres.</p>
        </FormSection>

        <FormSection
          number="03"
          title="Access & openings"
          note="Tell us what needs to move in and out of the building."
        >
          <div className="form-grid three">
            <Field label="Roller doors">
              <select
                name="rollerDoors"
                value={rollerDoors}
                onChange={(event) => setRollerDoors(event.target.value)}
              >
                {openingQuantities.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Personal access doors">
              <select name="accessDoors" defaultValue="0">
                {smallQuantities.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Windows">
              <select
                name="windows"
                value={windows}
                onChange={(event) => setWindows(event.target.value)}
              >
                {smallQuantities.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          </div>
          {rollerDoors !== "0" ? (
            <div className="conditional-fields">
              <Field label="Preferred roller-door size">
                <select
                  name="rollerDoorSize"
                  value={rollerDoorSize}
                  onChange={(event) => setRollerDoorSize(event.target.value)}
                >
                  {rollerDoorSizes.map((item) => (
                    <option value={item.id} key={item.id}>{item.label}</option>
                  ))}
                </select>
              </Field>
              {rollerDoorSize === "custom" ? (
                <Field label="Custom roller-door sizes" required>
                  <input
                    name="customRollerDoorSize"
                    required
                    placeholder="e.g. 2 at 4.0 W × 4.5 H, 1 at 3.0 W × 3.0 H"
                  />
                </Field>
              ) : null}
            </div>
          ) : null}
          {windows !== "0" ? (
            <div className="conditional-fields">
              <Field label="Preferred window size">
                <select
                  name="windowSize"
                  value={windowSize}
                  onChange={(event) => setWindowSize(event.target.value)}
                >
                  {windowSizes.map((item) => (
                    <option value={item.id} key={item.id}>{item.label}</option>
                  ))}
                </select>
              </Field>
              {windowSize === "custom" ? (
                <Field label="Custom window sizes" required>
                  <input
                    name="customWindowSize"
                    required
                    placeholder="List the sizes or describe what you need"
                  />
                </Field>
              ) : null}
            </div>
          ) : null}
          <Field label="Opening notes" hint="Optional — include door locations, vehicle clearance or mixed sizes.">
            <textarea
              name="openingNotes"
              rows={3}
              placeholder="e.g. Roller doors along the front, with drive-through access at the rear."
            />
          </Field>
        </FormSection>

        <FormSection
          number="04"
          title="Comfort & extras"
          note="Choose what you know. We can recommend the rest for your intended use."
        >
          <div className="form-grid">
            <Field label="Roof insulation">
              <select name="roofInsulation" defaultValue="unsure">
                {roofInsulationOptions.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Wall insulation">
              <select name="wallInsulation" defaultValue="unsure">
                {wallInsulationOptions.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="choice-block">
            <span>Accessories you may want</span>
            <div className="choice-grid">
              {accessoryOptions.map((item) => (
                <label key={item.id}>
                  <input type="checkbox" name="accessories" value={item.id} />
                  <i aria-hidden="true"><Check /></i>
                  {item.label}
                </label>
              ))}
            </div>
          </div>
          <Field label="Other requirements">
            <input
              name="otherRequirements"
              placeholder="e.g. gutters, downpipes, internal partitions or special access"
            />
          </Field>
        </FormSection>

        <FormSection
          number="05"
          title="Timing & final details"
          note="Help us understand what kind of response will be most useful."
        >
          <div className="form-grid">
            <Field label="When are you hoping to build?">
              <select name="timeline" defaultValue="flexible">
                {buildTimelines.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
            <Field label="What would you like from us?" required>
              <select name="quoteGoal" required defaultValue="formal-quote">
                {quoteGoals.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tell us what the building needs to do">
            <textarea
              name="details"
              rows={5}
              placeholder="Intended use, site conditions, must-haves, approval status—or anything you would like us to work through with you."
            />
          </Field>
          <label className="file-field">
            Plans, sketches or site photos
            <input
              name="files"
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(event) =>
                setFileNames(
                  Array.from(event.currentTarget.files ?? []).map(
                    (file) => file.name,
                  ),
                )
              }
            />
            <span>Choose files</span>
            <small>
              {fileNames.length
                ? fileNames.join(", ")
                : "Up to 3 PDF, PNG, JPG or Word files · 4 MB total"}
            </small>
          </label>
        </FormSection>

        <div className="turnstile-area">
          {turnstileReady ? (
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-action="quote"
              data-theme="light"
            />
          ) : (
            <p>
              Secure submissions will be enabled after the final Cloudflare
              Turnstile key is added.
            </p>
          )}
        </div>
        {error ? (
          <p className="form-error" role="alert">{error}</p>
        ) : null}
        <div className="form-submit">
          <p>
            No spam or pressure—just practical advice from a real project
            specialist.
          </p>
          <button
            type="submit"
            disabled={status === "sending" || !turnstileReady}
          >
            {status === "sending" ? "Sending brief…" : "Send project brief"}
            <ArrowRight />
          </button>
        </div>
      </form>
    </>
  );
}

function FormSection({
  number,
  title,
  note,
  children,
}: {
  number: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="form-section">
      <header className="form-section-head">
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{note}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label>
      {label}{required ? " *" : ""}
      {children}
      {hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );
}
