import { env } from "cloudflare:workers";
import { claddingProfiles, colours, purposes, styles } from "@/lib/site-data";

const QUOTE_TO = "admin@shed-shop.com.au";
const QUOTE_FROM = "website@shed-shop.com.au";
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_FILES = 3;

type EmailAttachment = {
  content: ArrayBuffer;
  filename: string;
  type: string;
  disposition: "attachment";
};

type QuoteBindings = {
  QUOTE_EMAIL?: {
    send(message: {
      to: string;
      from: { email: string; name: string };
      replyTo: { email: string; name: string };
      subject: string;
      html: string;
      text: string;
      attachments?: EmailAttachment[];
    }): Promise<{ messageId: string }>;
  };
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
const scopeLabels: Record<string, string> = {
  supply: "Supply only",
  install: "Supply and install",
  turnkey: "Complete turnkey project",
  unsure: "Not sure — please advise",
};

function text(form: FormData, name: string, maxLength = 200): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function cleanFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120);
}

function json(body: object, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
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
    const profile = text(form, "profile", 50);
    const colour = text(form, "colour", 50);
    const width = text(form, "width", 30);
    const length = text(form, "length", 30);
    const height = text(form, "height", 30);
    const details = text(form, "details", 5000);

    const required = [
      name,
      phone,
      customerEmail,
      location,
      purpose,
      scope,
      style,
      profile,
      colour,
    ];
    if (required.some((value) => !value)) {
      return json({ error: "Please complete every required field." }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    if (
      !purposeLabels[purpose] ||
      !scopeLabels[scope] ||
      !styleLabels[style] ||
      !profileLabels[profile] ||
      !colourLabels[colour]
    ) {
      return json({ error: "One or more project selections are invalid." }, 400);
    }

    const bindings = env as QuoteBindings;
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
    if (files.length > MAX_FILES) {
      return json({ error: `Please attach no more than ${MAX_FILES} files.` }, 400);
    }
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_FILE_BYTES) {
      return json({ error: "Attachments must total 4 MB or less." }, 400);
    }

    const allowedExtensions = /\.(pdf|png|jpe?g|docx?)$/i;
    if (files.some((file) => !allowedExtensions.test(file.name))) {
      return json(
        { error: "Attachments must be PDF, PNG, JPG or Word documents." },
        400,
      );
    }

    if (!bindings.QUOTE_EMAIL) {
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
    const dimensions = [
      width ? `Width: ${width} m` : "Width: Not supplied",
      length ? `Length: ${length} m` : "Length: Not supplied",
      height ? `Eave height: ${height} m` : "Eave height: Not supplied",
    ];
    const rows = [
      ["Reference", reference],
      ["Name", name],
      ["Phone", phone],
      ["Email", customerEmail],
      ["Location", location],
      ["Project type", purposeLabels[purpose]],
      ["Project scope", scopeLabels[scope]],
      ["Building style", styleLabels[style]],
      ["Cladding profile", profileLabels[profile]],
      ["COLORBOND finish", colourLabels[colour]],
      ["Dimensions", dimensions.join(" · ")],
      ["Submitted", submittedAt],
    ];
    const table = rows
      .map(
        ([label, value]) =>
          `<tr><th style="padding:8px 14px 8px 0;text-align:left;vertical-align:top;color:#58717c">${escapeHtml(label)}</th><td style="padding:8px 0;color:#071f2c">${escapeHtml(value)}</td></tr>`,
      )
      .join("");
    const attachments = await Promise.all(
      files.map(async (file): Promise<EmailAttachment> => ({
        content: await file.arrayBuffer(),
        filename: cleanFilename(file.name),
        type: file.type || "application/octet-stream",
        disposition: "attachment",
      })),
    );

    await bindings.QUOTE_EMAIL.send({
      to: QUOTE_TO,
      from: { email: QUOTE_FROM, name: "The Shed Shop Website" },
      replyTo: { email: customerEmail, name },
      subject: `New quote ${reference} — ${purposeLabels[purpose]} — ${location}`,
      text: [
        "NEW WEBSITE PROJECT BRIEF",
        "",
        ...rows.map(([label, value]) => `${label}: ${value}`),
        "",
        "PROJECT DETAILS",
        details || "No additional details supplied.",
        "",
        attachments.length
          ? `${attachments.length} attachment(s) included.`
          : "No attachments supplied.",
      ].join("\n"),
      html: `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#071f2c"><div style="background:#071f2c;padding:24px 28px;color:#fff"><div style="font-size:12px;letter-spacing:.12em;color:#75cce8">THE SHED SHOP</div><h1 style="margin:8px 0 0;font-size:26px">New project brief</h1></div><div style="padding:26px 28px;border:1px solid #d5e2e7;border-top:0"><table style="width:100%;border-collapse:collapse">${table}</table><h2 style="margin:26px 0 10px;font-size:17px">Project details</h2><p style="margin:0;line-height:1.65;white-space:normal">${escapeHtml(details || "No additional details supplied.").replace(/\n/g, "<br>")}</p><p style="margin:24px 0 0;padding-top:18px;border-top:1px solid #d5e2e7;color:#58717c;font-size:12px">Reply to this email to contact ${escapeHtml(name)} directly.</p></div></div>`,
      attachments: attachments.length ? attachments : undefined,
    });

    return json({ ok: true, reference });
  } catch (error) {
    console.error("Quote submission failed", error);
    return json(
      { error: "We could not send your brief. Please try again or call us." },
      500,
    );
  }
}
