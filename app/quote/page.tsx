import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { QuoteForm } from "@/components/quote-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Send your shed project brief to The Shed Shop’s Traralgon team.",
};

const faqs = [
  [
    "Can The Shed Shop handle the complete project?",
    "Yes. We can coordinate design, drafting, engineering, permits, concrete, supply and construction as one turnkey project.",
  ],
  [
    "How do I know if I’m getting good value?",
    "Compare more than the headline price. Check the steel specification, inclusions, engineering, permits, concrete, installation and who remains accountable throughout the project. We provide a clear scope so you can compare like with like.",
  ],
  [
    "Do I need planning permission?",
    "It depends on the building, property and local planning controls. Some sheds need a planning permit before a building permit can be issued. We can review the project and help identify the likely approval pathway.",
  ],
  [
    "Should the concrete slab be laid first?",
    "The slab sequence is resolved as part of the project plan. For a complete project, we coordinate the slab and structure so engineering, set-out and construction align.",
  ],
  [
    "What’s the difference between planning and building approval?",
    "Planning approval considers whether the development is appropriate for the property and local planning rules. Building approval deals with structural design, safety and compliance with applicable building requirements. Depending on the project, you may need one or both.",
  ],
  [
    "What approvals will my shed need?",
    "The requirements vary with the shed’s size, use, location, overlays and property conditions. Our team can help establish what applies and coordinate the relevant drafting, engineering and permit work as part of the project.",
  ],
];

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const text = (key: string) =>
    typeof params[key] === "string" ? params[key] : undefined;
  const defaults = {
    purpose: text("purpose"),
    style: text("style"),
    profile: text("profile"),
    colour: text("colour"),
    width: text("width"),
    length: text("length"),
    height: text("height"),
  };
  const turnstileSiteKey =
    typeof env.TURNSTILE_SITE_KEY === "string"
      ? env.TURNSTILE_SITE_KEY
      : "";
  return (
    <main>
      <SiteHeader />
      <section className="quote-page">
        <div className="shell quote-layout">
          <div className="quote-intro">
            <p className="eyebrow light">
              <i />
              Start a project
            </p>
            <h1>
              Tell us what
              <br />
              <em>you’re building.</em>
            </h1>
            <p>
              Give us the essentials—location, approximate size and design
              direction—then choose “please recommend” anywhere you want our
              advice. The result is a clearer, more useful first quote.
            </p>
            <Link className="quote-builder-link" href="/builder">
              <span>
                <small>Not sure what to choose?</small>
                Build your concept first
              </span>
              <ArrowRight />
            </Link>
            <div className="contact-list">
              <a href="tel:0351778433">
                <Phone />
                <span>
                  <small>Call</small>03 5177 8433
                </span>
              </a>
              <a href="mailto:admin@shed-shop.com.au">
                <Mail />
                <span>
                  <small>Email</small>admin@shed-shop.com.au
                </span>
              </a>
              <div>
                <MapPin />
                <span>
                  <small>Visit</small>6 Stirloch Circuit, Traralgon East
                </span>
              </div>
              <div>
                <Clock />
                <span>
                  <small>Hours</small>Monday–Friday · 8am–5pm
                </span>
              </div>
            </div>
          </div>
          <QuoteForm
            defaults={defaults}
            turnstileSiteKey={turnstileSiteKey}
          />
        </div>
      </section>
      <section className="faq shell section-space">
        <div>
          <p className="eyebrow">
            <i />
            Good to know
          </p>
          <h2>
            Frequently asked
            <br />
            before a build.
          </h2>
        </div>
        <div>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
