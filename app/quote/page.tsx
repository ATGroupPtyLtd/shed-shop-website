import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Request a Quote", description: "Send your shed project brief to The Shed Shop’s Traralgon team." };

const faqs = [
  ["Can The Shed Shop handle the complete project?", "Yes. We can coordinate design, drafting, engineering, permits, concrete, supply and construction as one turnkey project."],
  ["Do I need planning permission?", "Requirements depend on the building, property and local planning controls. We can review the site and help identify the approvals needed before work begins."],
  ["Should the concrete slab be laid first?", "The slab sequence is resolved as part of the project plan. For a complete project, we coordinate the slab and structure so engineering, set-out and construction align."],
  ["Can I request supply only?", "Yes. Choose supply only, supply and installation, or a complete turnkey project. If you are unsure, we will recommend the most practical scope."],
];

export default async function QuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const text = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
  const defaults = { purpose: text("purpose"), style: text("style"), profile: text("profile"), colour: text("colour") };
  return <main><SiteHeader /><section className="quote-page"><div className="shell quote-layout"><div className="quote-intro"><p className="eyebrow light"><i />Start a project</p><h1>Tell us what<br /><em>you’re building.</em></h1><p>Send what you know—even if that is only the intended use and location. A real person from our Traralgon team will help shape the next step.</p><div className="contact-list"><a href="tel:0351778433"><Phone /><span><small>Call</small>03 5177 8433</span></a><a href="mailto:admin@shed-shop.com.au"><Mail /><span><small>Email</small>admin@shed-shop.com.au</span></a><div><MapPin /><span><small>Visit</small>6 Stirloch Circuit, Traralgon East</span></div><div><Clock /><span><small>Hours</small>Monday–Friday · 8am–5pm</span></div></div></div><QuoteForm defaults={defaults} /></div></section>
    <section className="faq shell section-space"><div><p className="eyebrow"><i />Good to know</p><h2>Frequently asked<br />before a build.</h2></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section><SiteFooter /></main>;
}
