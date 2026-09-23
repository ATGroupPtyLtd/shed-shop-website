import { env } from "cloudflare:workers";
import {
  accessoryOptions,
  buildTimelines,
  frameSystems,
  projectScopes,
  quoteGoals,
  rollerDoorSizes,
  roofInsulationOptions,
  wallInsulationOptions,
  windowSizes,
} from "@/lib/quote-options";
import { renderQuoteEmail, type QuoteEmailSection } from "@/lib/quote-email";
import {
  isAllowedQuoteFile,
  MAX_QUOTE_FILE_BYTES,
  MAX_QUOTE_FILES,
} from "@/lib/quote-files";
import { claddingProfiles, colours, purposes, styles } from "@/lib/site-data";

const QUOTE_TO = "admin@shed-shop.com.au";
const QUOTE_FROM = "website@shed-shop.com.au";
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_REQUEST_BYTES = 6 * 1024 * 1024;

type EmailAttachment = {
  content: string;
  filename: string;
};

type RateLimitBinding = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

type QuoteBindings = {
  RESEND_API_KEY?: string;
  QUOTE_RATE_LIMITER?: RateLimitBinding;
  QUOTE_GLOBAL_RATE_LIMITER?: RateLimitBinding;
  TURNSTILE_SECRET?: string;
};

type TurnstileResult = {
  success: boolean;
  hostname?: string;
  action?: string;
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
const colourHexes = Object.fromEntries(
  colours.map((item) => [item.id, item.hex]),
) as Record<string, string>;
const labels = (items: readonly { id: string; label: string }[]) =>
  Object.fromEntries(items.map((item) => [item.id, item.label])) as Record<
    string,
    string
  >;
const scopeLabels = labels(projectScopes);
const frameLabels = labels(frameSystems);
const rollerDoorSizeLabels = labels(rollerDoorSizes);
const windowSizeLabels = labels(windowSizes);
const roofInsulationLabels = labels(roofInsulationOptions);
const wallInsulationLabels = labels(wallInsulationOptions);
const accessoryLabels = labels(accessoryOptions);
const timelineLabels = labels(buildTimelines);
const quoteGoalLabels = labels(quoteGoals);

function text(form: FormData, name: string, maxLength = 200): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    chunks.push(
      String.fromCharCode(...bytes.subarray(offset, offset + chunkSize)),
    );
  }

  return btoa(chunks.join(""));
}

function validDimension(value: string, minimum: number, maximum: number): boolean {
  if (!/^\d+(?:\.\d+)?$/.test(value)) return false;
  const measurement = Number(value);
  return Number.isFinite(measurement) && measurement >= minimum && measurement <= maximum;
}

function validPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return (
    /^\+?[\d\s()\-]+$/.test(value) &&
    digits.length >= 8 &&
    digits.length <= 15
  );
}

