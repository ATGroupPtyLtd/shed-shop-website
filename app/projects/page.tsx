import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Project Portfolio", description: "Explore real residential, agricultural, commercial and architectural shed projects across Victoria." };

export default function ProjectsPage() {
  return <main><SiteHeader /><PageHero eyebrow="Project portfolio" title="Real work." accent="Real structures." copy="Twenty-eight original images from completed buildings, interiors, fabrication and construction—because capability is better shown than claimed." image="/projects/project-12.jpg" /><section className="portfolio-page shell section-space"><div className="portfolio-intro"><h2>Every stage.<br />Every scale.</h2><p>Filter the complete original Shed Shop image collection by the kind of outcome you are planning. Select any project for a closer view.</p></div><ProjectGallery /></section><SiteFooter /></main>;
}
