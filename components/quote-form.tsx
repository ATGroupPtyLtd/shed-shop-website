"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export function QuoteForm({
  defaults,
}: {
  defaults?: {
    purpose?: string;
    style?: string;
    profile?: string;
    colour?: string;
  };
}) {
  const [sent, setSent] = useState(false);
  const label = (value?: string) =>
    value
      ? value
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";
  if (sent)
    return (
      <div className="form-success">
        <Check />
        <span>Project brief received</span>
        <h2>Thanks—we’ll take it from here.</h2>
        <p>
          A member of the Traralgon team will review your details and get in
          touch to discuss the next practical step.
        </p>
        <button type="button" onClick={() => setSent(false)}>
          Edit enquiry
        </button>
      </div>
    );
  return (
    <form
      className="quote-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="form-head">
        <span>PROJECT ENQUIRY</span>
        <strong>Fields marked * are required</strong>
      </div>
      {defaults?.purpose ? (
        <div className="builder-selection">
          <span>BUILDER SELECTION</span>
          <strong>
            {label(defaults.purpose)} · {label(defaults.style)} ·{" "}
            {label(defaults.profile)} · {label(defaults.colour)}
          </strong>
        </div>
      ) : null}
      <div className="form-grid">
        <label>
          Your name *
          <input name="name" required placeholder="e.g. Matthew Smith" />
        </label>
        <label>
          Phone *
          <input name="phone" type="tel" required placeholder="04xx xxx xxx" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Email *
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Project location *
          <input name="location" required placeholder="Suburb or postcode" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Project type
          <select name="type" defaultValue={defaults?.purpose ?? ""}>
            <option value="" disabled>
              Select one
            </option>
            <option value="home">Garage or workshop</option>
            <option value="farm">Farm or machinery</option>
            <option value="business">Commercial or industrial</option>
            <option value="custom">Custom structure</option>
          </select>
        </label>
        <label>
          Project scope
          <select name="scope" defaultValue="turnkey">
            <option value="supply">Supply only</option>
            <option value="install">Supply & install</option>
            <option value="turnkey">Complete turnkey project</option>
            <option value="unsure">Not sure—advise me</option>
          </select>
        </label>
      </div>
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
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />
        <span>Choose a file</span>
        <small>PDF, PNG, JPG or Word · optional</small>
      </label>
      <div className="form-submit">
        <p>
          No spam or pressure—just practical advice from a real project
          specialist.
        </p>
        <button type="submit">
          Send project brief <ArrowRight />
        </button>
      </div>
    </form>
  );
}
