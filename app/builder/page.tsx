import type { Metadata } from "next";
import { ShedBuilder } from "@/components/shed-builder";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Interactive Shed Builder",
  description:
    "Explore 720 purpose, building style, cladding profile and Colorbond finish combinations.",
};

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const purpose = typeof params.purpose === "string" ? params.purpose : "home";
  return (
    <main>
      <SiteHeader />
      <section className="builder-page-head">
        <div className="shell">
          <div>
            <p className="eyebrow light">
              <i />
              Interactive catalogue
            </p>
            <h1>
              Find your
              <br />
              <em>design direction.</em>
            </h1>
          </div>
          <p>
            Four decisions. One clear concept. Every combination loads a
            dedicated image so you can compare form, profile and finish without
            visual guesswork.
          </p>
        </div>
      </section>
      <section className="builder-page">
        <div className="shell">
          <ShedBuilder initialPurpose={purpose} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
