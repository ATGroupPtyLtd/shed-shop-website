import type { Metadata } from "next";
import { ShedBuilder } from "@/components/shed-builder";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Interactive Shed Builder",
  description:
    "Explore 20 completed Shed Shop projects, then nominate your cladding, COLORBOND finish and approximate shed size.",
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
            Choose a purpose and building form to explore one of 20 completed
            Shed Shop projects, then nominate the cladding, COLORBOND finish
            and approximate size for your project brief.
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
