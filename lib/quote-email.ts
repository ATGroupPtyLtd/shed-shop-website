export type QuoteEmailRow = {
  label: string;
  value: string;
  href?: string;
  swatch?: string;
};

export type QuoteEmailSection = {
  number: string;
  title: string;
  rows: QuoteEmailRow[];
};

type QuoteEmailInput = {
  reference: string;
  submittedAt: string;
  name: string;
  customerEmail: string;
  location: string;
  projectType: string;
  dimensions: string;
  buildingStyle: string;
  requestedResponse: string;
  sections: QuoteEmailSection[];
  projectDetails: string;
  openingNotes: string;
  attachmentNames: string[];
};

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

function lines(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function renderRow(row: QuoteEmailRow): string {
  const safeValue = escapeHtml(row.value);
  const value = row.href
    ? `<a href="${escapeHtml(row.href)}" style="color:#087da5;text-decoration:underline">${safeValue}</a>`
    : safeValue;
  const swatch = row.swatch
    ? `<span style="display:inline-block;width:13px;height:13px;margin:0 8px -2px 0;border:1px solid #b9c8ce;background:${escapeHtml(row.swatch)}"></span>`
    : "";

  return `<tr><td width="38%" style="padding:11px 14px;border-bottom:1px solid #e0e9ec;background:#f6f9fa;color:#607985;font-family:Arial,sans-serif;font-size:11px;font-weight:700;line-height:1.4;text-transform:uppercase;letter-spacing:.04em">${escapeHtml(row.label)}</td><td style="padding:11px 14px;border-bottom:1px solid #e0e9ec;color:#061724;font-family:Arial,sans-serif;font-size:14px;line-height:1.45">${swatch}${value}</td></tr>`;
}

function renderSection(section: QuoteEmailSection): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px"><tr><td style="padding:0 0 10px"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td width="28" height="28" align="center" style="background:#dff3f9;color:#087da5;font-family:Arial,sans-serif;font-size:10px;font-weight:800">${escapeHtml(section.number)}</td><td style="padding-left:10px;color:#061724;font-family:Arial,sans-serif;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.02em">${escapeHtml(section.title)}</td></tr></table></td></tr><tr><td><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #d5e2e7;border-bottom:0">${section.rows.map(renderRow).join("")}</table></td></tr></table>`;
}

function renderNote(title: string, value: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 14px;border-left:3px solid #20a7d1;background:#f3f8fa"><tr><td style="padding:17px 19px"><div style="margin-bottom:7px;color:#087da5;font-family:Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase">${escapeHtml(title)}</div><div style="color:#263f4b;font-family:Arial,sans-serif;font-size:14px;line-height:1.65">${lines(value)}</div></td></tr></table>`;
}

