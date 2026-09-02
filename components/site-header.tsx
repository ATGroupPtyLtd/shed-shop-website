"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Sheds & services", "/sheds"],
  ["Projects", "/projects"],
  ["Shed builder", "/builder"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <>
    <div className="utility"><span>Australian-made · Family-owned · Built in Victoria</span><a href="tel:0351778433"><Phone />03 5177 8433</a></div>
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="The Shed Shop home"><Image src="/logo-primary.png" alt="The Shed Shop" width={190} height={72} priority /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href}>{label}</Link>)}</nav>
      <Link className="header-cta" href="/quote">Request a quote <ArrowRight /></Link>
      <button className="menu-toggle" type="button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button>
    </header>
    {open ? <div className="mobile-nav"><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button><Link href="/" onClick={() => setOpen(false)}>Home</Link>{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link className="mobile-quote" href="/quote" onClick={() => setOpen(false)}>Request a quote <ArrowRight /></Link></div> : null}
  </>;
}
