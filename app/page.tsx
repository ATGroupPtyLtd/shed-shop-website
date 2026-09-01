"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Factory,
  Hammer,
  Menu,
  Phone,
  Sparkles,
  Tractor,
  UploadCloud,
  Warehouse,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const shedTypes = [
  {
    id: "home",
    eyebrow: "For home",
    title: "Garage & Workshop",
    blurb: "Cars, tools, hobbies and the room to finally do things properly.",
    icon: Hammer,
    image: "https://shed-shop.com.au/gallery_gen/87085c9edffa65955ca766b0a90c7066_944x708_fit.jpg?ts=1777524745",
  },
  {
    id: "farm",
    eyebrow: "For the land",
    title: "Farm & Machinery",
    blurb: "Practical spans, generous access and protection built around the way you work.",
    icon: Tractor,
    image: "https://shed-shop.com.au/gallery_gen/6901f8c2f45d98df3e170a86ea62f2b6_1662x1246_fit.jpg?ts=1777524745",
  },
  {
    id: "business",
    eyebrow: "For business",
    title: "Commercial & Industrial",
    blurb: "Warehousing, workshops and purpose-built spaces that leave room to grow.",
    icon: Factory,
    image: "https://shed-shop.com.au/gallery_gen/224c883654675639c99037aa8216d3bc_fit.jpg?ts=1777524745",
  },
  {
    id: "custom",
    eyebrow: "For big ideas",
    title: "Custom Structures",
    blurb: "Architectural cladding, mezzanines and uncommon builds without the usual compromise.",
    icon: Building2,
    image: "https://shed-shop.com.au/gallery_gen/48bae070cf9b6069c30d17b8e0e3e650_1968x1312_fit.jpg?ts=1777524745",
  },
];

const serviceLevels = [
  { id: "supply", label: "Supply only", note: "A quality shed package, ready for your builder." },
  { id: "supply-install", label: "Supply & install", note: "We supply the kit and construct it on site." },
  { id: "turnkey", label: "Complete project", note: "Design, permits, slab, supply and construction handled." },
];

const colourOptions = [
  { name: "Monument", hex: "#323333" },
  { name: "Surfmist", hex: "#d7d8cf" },
  { name: "Woodland Grey", hex: "#4c514b" },
  { name: "Night Sky", hex: "#16191b" },
  { name: "Shale Grey", hex: "#b4b4ac" },
  { name: "Basalt", hex: "#6d6e6c" },
];

const accessoryOptions = ["Mezzanine", "Skylights", "Whirlybirds", "Gutters & downpipes", "Awning", "Internal lining"];

const styleSlugs: Record<string, string> = {
  "Gable": "gable",
  "Skillion": "skillion",
  "American barn": "barn",
  "Open-front": "open",
  "Custom / not sure": "custom",
};