function json(
  body: object,
  status = 200,
  extraHeaders: HeadersInit = {},
): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const requestUrl = new URL(request.url);
    if (request.headers.get("Origin") !== requestUrl.origin) {
      return json({ error: "This request was not accepted." }, 403);
    }

    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return json(
        { error: "The project brief is too large. Please reduce the attachments." },
        413,
      );
    }

    const bindings = env as QuoteBindings;
    if (!bindings.QUOTE_RATE_LIMITER || !bindings.QUOTE_GLOBAL_RATE_LIMITER) {
      return json(
        { error: "Quotes are temporarily unavailable. Please call or email us." },
        503,
      );
    }

    const visitorKey = request.headers.get("CF-Connecting-IP") ?? "unknown-client";
    const [visitorLimit, globalLimit] = await Promise.all([
      bindings.QUOTE_RATE_LIMITER.limit({ key: visitorKey }),
      bindings.QUOTE_GLOBAL_RATE_LIMITER.limit({ key: "all-quotes" }),
    ]);
    if (!visitorLimit.success || !globalLimit.success) {
      return json(
        { error: "Too many quote requests were sent. Please wait a minute and try again." },
        429,
        { "Retry-After": "60" },
      );
    }

    const form = await request.formData();

    // A hidden honeypot: bots receive a harmless success without creating mail.
    if (text(form, "company_website")) {
      return json({ ok: true, reference: "RECEIVED" });
    }

    const name = text(form, "name", 100);
    const phone = text(form, "phone", 50);
    const customerEmail = text(form, "email", 254).toLowerCase();
    const location = text(form, "location", 150);
    const purpose = text(form, "type", 50);
    const scope = text(form, "scope", 50);
    const style = text(form, "style", 50);
    const frame = text(form, "frame", 50);
    const profile = text(form, "profile", 50);
    const colour = text(form, "colour", 50);
    const width = text(form, "width", 30);
    const length = text(form, "length", 30);
    const height = text(form, "height", 30);
    const rollerDoors = text(form, "rollerDoors", 3);
    const rollerDoorSize = text(form, "rollerDoorSize", 50);
    const customRollerDoorSize = text(form, "customRollerDoorSize", 250);
    const accessDoors = text(form, "accessDoors", 3);
    const windows = text(form, "windows", 3);
    const windowSize = text(form, "windowSize", 50);
    const customWindowSize = text(form, "customWindowSize", 250);
    const openingNotes = text(form, "openingNotes", 1500);
    const roofInsulation = text(form, "roofInsulation", 50);
    const wallInsulation = text(form, "wallInsulation", 50);
    const otherRequirements = text(form, "otherRequirements", 1000);
    const timeline = text(form, "timeline", 50);
    const quoteGoal = text(form, "quoteGoal", 50);
    const details = text(form, "details", 5000);
    const selectedAccessories = form
      .getAll("accessories")
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.slice(0, 50));

    const required = [
      name,
      phone,
      customerEmail,
      location,
      purpose,
      scope,
      style,
      frame,
      profile,
      colour,
      width,
      length,
      height,
      rollerDoors,
      accessDoors,
      windows,
      roofInsulation,
      wallInsulation,
      timeline,
      quoteGoal,
    ];
    if (required.some((value) => !value)) {
      return json({ error: "Please complete every required field." }, 400);
    }

    if (name.length < 2 || !/\p{L}/u.test(name)) {
      return json({ error: "Please enter a valid name." }, 400);
    }

    if (!validPhone(phone)) {
      return json(
        { error: "Please enter a valid phone number with 8–15 digits." },
        400,
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customerEmail)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    if (location.length < 2) {
      return json({ error: "Please enter a valid project location." }, 400);
    }

    if (
      !purposeLabels[purpose] ||
      !scopeLabels[scope] ||
      !styleLabels[style] ||
      !frameLabels[frame] ||
      !profileLabels[profile] ||
      !colourLabels[colour] ||
      !roofInsulationLabels[roofInsulation] ||
      !wallInsulationLabels[wallInsulation] ||
      !timelineLabels[timeline] ||
      !quoteGoalLabels[quoteGoal] ||
      !/^(?:10|[0-9])$/.test(rollerDoors) ||
      !/^[0-5]$/.test(accessDoors) ||
      !/^[0-5]$/.test(windows) ||
      selectedAccessories.some((item) => !accessoryLabels[item])
    ) {
      return json({ error: "One or more project selections are invalid." }, 400);
    }

    if (
      !validDimension(width, 1, 500) ||
      !validDimension(length, 1, 500) ||
      !validDimension(height, 1.8, 30)
    ) {
      return json(
        { error: "Please enter valid width, length and eave-height measurements." },
        400,
      );
    }

    if (
      rollerDoors !== "0" &&
      (!rollerDoorSizeLabels[rollerDoorSize] ||
        (rollerDoorSize === "custom" && !customRollerDoorSize))
    ) {
      return json({ error: "Please confirm the preferred roller-door size." }, 400);
    }

    if (
      windows !== "0" &&
      (!windowSizeLabels[windowSize] ||
        (windowSize === "custom" && !customWindowSize))
    ) {
      return json({ error: "Please confirm the preferred window size." }, 400);
    }

    const token = text(form, "cf-turnstile-response", 2048);
    if (!bindings.TURNSTILE_SECRET || !token) {
      return json(
        { error: "Quote security is not configured yet. Please call or email us." },
        503,
      );
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: bindings.TURNSTILE_SECRET,
          response: token,
          remoteip: request.headers.get("CF-Connecting-IP") ?? undefined,
          idempotency_key: crypto.randomUUID(),
        }),
      },
    );
    const turnstile = (await turnstileResponse.json()) as TurnstileResult;
    const requestHostname = new URL(request.url).hostname;
    const localRequest = ["localhost", "127.0.0.1"].includes(requestHostname);
    if (
      !turnstile.success ||
      turnstile.action !== "quote" ||
      (!localRequest && turnstile.hostname !== requestHostname)
    ) {
      return json(
        { error: "Verification expired or failed. Please try again." },
        403,
      );
    }

    const files = form
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (files.length > MAX_QUOTE_FILES) {
      return json(
        { error: `Please attach no more than ${MAX_QUOTE_FILES} files.` },
        400,
      );
    }
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_QUOTE_FILE_BYTES) {
      return json({ error: "Attachments must total 4 MB or less." }, 400);
    }

    if (files.some((file) => !isAllowedQuoteFile(file.name))) {
      return json(
        { error: "Attachments must be PDF, PNG, JPG or Word documents." },
        400,
      );
    }

    if (!bindings.RESEND_API_KEY) {
      return json(
        { error: "Quote email delivery is not configured yet. Please call us." },
        503,
      );
    }

    const reference = crypto.randomUUID().slice(0, 8).toUpperCase();
    const submittedAt = new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      dateStyle: "full",
      timeStyle: "short",
    });
    const dimensions = `W ${width} m × L ${length} m × Eave ${height} m`;
    const rollerDoorSummary =
      rollerDoors === "0"
        ? "None"
        : `${rollerDoors} · ${
            rollerDoorSize === "custom"
              ? customRollerDoorSize
              : rollerDoorSizeLabels[rollerDoorSize]
          }`;
    const windowSummary =
      windows === "0"
        ? "None"
        : `${windows} · ${
            windowSize === "custom"
              ? customWindowSize
              : windowSizeLabels[windowSize]
          }`;
    const accessories = selectedAccessories.length
      ? selectedAccessories.map((item) => accessoryLabels[item]).join(", ")
      : "None selected";
    const attachments = await Promise.all(
      files.map(async (file): Promise<EmailAttachment> => ({
        content: arrayBufferToBase64(await file.arrayBuffer()),
        filename: cleanFilename(file.name),
      })),
    );
    const emailSections: QuoteEmailSection[] = [
      {
        number: "01",
        title: "Customer & site",
        rows: [
          { label: "Name", value: name },
          {
            label: "Phone",
            value: phone,
            href: `tel:${phone.replace(/[^\d+]/g, "")}`,
          },
          { label: "Email", value: customerEmail, href: `mailto:${customerEmail}` },
          { label: "Project location", value: location },
        ],
      },
      {
        number: "02",
        title: "Building configuration",
        rows: [
          { label: "Project type", value: purposeLabels[purpose] },
          { label: "Project scope", value: scopeLabels[scope] },
          { label: "Building style", value: styleLabels[style] },
          { label: "Frame system", value: frameLabels[frame] },
          { label: "Cladding profile", value: profileLabels[profile] },
          {
            label: "COLORBOND finish",
            value: colourLabels[colour],
            swatch: colourHexes[colour],
          },
          { label: "Overall dimensions", value: dimensions },
        ],
      },
      {
        number: "03",
        title: "Openings & access",
        rows: [
          { label: "Roller doors", value: rollerDoorSummary },
          {
            label: "Personal access doors",
            value: accessDoors === "0" ? "None" : accessDoors,
          },
          { label: "Windows", value: windowSummary },
        ],
      },
      {
        number: "04",
        title: "Comfort & project timing",
        rows: [
          { label: "Roof insulation", value: roofInsulationLabels[roofInsulation] },
          { label: "Wall insulation", value: wallInsulationLabels[wallInsulation] },
          { label: "Accessories", value: accessories },
          {
            label: "Other requirements",
            value: otherRequirements || "None supplied",
          },
          { label: "Preferred timing", value: timelineLabels[timeline] },
          { label: "Requested response", value: quoteGoalLabels[quoteGoal] },
        ],
      },
    ];
    const email = renderQuoteEmail({
      reference,
      submittedAt,
      name,
      customerEmail,
      location,
      projectType: purposeLabels[purpose],
      dimensions,
      buildingStyle: styleLabels[style],
      requestedResponse: quoteGoalLabels[quoteGoal],
      sections: emailSections,
      projectDetails: details || "No additional details supplied.",
      openingNotes: openingNotes || "No additional opening notes supplied.",
      attachmentNames: attachments.map((attachment) => attachment.filename),
    });

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bindings.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `shed-shop-quote-${reference}`,
      },
      body: JSON.stringify({
        from: `The Shed Shop Website <${QUOTE_FROM}>`,
        to: [QUOTE_TO],
        reply_to: customerEmail,
        subject: `Project brief ${reference} — ${purposeLabels[purpose]} — ${location}`,
        text: email.text,
        html: email.html,
        attachments: attachments.length ? attachments : undefined,
        tags: [
          { name: "source", value: "website-quote" },
          { name: "reference", value: reference },
        ],
      }),
    });

    if (!resendResponse.ok) {
      let resendError = "Unknown Resend error";
      try {
        const payload = (await resendResponse.json()) as {
          message?: string;
          name?: string;
        };
        resendError = payload.message ?? payload.name ?? resendError;
      } catch {
        // The response status is still enough to diagnose this in Worker logs.
      }
      console.error("Resend quote delivery failed", {
        status: resendResponse.status,
        error: resendError,
        reference,
      });
      throw new Error("Resend rejected the quote email.");
    }

    return json({ ok: true, reference });
  } catch (error) {
    console.error("Quote submission failed", error);
    return json(
      { error: "We could not send your brief. Please try again or call us." },
      500,
    );
  }
}