export function renderQuoteEmail(input: QuoteEmailInput): {
  html: string;
  text: string;
} {
  const firstName = input.name.trim().split(/\s+/)[0] || "customer";
  const replyHref = `mailto:${input.customerEmail}?subject=${encodeURIComponent(`Re: Shed Shop project brief ${input.reference}`)}`;
  const attachmentSummary = input.attachmentNames.length
    ? input.attachmentNames.join(", ")
    : "No attachments supplied";
  const text = [
    `THE SHED SHOP — PROJECT BRIEF ${input.reference}`,
    `${input.projectType} · ${input.location}`,
    `Submitted ${input.submittedAt}`,
    "",
    ...input.sections.flatMap((section) => [
      section.title.toUpperCase(),
      ...section.rows.map((row) => `${row.label}: ${row.value}`),
      "",
    ]),
    "PROJECT DETAILS",
    input.projectDetails,
    "",
    "OPENINGS / ACCESS NOTES",
    input.openingNotes,
    "",
    `ATTACHMENTS: ${attachmentSummary}`,
  ].join("\n");

  const attachmentItems = input.attachmentNames.length
    ? input.attachmentNames
        .map(
          (filename) =>
            `<tr><td style="padding:5px 0;color:#263f4b;font-family:Arial,sans-serif;font-size:13px">&#8226;&nbsp; ${escapeHtml(filename)}</td></tr>`,
        )
        .join("")
    : `<tr><td style="padding:5px 0;color:#708791;font-family:Arial,sans-serif;font-size:13px">No files attached</td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#edf3f5"><div style="display:none;max-height:0;overflow:hidden;opacity:0">New project brief from ${escapeHtml(input.name)} in ${escapeHtml(input.location)}.</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf3f5"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:720px;background:#ffffff"><tr><td style="padding:28px 32px;background:#061724"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="color:#67c9e7;font-family:Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:.16em">THE SHED SHOP</td><td align="right"><span style="display:inline-block;padding:6px 9px;border:1px solid #36505e;color:#cfe8ef;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.12em">PROJECT BRIEF</span></td></tr></table><h1 style="margin:24px 0 5px;color:#ffffff;font-family:Arial,sans-serif;font-size:28px;line-height:1.15">New shed project enquiry</h1><p style="margin:0;color:#a9c2cd;font-family:Arial,sans-serif;font-size:14px;line-height:1.5">${escapeHtml(input.projectType)} &nbsp;&bull;&nbsp; ${escapeHtml(input.location)}</p></td></tr><tr><td style="padding:0 32px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:-1px;background:#0a2638"><tr><td style="padding:13px 16px;color:#9eb9c4;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase">Reference&nbsp; <span style="color:#ffffff;font-size:13px">${escapeHtml(input.reference)}</span></td><td align="right" style="padding:13px 16px;color:#9eb9c4;font-family:Arial,sans-serif;font-size:10px">${escapeHtml(input.submittedAt)}</td></tr></table></td></tr><tr><td style="padding:26px 32px 8px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #d7e4e8"><tr><td width="33.33%" valign="top" style="padding:15px;border-right:1px solid #d7e4e8"><div style="margin-bottom:5px;color:#78909a;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase">Overall size</div><div style="color:#061724;font-family:Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.4">${escapeHtml(input.dimensions)}</div></td><td width="33.33%" valign="top" style="padding:15px;border-right:1px solid #d7e4e8"><div style="margin-bottom:5px;color:#78909a;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase">Building style</div><div style="color:#061724;font-family:Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.4">${escapeHtml(input.buildingStyle)}</div></td><td width="33.33%" valign="top" style="padding:15px"><div style="margin-bottom:5px;color:#78909a;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase">Response needed</div><div style="color:#061724;font-family:Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.4">${escapeHtml(input.requestedResponse)}</div></td></tr></table></td></tr><tr><td style="padding:20px 32px 4px">${input.sections.map(renderSection).join("")}</td></tr><tr><td style="padding:0 32px 8px"><div style="margin:0 0 12px;color:#061724;font-family:Arial,sans-serif;font-size:16px;font-weight:800;text-transform:uppercase">Project notes</div>${renderNote("What the building needs to do", input.projectDetails)}${renderNote("Openings and access", input.openingNotes)}</td></tr><tr><td style="padding:4px 32px 26px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f9fa;border:1px solid #d7e4e8"><tr><td style="padding:16px 18px"><div style="margin-bottom:5px;color:#087da5;font-family:Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase">Attachments · ${input.attachmentNames.length}</div><table role="presentation" cellspacing="0" cellpadding="0" border="0">${attachmentItems}</table></td></tr></table></td></tr><tr><td align="center" style="padding:27px 32px;background:#f3f7f8;border-top:1px solid #d7e4e8"><a href="${escapeHtml(replyHref)}" style="display:inline-block;padding:14px 22px;background:#20a7d1;color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:.06em;text-decoration:none;text-transform:uppercase">Reply to ${escapeHtml(firstName)}</a><p style="margin:13px 0 0;color:#718690;font-family:Arial,sans-serif;font-size:11px;line-height:1.5">Replying normally also addresses ${escapeHtml(input.customerEmail)}.<br>This project brief was submitted through shed-shop.com.au.</p></td></tr></table></td></tr></table></body></html>`;

  return { html, text };
}