const showcase = [
  {
    title: "Clean lines. Serious structure.",
    tag: "Commercial",
    image: "https://shed-shop.com.au/gallery_gen/48bae070cf9b6069c30d17b8e0e3e650_1968x1312_fit.jpg?ts=1777524745",
  },
  {
    title: "Built around the way you work.",
    tag: "Large-span shed",
    image: "https://shed-shop.com.au/gallery_gen/6901f8c2f45d98df3e170a86ea62f2b6_1662x1246_fit.jpg?ts=1777524745",
  },
  {
    title: "Practical space, professionally finished.",
    tag: "Workshop",
    image: "https://shed-shop.com.au/gallery_gen/87085c9edffa65955ca766b0a90c7066_944x708_fit.jpg?ts=1777524745",
  },
  {
    title: "Structure designed for serious use.",
    tag: "Industrial",
    image: "https://shed-shop.com.au/gallery_gen/224c883654675639c99037aa8216d3bc_fit.jpg?ts=1777524745",
  },
  {
    title: "From steel frame to finished exterior.",
    tag: "Project delivery",
    image: "https://shed-shop.com.au/gallery/Screenshot%202025-05-12%20at%203.23.04%E2%80%AFpm.png?ts=1777524744",
  },
  {
    title: "The Shed Shop — built to be recognised.",
    tag: "Finished exterior",
    image: "https://shed-shop.com.au/gallery/Screenshot%202024-10-31%20at%209.21.14%E2%80%AFam.png?ts=1777524746",
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shedType, setShedType] = useState("home");
  const [service, setService] = useState("turnkey");
  const [width, setWidth] = useState("9");
  const [length, setLength] = useState("12");
  const [height, setHeight] = useState("3.6");
  const [style, setStyle] = useState("Gable");
  const [frameType, setFrameType] = useState("Welded RHS");
  const [colour, setColour] = useState("Monument");
  const [rollerDoors, setRollerDoors] = useState("1");
  const [rollerSize, setRollerSize] = useState("3.0m W × 2.7m H");
  const [accessDoors, setAccessDoors] = useState("1");
  const [windows, setWindows] = useState("0");
  const [roofInsulation, setRoofInsulation] = useState("No");
  const [wallInsulation, setWallInsulation] = useState("No");
  const [accessories, setAccessories] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const selectedShed = useMemo(() => shedTypes.find((item) => item.id === shedType) ?? shedTypes[0], [shedType]);
  const selectedService = useMemo(() => serviceLevels.find((item) => item.id === service) ?? serviceLevels[2], [service]);
  const selectedColour = useMemo(() => colourOptions.find((item) => item.name === colour) ?? colourOptions[0], [colour]);
  const selectedConcept = `/concepts/${shedType}-${styleSlugs[style] ?? "custom"}.png`;
  const activeProject = galleryIndex === null ? null : showcase[galleryIndex];

  const toggleAccessory = (item: string) => {
    setAccessories((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };

  const chooseShed = (id: string) => {
    setShedType(id);
    document.getElementById("design")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <div className="utility-bar">
        <span>Australian-made sheds · Designed and built in Victoria</span>
        <a href="tel:0351778433"><Phone aria-hidden="true" /> 03 5177 8433</a>
      </div>

      <header className="site-header">
        <a href="#top" className="brand" aria-label="The Shed Shop home">
          <img src="/logo-primary.png" alt="The Shed Shop — Designed for you, built to last" />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#range">SHED RANGE</a>
          <a href="#why">WHY US</a>
          <a href="#process">HOW IT WORKS</a>
          <a href="#projects">PROJECTS</a>
        </nav>
        <Button asChild className="nav-cta"><a href="#design">PLAN MY SHED <ArrowRight /></a></Button>
        <button className="menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></button>
      </header>

      {mobileOpen && (
        <div className="mobile-menu">
          <button aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></button>
          <a href="#range" onClick={() => setMobileOpen(false)}>SHED RANGE</a>
          <a href="#why" onClick={() => setMobileOpen(false)}>WHY US</a>
          <a href="#process" onClick={() => setMobileOpen(false)}>HOW IT WORKS</a>
          <a href="#projects" onClick={() => setMobileOpen(false)}>PROJECTS</a>
          <a className="mobile-cta" href="#design" onClick={() => setMobileOpen(false)}>PLAN MY SHED <ArrowRight /></a>
        </div>
      )}

      <section className="hero" id="top">
        <div className="hero-image" role="img" aria-label="A finished custom steel shed in Victoria" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow light"><span /> Victoria&apos;s complete shed team</p>
            <h1>Built for<br /><em>what&apos;s next.</em></h1>
            <p className="hero-lead">One experienced team to design, approve, supply and build the shed your home, farm or business actually needs.</p>
            <div className="hero-actions">
              <Button asChild className="primary-button"><a href="#design">Design your shed <ArrowRight /></a></Button>
              <a className="text-link light-link" href="tel:0351778433">Or talk to a shed expert <Phone /></a>
            </div>
          </div>
          <div className="hero-proof">
            <div><strong>01</strong><span>Australian-made<br />materials</span></div>
            <div><strong>02</strong><span>Permits to final<br />construction</span></div>
            <div><strong>03</strong><span>Built around<br />your site</span></div>
          </div>
        </div>
        <a className="scroll-cue" href="#range"><span>Explore</span><ChevronDown /></a>
      </section>

      <section className="intro section-shell" id="range">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> Start with the job</p><h2>What does your shed<br />need to do?</h2></div>
          <p>Forget technical jargon for now. Choose what fits your life and we&apos;ll help shape the right structure, access, materials and approvals.</p>
        </div>
        <div className="type-grid">
          {shedTypes.map((item) => {
            const Icon = item.icon;
            return (
              <article className="type-card" key={item.id}>
                <img src={item.image} alt="" />
                <div className="type-overlay" />
                <div className="type-content">
                  <div className="type-icon"><Icon /></div>
                  <p>{item.eyebrow}</p><h3>{item.title}</h3><span>{item.blurb}</span>
                  <button onClick={() => chooseShed(item.id)}>Choose this shed <ArrowRight /></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="designer" id="design">
        <div className="section-shell">
          <div className="designer-intro">
            <p className="eyebrow orange"><span /> Interactive shed builder</p>
            <h2>See the direction.<br />Build the complete brief.</h2>
            <p>Choose as much as you know. Every field can be changed later, and “not sure” is always a valid answer.</p>
          </div>

          <div className="builder-layout">
            <aside className="preview-column">
              <div className="live-preview">
                <img className="concept-render" key={`${shedType}-${style}`} src={selectedConcept} alt={`${style} ${selectedShed.title} architectural concept`} />
                <div className="preview-wash" />
                <span className="preview-label">LIVE CONCEPT · {style.toUpperCase()}</span>
                <div className="preview-copy">
                  <p>{selectedShed.eyebrow}</p>
                  <h3>{style} {selectedShed.title}</h3>
                  <div className="preview-specs">
                    <span>{width || "?"} × {length || "?"} × {height || "?"}m</span>
                    <span>{rollerDoors} roller door{rollerDoors === "1" ? "" : "s"}</span>
                    <span>{accessDoors} access door{accessDoors === "1" ? "" : "s"}</span>
                    <span>{windows} window{windows === "1" ? "" : "s"}</span>
                    <span>Roof insulation: {roofInsulation}</span>
                    <span>Walls: {wallInsulation}</span>
                  </div>
                </div>
                <div className="colour-readout"><i style={{ background: selectedColour.hex }} /><span><small>Selected finish</small>{colour}</span></div>
              </div>
              <p className="preview-note">The concept updates to match your chosen purpose and building style. Dimensions, openings, finish and inclusions are tracked live and confirmed in final drawings.</p>
              <div className="running-summary">
                <span>YOUR BUILD SO FAR</span>
                <strong>{frameType} · {selectedService.label}</strong>
                <small>{accessories.length ? accessories.join(" · ") : "No accessories selected yet"}</small>
              </div>
            </aside>

            <div className="configurator advanced-config">
              <div className="config-topline"><span>COMPLETE PROJECT BUILDER</span><span>Flexible—skip anything unknown</span></div>

              <div className="config-block">
                <label><span className="step-number">01</span> Shed purpose & structure</label>
                <div className="choice-row type-choice-row">
                  {shedTypes.map((item) => {
                    const Icon = item.icon;
                    return <button type="button" key={item.id} className={shedType === item.id ? "selected" : ""} onClick={() => setShedType(item.id)}><Icon /><span>{item.title}</span>{shedType === item.id && <Check className="check" />}</button>;
                  })}
                </div>
                <div className="field-grid two builder-fields">
                  <label><span>Building style</span><NativeSelect value={style} onChange={(e) => setStyle(e.target.value)} className="form-select"><NativeSelectOption>Gable</NativeSelectOption><NativeSelectOption>Skillion</NativeSelectOption><NativeSelectOption>American barn</NativeSelectOption><NativeSelectOption>Open-front</NativeSelectOption><NativeSelectOption>Custom / not sure</NativeSelectOption></NativeSelect></label>
                  <label><span>Frame type</span><NativeSelect value={frameType} onChange={(e) => setFrameType(e.target.value)} className="form-select"><NativeSelectOption>Welded RHS</NativeSelectOption><NativeSelectOption>Universal beam (UB)</NativeSelectOption><NativeSelectOption>Cold-formed steel</NativeSelectOption><NativeSelectOption>Not sure—recommend one</NativeSelectOption></NativeSelect></label>
                </div>
              </div>

              <div className="config-block">
                <label><span className="step-number">02</span> Size & finish <small>rough dimensions are fine</small></label>
                <div className="dimension-row">
                  <div><Input aria-label="Width in metres" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} /><span>W</span></div><b>×</b>
                  <div><Input aria-label="Length in metres" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} /><span>L</span></div><b>×</b>
                  <div><Input aria-label="Eave height in metres" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} /><span>H</span></div>
                </div>
                <p className="helper">Width × length × eave height, in metres.</p>
                <div className="colour-section"><span>Preferred Colorbond finish</span><div className="colour-options">{colourOptions.map((item) => <button type="button" key={item.name} aria-label={item.name} title={item.name} className={colour === item.name ? "selected" : ""} onClick={() => setColour(item.name)}><i style={{ background: item.hex }} />{item.name}</button>)}</div></div>
              </div>

              <div className="config-block">
                <label><span className="step-number">03</span> Doors & windows</label>
                <div className="field-grid four builder-fields">
                  <label><span>Roller doors</span><NativeSelect value={rollerDoors} onChange={(e) => setRollerDoors(e.target.value)} className="form-select">{["0","1","2","3","4","5+"].map((n) => <NativeSelectOption key={n}>{n}</NativeSelectOption>)}</NativeSelect></label>
                  <label><span>Door size</span><NativeSelect value={rollerSize} onChange={(e) => setRollerSize(e.target.value)} className="form-select"><NativeSelectOption>2.4m W × 2.4m H</NativeSelectOption><NativeSelectOption>3.0m W × 2.7m H</NativeSelectOption><NativeSelectOption>3.6m W × 3.0m H</NativeSelectOption><NativeSelectOption>4.8m W × 4.5m H</NativeSelectOption><NativeSelectOption>Custom / not sure</NativeSelectOption></NativeSelect></label>
                  <label><span>Access doors</span><NativeSelect value={accessDoors} onChange={(e) => setAccessDoors(e.target.value)} className="form-select">{["0","1","2","3","4+"].map((n) => <NativeSelectOption key={n}>{n}</NativeSelectOption>)}</NativeSelect></label>
                  <label><span>Windows</span><NativeSelect value={windows} onChange={(e) => setWindows(e.target.value)} className="form-select">{["0","1","2","3","4","5+"].map((n) => <NativeSelectOption key={n}>{n}</NativeSelectOption>)}</NativeSelect></label>
                </div>
              </div>

              <div className="config-block">
                <label><span className="step-number">04</span> Insulation & accessories</label>
                <div className="field-grid two builder-fields">
                  <label><span>Roof insulation</span><NativeSelect value={roofInsulation} onChange={(e) => setRoofInsulation(e.target.value)} className="form-select"><NativeSelectOption>No</NativeSelectOption><NativeSelectOption>Yes</NativeSelectOption><NativeSelectOption>Not sure—advise me</NativeSelectOption></NativeSelect></label>
                  <label><span>Wall insulation</span><NativeSelect value={wallInsulation} onChange={(e) => setWallInsulation(e.target.value)} className="form-select"><NativeSelectOption>No</NativeSelectOption><NativeSelectOption>Yes</NativeSelectOption><NativeSelectOption>Not sure—advise me</NativeSelectOption></NativeSelect></label>
                </div>
                <div className="accessory-options">{accessoryOptions.map((item) => <button type="button" key={item} className={accessories.includes(item) ? "selected" : ""} onClick={() => toggleAccessory(item)}><span>{accessories.includes(item) && <Check />}</span>{item}</button>)}</div>
              </div>

              <div className="config-block">
                <label><span className="step-number">05</span> What would you like quoted?</label>
                <div className="service-choices">
                  {serviceLevels.map((item) => <button type="button" key={item.id} className={service === item.id ? "selected" : ""} onClick={() => setService(item.id)}><span className="radio"><i /></span><span><strong>{item.label}</strong><small>{item.note}</small></span></button>)}
                </div>
              </div>

              <div className="brief-summary">
                <div><span>Ready to finish</span><strong>{selectedShed.title} · {style} · {width || "?"} × {length || "?"} × {height || "?"}m</strong></div>
                <Button asChild className="primary-button"><a href="#quote">ADD CONTACT DETAILS <ArrowRight /></a></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why section-shell" id="why">
        <div className="why-visual">
          <img src="https://shed-shop.com.au/gallery_gen/6901f8c2f45d98df3e170a86ea62f2b6_1662x1246_fit.jpg?ts=1777524745" alt="A completed custom shed structure" />
          <div className="visual-note"><Sparkles /><span>Every detail considered.<br /><strong>Every stage connected.</strong></span></div>
        </div>
        <div className="why-copy">
          <p className="eyebrow"><span /> Why The Shed Shop</p><h2>A better shed starts<br />with a better process.</h2>
          <p className="lead-copy">A shed is a substantial investment. You shouldn&apos;t have to coordinate designers, permit specialists, suppliers, concreters and builders yourself.</p>
          <div className="feature-list">
            <div><span>01</span><div><h3>One team, start to finish</h3><p>Design, architectural guidance, permits, supply, slab and construction can all live under one roof.</p></div></div>
            <div><span>02</span><div><h3>Strength where it matters</h3><p>Fully welded RHS frames or universal beams, paired with Australian-made Colorbond steel.</p></div></div>
            <div><span>03</span><div><h3>Designed for your property</h3><p>Site, access, use and future plans shape the structure—not a one-size-fits-all catalogue.</p></div></div>
          </div>
        </div>
      </section>

      <section className="materials-band" aria-label="Australian made materials and trusted suppliers">
        <div className="section-shell materials-grid">
          <div><span>MATERIALS THAT EARN THEIR PLACE</span><strong>Australian made. Proven outside.</strong></div>
          <div className="material-mark australian-mark"><img src="https://shed-shop.com.au/gallery_gen/69406c88787a66584e930354af70ee04_fit.png?ts=1777524746" alt="Australian Made certification" /><span>Manufactured with Australian-made materials</span></div>
          <div className="material-mark"><img src="https://shed-shop.com.au/gallery_gen/76a5fa7bcc8a4afb38d0605afd57d6dc_fit.png?ts=1777524746" alt="Colorbond steel" /><span>Durable Colorbond steel finishes</span></div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="section-shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow light"><span /> From idea to keys</p><h2>One clear path.<br />No loose ends.</h2></div>
            <p>We turn a rough idea into a buildable project, then keep you informed as it moves from paper to property.</p>
          </div>
          <div className="process-grid">
            {[
              ["01", "Tell us the job", "Share the purpose, rough size and location. We’ll ask the questions that matter."],
              ["02", "Shape the design", "We refine layout, access, cladding and inclusions around your site and budget."],
              ["03", "Approvals & prep", "Drafting, engineering, permits and the slab are coordinated where required."],
              ["04", "Build with confidence", "Your structure is supplied, installed and finished by an experienced team."],
            ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="projects section-shell" id="projects">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> Project gallery</p><h2>Built, not just promised.</h2></div>
          <a className="text-link" href="#quote">Bring us your idea <ArrowRight /></a>
        </div>
        <div className="credibility-row">
          <div><strong>01</strong><span>Real completed projects</span></div>
          <div><strong>02</strong><span>Residential to industrial</span></div>
          <div><strong>03</strong><span>Design through construction</span></div>
        </div>
        <div className="gallery-grid">
          {showcase.map((item, index) => (
            <button
              type="button"
              className={`gallery-item ${index === 0 ? "gallery-feature" : ""}`}
              key={item.title}
              onClick={() => setGalleryIndex(index)}
              aria-label={`View project: ${item.title}`}
            >
              <img src={item.image} alt="" />
              <div className="gallery-shade" />
              <div className="gallery-copy">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <span className="gallery-view">VIEW PROJECT <ArrowRight /></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <Dialog open={galleryIndex !== null} onOpenChange={(open) => !open && setGalleryIndex(null)}>
        <DialogContent className="project-dialog">
          {activeProject && (
            <>
              <div className="project-dialog-image"><img src={activeProject.image} alt={activeProject.title} /></div>
              <div className="project-dialog-copy">
                <span>{activeProject.tag} · {String((galleryIndex ?? 0) + 1).padStart(2, "0")}/{String(showcase.length).padStart(2, "0")}</span>
                <DialogTitle>{activeProject.title}</DialogTitle>
                <DialogDescription>A closer look at one of The Shed Shop&apos;s completed structures. Explore the complete project gallery using the arrows.</DialogDescription>
                <div className="dialog-nav">
                  <button type="button" onClick={() => setGalleryIndex((current) => current === null ? 0 : (current - 1 + showcase.length) % showcase.length)}>PREVIOUS</button>
                  <button type="button" onClick={() => setGalleryIndex((current) => current === null ? 0 : (current + 1) % showcase.length)}>NEXT <ArrowRight /></button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <section className="quote-section" id="quote">
        <div className="section-shell quote-grid">
          <div className="quote-copy">
            <p className="eyebrow orange"><span /> Start the conversation</p><h2>Let&apos;s build the shed<br />you&apos;ll be proud of.</h2>
            <p>Send the basics. A real person from our Traralgon team can help turn them into the right plan.</p>
            <div className="quote-details">
              <a href="tel:0351778433"><Phone /><span><small>Call the team</small>03 5177 8433</span></a>
              <a href="mailto:admin@shed-shop.com.au"><Warehouse /><span><small>Email us</small>admin@shed-shop.com.au</span></a>
            </div>
            <p className="address">6 Stirloch Circuit, Traralgon East VIC 3844</p>
          </div>
          <div className="quote-card">
            {submitted ? (
              <div className="success-state">
                <div><Check /></div><p className="eyebrow orange"><span /> Brief ready</p><h3>That&apos;s the hard part done.</h3>
                <p>Your project summary is ready for the Shed Shop team. In the live production site, this will connect directly to their enquiry inbox.</p>
                <button onClick={() => setSubmitted(false)}>Edit project details</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div className="form-heading"><span>YOUR PROJECT BRIEF</span><strong>{selectedShed.title} · {style} · {width} × {length} × {height}m</strong></div>
                <div className="quote-summary-grid">
                  <div><small>Structure</small><strong>{frameType}</strong></div>
                  <div><small>Openings</small><strong>{rollerDoors} roller ({rollerSize}) · {accessDoors} access · {windows} windows</strong></div>
                  <div><small>Insulation</small><strong>Roof: {roofInsulation} · Walls: {wallInsulation}</strong></div>
                  <div><small>Quote</small><strong>{selectedService.label}</strong></div>
                </div>
                <div className="field-grid two">
                  <label><span>Your name *</span><Input required placeholder="e.g. Matthew Smith" /></label>
                  <label><span>Phone number *</span><Input required type="tel" placeholder="04xx xxx xxx" /></label>
                </div>
                <div className="field-grid two">
                  <label><span>Email *</span><Input required type="email" placeholder="you@example.com" /></label>
                  <label><span>Project location *</span><Input required placeholder="Suburb or postcode" /></label>
                </div>
                <div className="field-grid two">
                  <label><span>Shed type</span><NativeSelect className="form-select" value={shedType} onChange={(e) => setShedType(e.target.value)}>{shedTypes.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.title}</NativeSelectOption>)}</NativeSelect></label>
                  <label><span>Project level</span><NativeSelect className="form-select" value={service} onChange={(e) => setService(e.target.value)}>{serviceLevels.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.label}</NativeSelectOption>)}</NativeSelect></label>
                </div>
                <label><span>Additional notes</span><Textarea rows={4} placeholder="Timing, site access, intended use, budget range—or simply tell us what you're unsure about." /></label>
                <div className="upload-field">
                  <span>Upload a sketch or design</span>
                  <label className="upload-surface">
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(e) => setUploadedFile(e.target.files?.[0]?.name ?? "")} />
                    <span className="upload-icon"><UploadCloud /></span>
                    <span className="upload-copy">
                      <strong>{uploadedFile || "ADD A SKETCH OR PLAN"}</strong>
                      <small>{uploadedFile ? "File selected — choose again to replace" : "PDF, PNG, JPG or Word document · optional"}</small>
                    </span>
                    <span className="upload-button">{uploadedFile ? "CHANGE FILE" : "CHOOSE FILE"}</span>
                  </label>
                </div>
                <div className="form-footer"><p>No spam. Just practical advice about your project.</p><Button type="submit" className="primary-button">SEND MY BRIEF <ArrowRight /></Button></div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-grid">
          <div className="footer-brand"><a href="#top" className="brand"><img src="/logo-reverse.png" alt="The Shed Shop" /></a><p>Purpose-built sheds for Victorian homes, farms and businesses.</p></div>
          <div><span>Explore</span><a href="#range">Shed range</a><a href="#why">Why us</a><a href="#process">How it works</a><a href="#projects">Projects</a></div>
          <div><span>Build</span><a href="#design">Quick project builder</a><a href="#quote">Request a quote</a><a href="tel:0351778433">Speak to the team</a></div>
          <div><span>Contact</span><a href="tel:0351778433">03 5177 8433</a><a href="mailto:admin@shed-shop.com.au">admin@shed-shop.com.au</a><p>6 Stirloch Circuit<br />Traralgon East VIC 3844</p></div>
        </div>
        <div className="section-shell footer-bottom"><span>© 2026 The Shed Shop</span><span>Australian-made · Family-owned · Built in Victoria</span></div>
      </footer>
    </main>
  );
}
