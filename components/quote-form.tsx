"use client";

import { ArrowRight, Check } from "lucide-react";
import Script from "next/script";
import { type FormEvent, useState } from "react";
import { claddingProfiles, colours, purposes, styles } from "@/lib/site-data";

type Defaults = {
  purpose?: string;
  style?: string;
  profile?: string;
  colour?: string;
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
  const turnstileReady =
    Boolean(turnstileSiteKey) &&
    !turnstileSiteKey.startsWith("REPLACE_WITH_");
  const selectionSummary = [
    defaults?.purpose ? purposeLabels[defaults.purpose] : "",
    defaults?.style ? styleLabels[defaults.style] : "",
    defaults?.profile ? profileLabels[defaults.profile] : "",
    defaults?.colour ? colourLabels[defaults.colour] : "",
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
          <span>PROJECT ENQUIRY</span>
          <strong>Fields marked * are required</strong>
        </div>
        {selectionSummary.length ? (
          <div className="builder-selection">
            <span>PRE-FILLED FROM THE SHED BUILDER</span>
            <strong>{selectionSummary.join(" · ")}</strong>
            <small>Review the selections below before submitting.</small>
          </div>
        ) : null}

        <label className="quote-honeypot" aria-hidden="true">
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>

        <div className="form-grid">
          <label>
            Your name *
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="e.g. Matthew Smith"
            />
          </label>
          <label>
            Phone *
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="04xx xxx xxx"
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Email *
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Project location *
            <input
              name="location"
              required
              autoComplete="address-level2"
              placeholder="Suburb or postcode"
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Project type *
            <select
              name="type"
              required
              defaultValue={defaults?.purpose ?? ""}
            >
              <option value="" disabled>
                Select one
              </option>
              {purposes.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Project scope *
            <select name="scope" required defaultValue="turnkey">
              <option value="supply">Supply only</option>
              <option value="install">Supply &amp; install</option>
              <option value="turnkey">Complete turnkey project</option>
              <option value="unsure">Not sure—advise me</option>
            </select>
          </label>
        </div>
        <div className="form-grid">
          <label>
            Building style *
            <select
              name="style"
              required
              defaultValue={defaults?.style ?? ""}
            >
              <option value="" disabled>
                Select one
              </option>
              {styles.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cladding profile *
            <select
              name="profile"
              required
              defaultValue={defaults?.profile ?? ""}
            >
              <option value="" disabled>
                Select one
              </option>
              {claddingProfiles.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          COLORBOND finish *
          <select
            name="colour"
            required
            defaultValue={defaults?.colour ?? ""}
          >
            <option value="" disabled>
              Select one
            </option>
            {colours.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid three">
          <label>
            Approx. width
            <input name="width" inputMode="decimal" placeholder="metres" />
          </label>
          <label>
            Approx. length
            <input name="length" inputMode="decimal" placeholder="metres" />
          </label>
          <label>
            Eave height
            <input name="height" inputMode="decimal" placeholder="metres" />
          </label>
        </div>
        <label>
          Tell us what the building needs to do
          <textarea
            name="details"
            rows={6}
            placeholder="Intended use, access, timing, site conditions, must-haves—or simply what you’re unsure about."
          />
        </label>
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
          <p className="form-error" role="alert">
            {error}
          </p>
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
