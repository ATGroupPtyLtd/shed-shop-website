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

const serviceEntries = [
  {
    ...purposes[0],
    image: "/projects/project-06.jpg",
    features: [
      "Garages and secure storage",
      "Workshops and hobby spaces",
      "Doors, windows and insulation",
    ],
  },
  {
    ...purposes[1],
    image: "/projects/project-19.jpg",
    features: [
      "Machinery and implement storage",
      "Open-front and high-clearance access",
      "Site-specific rural engineering",
    ],
  },
  {
    ...purposes[2],
    image: "/projects/project-03.jpg",
    features: [
      "Workshops and warehouses",
      "Large-span operational buildings",
      "Mezzanines and future expansion",
    ],
  },
  {
    ...purposes[3],
    image: "/projects/project-05.jpg",
    features: [
      "Hangars, shelters and community buildings",
      "Non-standard forms and footprints",
      "Architectural finishes and details",
    ],
  },
] as const;

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="home-hero">
        <Image
          src="/generated/home-hero-hd.webp"
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
              Family-owned. Built for Victoria.
            </p>
            <h1>
              <span>Designed for you,</span>
              <span>
                <em>Built to last</em>
              </span>
            </h1>
            <p>
              From the first sketch to the final bolt, our local team makes
              custom shed projects clear, personal and easier to manage.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/builder">
                Design your shed <ArrowRight />
              </Link>
              <Link className="text-action light" href="/#what-we-build">
                See what we build <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="hero-project">
            <span>Featured project - Traralgon</span>
            <strong>Architectural trade facility</strong>
            <p>Custom facade - Large-span workshop - Turnkey delivery</p>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Why choose The Shed Shop">
        <div className="shell">
          {[
            ["01", "Family-owned in Victoria"],
            ["02", "One team from start to finish"],
            ["03", "Site-specific engineering"],
            ["04", "Australian-made steel"],
          ].map(([n, label]) => (
            <div key={n}>
              <b>{n}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="home-services shell section-space"
        id="what-we-build"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <i />
              What we build
            </p>
            <h2>
              A shed with
              <br />
              a job to do.
            </h2>
          </div>
          <div>
            <p>
              Every project starts with how you will use it. We shape the
              structure, access, finish and approval pathway around your site,
              your priorities and your future plans.
            </p>
            <Link className="text-action" href="/builder">
              Explore the shed builder <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="service-grid">
          {serviceEntries.map((item, index) => (
            <article className="service-card" key={item.id}>
              <div className="service-card-image">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 850px) 100vw, 50vw"
                />
                <span>0{index + 1}</span>
              </div>
              <div className="service-card-copy">
                <p className="eyebrow">
                  <i />
                  {item.label}
                </p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>
                      <Check />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  className="text-action"
                  href={`/builder?purpose=${item.id}`}
                >
                  Start with this direction <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="service-guidance">
          <div>
            <span>Not sure where your project fits?</span>
            <strong>That&apos;s exactly what we&apos;re here for.</strong>
            <p>
              Tell us what you need the building to do and our team will help
              you find the right starting point.
            </p>
          </div>
          <Link className="button" href="/quote">
            Talk to our team <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="specialist-band home-specialist">
        <div className="shell">
          <div className="specialist-heading">
            <div>
              <p className="eyebrow light">
                <i />
                Built beyond the shell
              </p>
              <h2>Capability where it counts.</h2>
            </div>
            <p>
              Practical upgrades and considered finishes can be integrated into
              residential, farm, commercial and special-purpose projects.
            </p>
          </div>
          <div className="specialist-cards">
            <article>
              <Image
                src="/projects/project-15.jpg"
                alt="Engineered mezzanine floor structure"
                fill
                sizes="(max-width: 850px) 100vw, 50vw"
              />
              <span />
              <div>
                <small>Make more of the footprint</small>
                <h3>Mezzanine systems</h3>
                <p>
                  Engineered intermediate floors for storage, offices or
                  operational space - planned as part of the complete building.
                </p>
              </div>
            </article>
            <article>
              <Image
                src="/projects/project-09.jpg"
                alt="Custom steel structure with architectural cladding"
                fill
                sizes="(max-width: 850px) 100vw, 50vw"
              />
              <span />
              <div>
                <small>Performance with presence</small>
                <h3>Architectural finishes</h3>
                <p>
                  Contemporary cladding and considered facade treatments for a
                  building that works hard and looks at home on your property.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="builder-feature">
        <div className="shell builder-feature-grid">
          <div className="builder-feature-image">
            <Image
              src="/concepts/home-gable.webp"
              alt="Completed gable workshop project"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <span>20 completed projects</span>
          </div>
          <div className="builder-feature-copy">
            <p className="eyebrow light">
              <i />
              Interactive shed builder
            </p>
            <h2>
              Find your direction
              <br />
              before the drawings.
            </h2>
            <p>
              Compare purpose and building form with a dedicated concept image,
              then nominate your preferred cladding profile and COLORBOND
              finish for your project brief.
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
                Three cladding profiles to nominate
              </li>
              <li>
                <Check />
                28 COLORBOND finishes to nominate
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
              A clearer path
              <br />
              from idea to build.
            </h2>
          </div>
          <p>
            You should always know what happens next and who to call. Our local
            team can coordinate the complete project, without the confusing
            hand-offs.
          </p>
        </div>
        <div className="delivery-grid">
          <article>
            <DraftingCompass />
            <span>01</span>
            <h3>Design & engineering</h3>
            <p>
              Purpose, access, structure and site conditions resolved into a
              practical, buildable design.
            </p>
          </article>
          <article>
            <ShieldCheck />
            <span>02</span>
            <h3>Permits & approvals</h3>
            <p>
              Planning, engineering and permit requirements coordinated before
              work begins on site.
            </p>
          </article>
          <article>
            <Hammer />
            <span>03</span>
            <h3>Supply & construction</h3>
            <p>
              Australian-made materials, slab and installation delivered with
              clear responsibility from start to finish.
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
                Real structures across residential, agricultural, commercial
                and architectural work throughout Victoria.
              </p>
              <Link className="text-action light" href="/projects">
                View all 27 project images <ArrowRight />
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
