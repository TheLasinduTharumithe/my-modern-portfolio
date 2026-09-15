import type { Metadata } from "next";

import { SkillOrbitSystem } from "@/components/skill-orbit-system";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/lib/portfolio-data";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://my-modern-portfolio-seven.vercel.app";
const description =
  "Lasindu Tharumitha - BEng (Hons) Software Engineering Graduate. A premium developer portfolio automatically synchronized with GitHub projects, activity, live demos, and recruiter-focused engineering signals.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lasindu Tharumitha - BEng (Hons) Software Engineering Graduate",
    template: "%s | Lasindu Tharumitha",
  },
  description,
  keywords: [
    "Lasindu Tharumitha",
    "BEng (Hons) Software Engineering",
    "Software Engineering Graduate",
    "Full Stack Developer",
    "QA Internship",
    "IT Internship",
    "Next.js Developer",
    "Sri Lanka Software Engineer",
    "Lasindu Tharumitha - BEng (Hons) Software Engineering Graduate",
    "GitHub Portfolio",
    "Developer Portfolio",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "96x96",
      },
    ],
    shortcut: "/favicon.png",
    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Lasindu Tharumitha - BEng (Hons) Software Engineering Graduate",
    description,
    images: [
      {
        url: "/social-share-graduation-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Lasindu Tharumitha software engineering graduation portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lasindu Tharumitha - BEng (Hons) Software Engineering Graduate",
    description,
    images: ["/social-share-graduation-v2.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: profile.email,
  image: `${siteUrl}/social-share-graduation-v2.jpg`,
  telephone: profile.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Matara",
    addressCountry: "Sri Lanka",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: profile.institution,
    },
    {
      "@type": "EducationalOrganization",
      name: "Pearson",
    },
  ],
  knowsAbout: [
    "Software Engineering",
    "Full Stack Development",
    "Next.js",
    "Firebase",
    "ASP.NET MVC",
    "Database Design",
    "Network Infrastructure",
  ],
  url: siteUrl,
  sameAs: [`https://github.com/${profile.githubUsername}`],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lasindu Tharumitha - BEng (Hons) Software Engineering Graduate",
  url: siteUrl,
  description,
  publisher: {
    "@type": "Person",
    name: profile.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SkillOrbitSystem />
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd, websiteJsonLd]),
          }}
        />
      </body>
    </html>
  );
}
