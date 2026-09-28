const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/theshedshopau",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/The-Shed-Shop/100087313825814/",
    icon: "facebook",
  },
] as const;

export function SocialLinks({
  className = "",
  showLabels = false,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <div className={`social-links ${className}`.trim()}>
      {socials.map(({ label, href, icon }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow The Shed Shop on ${label}`}
          key={label}
        >
          <i className={`social-icon social-icon-${icon}`} aria-hidden="true" />
          {showLabels ? <span>{label}</span> : null}
        </a>
      ))}
    </div>
  );
}
