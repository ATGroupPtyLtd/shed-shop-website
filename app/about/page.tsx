import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About The Shed Shop",
  description:
    "Meet the family-owned Victorian team delivering design, permits, Australian-made steel and shed construction.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="About The Shed Shop"
        title="Local knowledge."
        accent="Complete capability."
        copy="A family-owned team with the technical experience, practical judgement and local relationships to carry a steel-building project from idea to handover."
        image="/projects/project-11.jpg"
      />
      <section className="story shell section-space">
        <div>
          <p className="eyebrow">
            <i />
            Based in Traralgon
          </p>
          <h2>One team from first sketch to final bolt.</h2>
        </div>
        <div>
          <p>
            The Shed Shop was built around a simple belief: buying a shed should
            feel clear, considered and well managed. A substantial building
            project should not leave the client coordinating designers, permit
            specialists, concreters, suppliers and installers alone.
          </p>
          <p>
            We work with homeowners, farmers and businesses across Victoria,
            using fully welded RHS frames or universal beams and Australian-made
            Colorbond steel. The result is not simply a kit—it is a building
            resolved around its purpose and site.
          </p>
          <Link className="text-action" href="/quote">
            Talk to our team <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="about-proof">
        <div className="shell about-proof-grid">
          <div className="about-proof-image">
            <Image
              src="/projects/project-12.jpg"
              alt="Large Shed Shop steel project under construction"
              fill
              sizes="(max-width: 900px) 100vw, 54vw"
            />
          </div>
          <div>
            <p className="eyebrow light">
              <i />
              How we work
            </p>
            <h2>
              Accountability
              <br />
              at every stage.
            </h2>
            <ul>
              {[
                "A real person guides the project",
                "Design decisions start with intended use",
                "Engineering responds to the specific site",
                "Permit requirements are resolved early",
                "Australian-made materials are prioritised",
                "Construction is delivered with clear responsibility",
              ].map((item) => (
                <li key={item}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="values shell section-space">
        <article>
          <span>01</span>
          <h3>Practical by design</h3>
          <p>
            Every choice earns its place by improving use, durability or
            delivery.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Clear responsibility</h3>
          <p>
            One experienced team can coordinate the full path instead of passing
            the problem on.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Made for here</h3>
          <p>
            Local knowledge, Australian steel and engineering suited to
            Victorian conditions.
          </p>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
