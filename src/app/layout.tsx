import type { Metadata, Viewport } from "next";
import "./globals.css";
import AutoLogoutHandler from "@/components/AutoLogoutHandler";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cuai.edu';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CUAI Campus Intelligence & Student Portal",
    template: "%s | CUAI Campus Intelligence",
  },
  description: "Official Campus Intelligence, Student Dossier Management, and Form Verification Portal.",
  keywords: [
    "CUAI",
    "Campus Portal",
    "Student Dossier",
    "Academic Management",
    "University Registration",
    "Student Records",
  ],
  authors: [{ name: "Campus IT & AI Systems" }],
  creator: "CUAI Campus Systems",
  publisher: "CUAI University",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "CUAI Campus Intelligence & Student Portal",
    description: "Official Campus Intelligence, Student Dossier Management, and Form Verification Portal.",
    type: "website",
    siteName: "CUAI Portal",
    locale: "en_US",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CUAI Campus Intelligence & Student Portal",
    description: "Official Campus Intelligence, Student Dossier Management, and Form Verification Portal.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org EducationalOrganization structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "CUAI Campus Intelligence",
    url: baseUrl,
    description: "Official Campus Intelligence, Student Dossier Management, and Academic Verification Portal.",
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
  };

  return (
    <html lang="en" className="w-full h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="w-full max-w-full min-h-[100dvh] overflow-x-hidden bg-[#f5f5f7] text-[#0a0a0a] antialiased p-0 m-0 font-sans">
        <AutoLogoutHandler />
        {children}
      </body>
    </html>
  );
}
