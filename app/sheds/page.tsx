import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { purposes } from "@/lib/site-data";

export const metadata: Metadata = { title: "Sheds & Services", description: "Garages, farm sheds, commercial buildings, mezzanines and custom steel structures designed and built in Victoria." };

const entries = [
  { ...purposes[0], image: "/projects/project-06.jpg", features: ["Garages and secure storage", "Workshops and hobby spaces", "Custom doors, windows and insulation"] },
  { ...purposes[1], image: "/projects/project-19.jpg", features: ["Machinery and implement storage", "Open-front and high-clearance access", "Site-specific rural engineering"] },
  { ...purposes[2], image: "/projects/project-03.jpg", features: ["Workshops and warehouses", "Large-span operational buildings", "Mezzanines and future expansion"] },
  { ...purposes[3], image: "/projects/project-05.jpg", features: ["Architectural cladding", "Bespoke mixed-use structures", "Complex footprints and façades"] },
];

export default function ShedsPage() {
  return <main><SiteHeader /><PageHero eyebrow="Sheds & services" title="Structure first." accent="Purpose in every detail." copy="Residential, agricultural, commercial and custom steel buildings—designed around the site, the work and what comes next." image="/projects/project-16.jpg" />
    <section className="range-list shell section-space">{entries.map((item, index) => <article className="range-entry" key={item.id}><div className="range-entry-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 55vw" /><span>0{index + 1}</span></div><div className="range-entry-copy"><p className="eyebrow"><i />{item.label}</p><h2>{item.title}</h2><p>{item.description}</p><ul>{item.features.map(feature => <li key={feature}><Check />{feature}</li>)}</ul><Link className="text-action" href={`/builder?purpose=${item.id}`}>Configure this direction <ArrowRight /></Link></div></article>)}</section>
    <section className="specialist-band"><div className="shell"><div><p className="eyebrow light"><i />Specialist capability</p><h2>More than a shed shell.</h2></div><div className="specialist-cards"><article><Image src="/projects/project-15.jpg" alt="Mezzanine floor structure" fill sizes="50vw" /><span /><div><small>Space optimisation</small><h3>Mezzanine systems</h3><p>Engineered intermediate floors that add storage, office or operational area without increasing the footprint.</p></div></article><article><Image src="/projects/project-09.jpg" alt="Architectural custom steel structure" fill sizes="50vw" /><span /><div><small>Custom finish</small><h3>Architectural cladding</h3><p>Contemporary profiles and bespoke façade treatments for buildings that need to perform and represent your business.</p></div></article></div></div></section>
    <SiteFooter /></main>;
}
