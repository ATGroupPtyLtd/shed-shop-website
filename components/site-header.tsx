"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { SocialLinks } from "@/components/social-links";

const links = [
  ["What we build", "/#what-we-build"],
  ["Projects", "/projects"],
  ["Shed builder", "/builder"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href.startsWith("/#")
        ? pathname === "/"
        : pathname === href;
  return (
    <>
      <div className="utility">
        <span>Australian-made · Family-owned · Built in Victoria</span>
        <div className="utility-actions">
          <SocialLinks className="utility-socials" />
          <a className="utility-phone" href="tel:0351778433">
            <Phone />
            03 5177 8433
          </a>
        </div>
      </div>
      <header className="site-header">
        <Link className="site-logo" href="/" aria-label="The Shed Shop home">
          <Image
            src="/logo-primary.png"
            alt="The Shed Shop"
            width={190}
            height={72}
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              className={
                pathname === href || (pathname === "/" && href.startsWith("/#"))
                  ? "active"
                  : ""
              }
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/quote">
          Request a quote <ArrowRight />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu />
        </button>
      </header>
      {open ? (
        <div
          className="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mobile-nav-head">
            <Link
              className="mobile-nav-logo"
              href="/"
              onClick={() => setOpen(false)}
              aria-label="The Shed Shop home"
            >
              <Image
                src="/logo-reverse.png"
                alt="The Shed Shop"
                width={190}
                height={84}
              />
            </Link>
            <button
              className="mobile-nav-close"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>
          <nav className="mobile-nav-links" aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <Link
                className={isActive(href) ? "active" : ""}
                key={href}
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mobile-nav-footer">
            <Link
              className="mobile-quote"
              href="/quote"
              onClick={() => setOpen(false)}
            >
              Request a quote <ArrowRight />
            </Link>
            <div className="mobile-nav-connect">
              <span>Follow our latest builds</span>
              <SocialLinks className="mobile-socials" showLabels />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
