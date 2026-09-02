import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  DraftingCompass,
  Hammer,
  ShieldCheck,
} from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { purposes } from "@/lib/site-data";

const purposeImages = [
  "/projects/project-06.jpg",
  "/projects/project-19.jpg",
  "/projects/project-03.jpg",
  "/projects/project-05.jpg",
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="home-hero">
        <Image
          src="/projects/project-05.jpg"
          alt="Architectural commercial shed completed by The Shed Shop"
          fill
          priority
          sizes="100vw"
        />
        <div className="home-hero-shade" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="eyebrow light">
              <i />
              Victoria’s complete shed team
            </p>
            <h1>
              Built for
              <br />
              <em>what’s next.</em>
            </h1>
            <p>
              Design, permits, Australian-made materials and
              construction—managed by one experienced local team.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/builder">
                Design your shed <ArrowRight />
              </Link>
              <Link className="text-action light" href="/projects">
                Explore completed projects <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="hero-project">
            <span>Featured project · Traralgon</span>
            <strong>Architectural trade facility</strong>
            <p>Custom façade · Large-span workshop · Turnkey delivery</p>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="shell">
          {[
            ["01", "Australian-made steel"],
            ["02", "Site-specific engineering"],
            ["03", "Permits to construction"],
            ["04", "Family-owned in Victoria"],
          ].map(([n, label]) => (
            <div key={n}>
              <b>{n}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-range shell section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <i />
              Start with the job
            </p>
            <h2>
              What does your shed
              <br />
              need to do?
            </h2>
          </div>
          <div>
            <p>
              Choose the direction that best fits your site and your plans.
              We’ll shape the structure, access, finish and approvals around the
              real job.
            </p>
            <Link className="text-action" href="/sheds">
              Explore sheds & services <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="purpose-grid">
          {purposes.map((item, index) => (
            <Link
              href={`/builder?purpose=${item.id}`}
              className="purpose-card"
              key={item.id}
            >
              <Image
                src={purposeImages[index]}
                alt={item.title}
                fill
                sizes="(max-width: 720px) 100vw, 25vw"
              />
              <span className="purpose-shade" />
              <span className="purpose-copy">
                <small>{item.label}</small>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <i>
                  Explore direction <ArrowRight />
                </i>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="builder-feature">
        <div className="shell builder-feature-grid">
          <div className="builder-feature-image">
            <Image
              src="/generated/builder-hero.png"
              alt="Premium gable workshop visualisation"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <span>720 real render combinations</span>
          </div>
          <div className="builder-feature-copy">
            <p className="eyebrow light">
              <i />
              Interactive shed builder
            </p>
            <h2>
              See your direction
              <br />
              before the drawings.
            </h2>
            <p>
              Switch purpose, roof style, cladding profile and Colorbond finish.
              Every choice loads a dedicated pre-rendered image—not a generic
              colour filter.
            </p>
            <ul>
              <li>
                <Check />
                Four purpose-built structure families
              </li>
              <li>
                <Check />
                Five distinct building styles
              </li>
              <li>
                <Check />
                Three cladding profiles
              </li>
              <li>
                <Check />
                Twelve Colorbond finishes
              </li>
            </ul>
            <Link className="button primary" href="/builder">
              Open the shed builder <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="delivery shell section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <i />
              One accountable team
            </p>
            <h2>
              From rough idea
              <br />
              to finished structure.
            </h2>
          </div>
          <p>
            We remove the hand-offs that make building stressful. The same team
            can coordinate the complete path.
          </p>
        </div>
        <div className="delivery-grid">
          <article>
            <DraftingCompass />
            <span>01</span>
            <h3>Design & engineering</h3>
            <p>
              Purpose, access, structure and site conditions resolved into a
              buildable design.
            </p>
          </article>
          <article>
            <ShieldCheck />
            <span>02</span>
            <h3>Permits & approvals</h3>
            <p>
              Planning, engineering and permit requirements coordinated before
              site work begins.
            </p>
          </article>
          <article>
            <Hammer />
            <span>03</span>
            <h3>Supply & construction</h3>
            <p>
              Australian-made materials, slab and installation delivered with
              clear responsibility.
            </p>
          </article>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="shell">
          <div className="section-heading light-heading">
            <div>
              <p className="eyebrow light">
                <i />
                Selected work
              </p>
              <h2>
                Built, not
                <br />
                just promised.
              </h2>
            </div>
            <div>
              <p>
                Real structures across residential, agricultural, commercial and
                architectural work.
              </p>
              <Link className="text-action light" href="/projects">
                View all 28 project images <ArrowRight />
              </Link>
            </div>
          </div>
          <ProjectGallery limit={6} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
