import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { getSiteUrl, site } from "@/data/site";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.summary,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.github.url }],
  creator: site.name,
  keywords: [
    "Dipesh Raj S",
    "backend engineer",
    "application security",
    "FastAPI",
    "Python",
    "Kubernetes",
    "software engineering intern",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.shortName,
    title,
    description: site.summary,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description: site.summary },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f1420" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: siteUrl,
  jobTitle: site.role,
  description: site.summary,
  email: `mailto:${site.email}`,
  alumniOf: { "@type": "CollegeOrUniversity", name: "VIT Chennai" },
  knowsAbout: [
    "Backend development",
    "Application security",
    "AI/LLM security",
    "Python",
    "FastAPI",
    "Kubernetes",
  ],
  sameAs: [site.github.url, ...Object.values(site.links).filter((v): v is string => !!v)],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} min-h-dvh antialiased`}
      >
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
        />
      </body>
    </html>
  );
}
