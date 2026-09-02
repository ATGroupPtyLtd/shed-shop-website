import Image from "next/image";

export function PageHero({ eyebrow, title, accent, copy, image }: { eyebrow: string; title: string; accent: string; copy: string; image: string }) {
  return <section className="page-hero"><Image src={image} alt="" fill priority sizes="100vw" /><span className="page-hero-shade" /><div className="shell page-hero-content"><p className="eyebrow light"><i />{eyebrow}</p><h1>{title}<br /><em>{accent}</em></h1><p className="page-hero-copy">{copy}</p></div></section>;
}
