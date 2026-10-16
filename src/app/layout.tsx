import type { Metadata, Viewport } from "next";
import { Anton, Caveat_Brush, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { personal, SITE_URL } from "@/data/portfolio";

const display = Anton({ weight: "400", variable: "--f-display", subsets: ["latin"] });
const hand = Caveat_Brush({ weight: "400", variable: "--f-hand", subsets: ["latin"] });
const sans = Inter({ variable: "--f-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--f-mono", subsets: ["latin"] });

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const title = `${personal.name} | Software Engineer — Mobile & Web`;
const description =
  "Engineering digital tools that simplify human complexity. Taha Ben Romdhane is a software engineer in Tunis, Tunisia building high-impact web platforms and mobile applications with React, Next.js, Laravel and Node.js.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "Taha Ben Romdhane",
    "Software Engineer Tunisia",
    "Full Stack Developer Tunis",
    "React developer",
    "Next.js developer",
    "Laravel developer",
    "Mobile app developer Tunisia",
  ],
  authors: [{ name: personal.name, url: SITE_URL }],
  creator: personal.name,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title,
    description,
    siteName: `${personal.name} Portfolio`,
    locale: "en_US",
    images: [{ url: personal.image, width: 1200, height: 1500, alt: personal.name }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [personal.image],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  url: SITE_URL,
  image: `${SITE_URL}${personal.image}`,
  jobTitle: personal.role,
  description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tunis",
    addressCountry: "TN",
  },
  sameAs: [personal.github, personal.linkedin, personal.facebook, personal.instagram, personal.whatsapp],
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Laravel",
    "Node.js",
    "Mobile Application Development",
    "Full Stack Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${hand.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
