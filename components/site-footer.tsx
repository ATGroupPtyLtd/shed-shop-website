import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta shell">
        <div>
          <span>Have a project in mind?</span>
          <h2>
            Bring us the job.
            <br />
            We’ll build the answer.
          </h2>
        </div>
        <Link href="/quote">
          Start a conversation <ArrowRight />
        </Link>
      </div>
      <div className="footer-main shell">
        <div className="footer-brand">
          <Link href="/">
            <Image
              src="/logo-reverse.png"
              alt="The Shed Shop"
              width={220}
              height={98}
            />
          </Link>
          <p>
            Purpose-built steel structures for Victorian homes, farms and
            businesses.
          </p>
        </div>
        <div>
          <span>Explore</span>
          <Link href="/sheds">Sheds & services</Link>
          <Link href="/projects">Project portfolio</Link>
          <Link href="/builder">Shed builder</Link>
          <Link href="/about">About us</Link>
        </div>
        <div>
          <span>Contact</span>
          <a href="tel:0351778433">03 5177 8433</a>
          <a href="mailto:admin@shed-shop.com.au">admin@shed-shop.com.au</a>
          <p>
            6 Stirloch Circuit
            <br />
            Traralgon East VIC 3844
          </p>
        </div>
      </div>
      <div className="footer-bottom shell">
        <span>© 2026 The Shed Shop</span>
        <span>Design · Permits · Supply · Construction</span>
      </div>
    </footer>
  );
}
