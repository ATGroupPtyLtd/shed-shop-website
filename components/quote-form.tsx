"use client";

import {
  ArrowRight,
  Check,
  FileText,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";
import Script from "next/script";
import {
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
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
import {
  isAllowedQuoteFile,
  MAX_QUOTE_FILE_BYTES,
  MAX_QUOTE_FILES,
  QUOTE_FILE_ACCEPT,
} from "@/lib/quote-files";
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

type LiveField =
  | "name"
  | "phone"
  | "email"
  | "location"
  | "width"
  | "length"
  | "height";

type LiveValues = Record<LiveField, string>;

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

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sanitisePhone(value: string): string {
  const allowed = value.replace(/[^\d+()\-\s]/g, "");
  const leadingPlus = allowed.startsWith("+") ? "+" : "";
  return `${leadingPlus}${allowed.replace(/\+/g, "")}`
    .replace(/\s{2,}/g, " ")
    .slice(0, 24);
}

function validateLiveField(field: LiveField, value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return field === "height"
      ? "Enter the approximate eave height."
      : field === "width" || field === "length"
        ? `Enter the shed ${field}.`
        : `Enter your ${field === "location" ? "project location" : field}.`;
  }

  if (field === "name") {
    return trimmed.length >= 2 && /\p{L}/u.test(trimmed)
      ? ""
      : "Enter a name using at least two characters.";
  }

  if (field === "phone") {
    const digits = trimmed.replace(/\D/g, "");
    return /^\+?[\d\s()\-]+$/.test(trimmed) && digits.length >= 8 && digits.length <= 15
      ? ""
      : "Enter a valid phone number with 8–15 digits.";
  }

  if (field === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
      ? ""
      : "Enter a complete email address, such as name@example.com.";
  }

  if (field === "location") {
    return trimmed.length >= 2
      ? ""
      : "Enter a suburb, town or project location.";
  }

  const measurement = Number(trimmed);
  if (!Number.isFinite(measurement)) return "Enter a valid measurement.";
  if ((field === "width" || field === "length") && (measurement < 1 || measurement > 500)) {
    return "Enter a measurement between 1 and 500 metres.";
  }
  if (field === "height" && (measurement < 1.8 || measurement > 30)) {
    return "Enter an eave height between 1.8 and 30 metres.";
  }
  return "";
}

export function QuoteForm({
  defaults,
  turnstileSiteKey,
}: {
  defaults?: Defaults;
  turnstileSiteKey: string;
}) {
  const initialLiveValues = (): LiveValues => ({
    name: "",
    phone: "",
    email: "",
    location: "",
    width: defaults?.width ?? "",
    length: defaults?.length ?? "",
    height: defaults?.height ?? "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [liveValues, setLiveValues] = useState<LiveValues>(initialLiveValues);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<LiveField, boolean>>
  >({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [rollerDoors, setRollerDoors] = useState("0");
  const [rollerDoorSize, setRollerDoorSize] = useState("unsure");
  const [windows, setWindows] = useState("0");
  const [windowSize, setWindowSize] = useState("unsure");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const liveErrors = Object.fromEntries(
    (Object.keys(liveValues) as LiveField[]).map((field) => [
      field,
      validateLiveField(field, liveValues[field]),
    ]),
  ) as Record<LiveField, string>;
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

  const visibleError = (field: LiveField) =>
    touchedFields[field] || liveValues[field] ? liveErrors[field] : "";

  const updateLiveField = (field: LiveField, rawValue: string) => {
    const value = field === "phone" ? sanitisePhone(rawValue) : rawValue;
    setLiveValues((current) => ({ ...current, [field]: value }));
    setTouchedFields((current) => ({ ...current, [field]: true }));
    if (error) setError("");
  };

  const addFiles = (incomingFiles: File[]) => {
    if (status === "sending" || !incomingFiles.length) return;

    const selectedKeys = new Set(selectedFiles.map(fileKey));
    const newFiles = incomingFiles.filter(
      (file) => !selectedKeys.has(fileKey(file)),
    );

    if (!newFiles.length) {
      setUploadError("That file is already attached.");
      return;
    }

    const invalidFile = newFiles.find(
      (file) => !file.size || !isAllowedQuoteFile(file.name),
    );
    if (invalidFile) {
      setUploadError(
        `${invalidFile.name} is not a supported PDF, PNG, JPG or Word file.`,
      );
      return;
    }

    const nextFiles = [...selectedFiles, ...newFiles];
    if (nextFiles.length > MAX_QUOTE_FILES) {
      setUploadError(`You can attach up to ${MAX_QUOTE_FILES} files.`);
      return;
    }

    const totalBytes = nextFiles.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_QUOTE_FILE_BYTES) {
      setUploadError("Attachments must total 4 MB or less.");
      return;
    }

    setSelectedFiles(nextFiles);
    setUploadError("");
  };

  const removeFile = (index: number) => {
    setSelectedFiles((files) => files.filter((_, itemIndex) => itemIndex !== index));
    setUploadError("");
  };

  const handleFileDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDraggingFiles(true);
  };

  const handleFileDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (!dragDepth.current) setIsDraggingFiles(false);
  };

  const handleFileDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDraggingFiles(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleUploadKeyDown = (event: KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setUploadError("");

    const fields = Object.keys(liveValues) as LiveField[];
    setTouchedFields(Object.fromEntries(fields.map((field) => [field, true])));
    const firstInvalidField = fields.find((field) => liveErrors[field]);
    if (firstInvalidField) {
      setError("Please correct the highlighted details before sending your brief.");
      window.setTimeout(
        () => document.getElementById(`quote-${firstInvalidField}`)?.focus(),
        0,
      );
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      setError("Please complete the remaining required fields before continuing.");
      event.currentTarget.reportValidity();
      return;
    }

    setStatus("sending");

    try {
      const formData = new FormData(event.currentTarget);
      selectedFiles.forEach((file) => formData.append("files", file, file.name));
      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });
      const result: {
        error?: string;
        reference?: string;
      } = response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : {};
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "Your attachments are too large. Please keep their combined total to 4 MB or less.",
          );
        }
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
          Your brief has been emailed to our team. We’ll review the
          details and contact you about the next practical step.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setReference("");
            setSelectedFiles([]);
            setUploadError("");
            setLiveValues(initialLiveValues());
            setTouchedFields({});
            setError("");
            setRollerDoors("0");
            setRollerDoorSize("unsure");
            setWindows("0");
            setWindowSize("unsure");
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
      <form
        className="quote-form"
        onSubmit={submit}
        aria-busy={status === "sending"}
        noValidate
      >
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
            <Field
              label="Your name"
              required
              error={visibleError("name")}
              errorId="quote-name-error"
            >
              <input
                id="quote-name"
                name="name"
                required
                autoComplete="name"
                maxLength={100}
                value={liveValues.name}
                onChange={(event) => updateLiveField("name", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, name: true }))
                }
                aria-invalid={Boolean(visibleError("name"))}
                aria-describedby={visibleError("name") ? "quote-name-error" : undefined}
                placeholder="e.g. Matthew Smith"
              />
            </Field>
            <Field
              label="Phone"
              required
              hint="Numbers, spaces, brackets, hyphens and a leading + are accepted."
              hintId="quote-phone-hint"
              error={visibleError("phone")}
              errorId="quote-phone-error"
            >
              <input
                id="quote-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                maxLength={24}
                value={liveValues.phone}
                onChange={(event) => updateLiveField("phone", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, phone: true }))
                }
                aria-invalid={Boolean(visibleError("phone"))}
                aria-describedby={`quote-phone-hint${visibleError("phone") ? " quote-phone-error" : ""}`}
                placeholder="04xx xxx xxx"
              />
            </Field>
          </div>
          <div className="form-grid">
            <Field
              label="Email"
              required
              error={visibleError("email")}
              errorId="quote-email-error"
            >
              <input
                id="quote-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                value={liveValues.email}
                onChange={(event) => updateLiveField("email", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, email: true }))
                }
                aria-invalid={Boolean(visibleError("email"))}
                aria-describedby={visibleError("email") ? "quote-email-error" : undefined}
                placeholder="you@example.com"
              />
            </Field>
            <Field
              label="Project location"
              required
              hint="Suburb and postcode is enough for now."
              hintId="quote-location-hint"
              error={visibleError("location")}
              errorId="quote-location-error"
            >
              <input
                id="quote-location"
                name="location"
                required
                autoComplete="address-level2"
                maxLength={150}
                value={liveValues.location}
                onChange={(event) => updateLiveField("location", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, location: true }))
                }
                aria-invalid={Boolean(visibleError("location"))}
                aria-describedby={`quote-location-hint${visibleError("location") ? " quote-location-error" : ""}`}
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
            <Field
              label="Width"
              required
              error={visibleError("width")}
              errorId="quote-width-error"
            >
              <input
                id="quote-width"
                name="width"
                type="number"
                required
                min="1"
                max="500"
                step="0.1"
                inputMode="decimal"
                value={liveValues.width}
                onChange={(event) => updateLiveField("width", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, width: true }))
                }
                aria-invalid={Boolean(visibleError("width"))}
                aria-describedby={visibleError("width") ? "quote-width-error" : undefined}
                placeholder="e.g. 9"
              />
            </Field>
            <Field
              label="Length"
              required
              error={visibleError("length")}
              errorId="quote-length-error"
            >
              <input
                id="quote-length"
                name="length"
                type="number"
                required
                min="1"
                max="500"
                step="0.1"
                inputMode="decimal"
                value={liveValues.length}
                onChange={(event) => updateLiveField("length", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, length: true }))
                }
                aria-invalid={Boolean(visibleError("length"))}
                aria-describedby={visibleError("length") ? "quote-length-error" : undefined}
                placeholder="e.g. 15"
              />
            </Field>
            <Field
              label="Eave height"
              required
              error={visibleError("height")}
              errorId="quote-height-error"
            >
              <input
                id="quote-height"
                name="height"
                type="number"
                required
                min="1.8"
                max="30"
                step="0.1"
                inputMode="decimal"
                value={liveValues.height}
                onChange={(event) => updateLiveField("height", event.target.value)}
                onBlur={() =>
                  setTouchedFields((current) => ({ ...current, height: true }))
                }
                aria-invalid={Boolean(visibleError("height"))}
                aria-describedby={visibleError("height") ? "quote-height-error" : undefined}
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
                    minLength={2}
                    maxLength={250}
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
                    minLength={2}
                    maxLength={250}
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
              maxLength={1500}
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
              maxLength={1000}
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
              maxLength={5000}
              placeholder="Intended use, site conditions, must-haves, approval status—or anything you would like us to work through with you."
            />
          </Field>
          <div className="upload-field">
            <div className="upload-label">Plans, sketches or site photos</div>
            <label
              className={`file-dropzone${isDraggingFiles ? " is-dragging" : ""}${status === "sending" ? " is-disabled" : ""}`}
              onDragEnter={handleFileDragEnter}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
              onKeyDown={handleUploadKeyDown}
              tabIndex={status === "sending" ? -1 : 0}
              aria-disabled={status === "sending"}
              aria-describedby="quote-file-limits"
            >
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                tabIndex={-1}
                multiple
                accept={QUOTE_FILE_ACCEPT}
                disabled={status === "sending"}
                onChange={(event) => {
                  addFiles(Array.from(event.currentTarget.files ?? []));
                  event.currentTarget.value = "";
                }}
              />
              <span className="upload-icon" aria-hidden="true">
                <UploadCloud />
              </span>
              <span className="upload-copy">
                <strong>Drop files here</strong>
                <small>or select them from your device</small>
              </span>
              <span className="upload-action">
                {selectedFiles.length ? "Add more files" : "Choose files"}
              </span>
            </label>
            <div className="upload-meta" id="quote-file-limits">
              <span>PDF, PNG, JPG or Word</span>
              <span>
                {selectedFiles.length} of {MAX_QUOTE_FILES} files · {formatFileSize(
                  selectedFiles.reduce((total, file) => total + file.size, 0),
                )} of 4 MB
              </span>
            </div>
            {selectedFiles.length ? (
              <ul className="selected-files" aria-label="Selected attachments">
                {selectedFiles.map((file, index) => (
                  <li key={fileKey(file)}>
                    <FileText aria-hidden="true" />
                    <span>
                      <strong>{file.name}</strong>
                      <small>{formatFileSize(file.size)}</small>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={status === "sending"}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {uploadError ? (
              <p className="upload-error" role="alert">{uploadError}</p>
            ) : null}
          </div>
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
            {status === "sending" ? "Sending securely…" : "Send project brief"}
            {status === "sending" ? (
              <LoaderCircle className="submit-spinner" />
            ) : (
              <ArrowRight />
            )}
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
  hintId,
  required = false,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  hintId?: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      {label}{required ? " *" : ""}
      {children}
      {hint ? <small className="field-hint" id={hintId}>{hint}</small> : null}
      {error ? (
        <small className="field-error" id={errorId} role="alert">
          {error}
        </small>
      ) : null}
    </label>
  );
}
