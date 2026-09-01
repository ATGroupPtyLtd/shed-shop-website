import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shed-shop.com.au"),
  title: "The Shed Shop | Built for What’s Next",
  description: "Custom Australian-made sheds, designed, approved and built for Victorian homes, farms and businesses.",
  openGraph: {
    title: "The Shed Shop | Built for What’s Next",
    description: "Custom sheds. Designed, approved and built in Victoria.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Shed Shop | Built for What’s Next",
    description: "Custom sheds. Designed, approved and built in Victoria.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
