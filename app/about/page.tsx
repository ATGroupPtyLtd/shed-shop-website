import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image?: string;
};

// Add or remove a person here. When a portrait is ready, add:
// image: "/team/filename.jpg"
const team: TeamMember[] = [
  {
    name: "Ash",
    role: "Sales & Admin",
    description:
      "Helping customers move from their first enquiry through selections, paperwork and the next practical step.",
  },
  {
    name: "Adrianna",
    role: "Sales",
    image: "/team/example-staff-portrait.png",
    description:
      "Helping customers explore their options and find the right starting point for their shed project.",
  },
];

export const metadata: Metadata = {
  title: "About The Shed Shop",
  description:
    "Meet the local, family-owned team helping Victorian homes, farms and businesses plan and build better sheds.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="About The Shed Shop"
        title="Practical people."
        accent="Personal service."
        copy="A family-owned team in Traralgon, helping Victorian homes, farms and businesses turn a shed idea into a well-managed build."
        image="/projects/project-11.jpg"
      />

      <section className="about-intro shell section-space">
        <div>
          <p className="eyebrow">
            <i />
            Local from the start
          </p>
          <h2>Clear advice. One accountable team.</h2>
        </div>
        <div>
          <p>
            We keep shed projects straightforward. Our team listens first,
            works through the practical details and coordinates the path from
            concept and permits through to supply and construction.
          </p>
          <p>
            Based in Traralgon, we work with homeowners, farmers and businesses
            across Victoria. By bringing design, engineering, approvals,
            Australian-made materials and construction into one process, we
            give clients a clear point of contact from the first conversation
            to the finished building.
          </p>
          <Link className="text-action" href="/quote">
            Start a conversation <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="team-section">
        <div className="shell section-space">
          <div className="team-heading">
            <div>
              <p className="eyebrow">
                <i />
                Meet the team
              </p>
              <h2>Real people, ready to help.</h2>
            </div>
            <p>
              Your first conversation is with someone local who understands the
              process and can help you take the next step with confidence.
            </p>
          </div>

          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.name}>
                <div className="team-photo">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.role} at The Shed Shop`}
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                    />
                  ) : (
                    <div
                      className="team-photo-placeholder"
                      role="img"
                      aria-label={`Portrait placeholder for ${member.name}`}
                    >
                      <span>{member.name.charAt(0)}</span>
                      <small>Portrait coming soon</small>
                    </div>
                  )}
                </div>
                <div className="team-card-copy">
                  <span>{member.role}</span>
                  <h3>{member.name}</h3>
                  <p>{member.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
