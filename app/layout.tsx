import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteMotionShell } from "./components/motion/SiteMotionShell";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myceliainteractive.com"),
  title: "Mycelia Interactive LLC | Interactive Entertainment",
  description:
    "Mycelia Interactive LLC develops original interactive entertainment where audiences participate in real time — characters hear you, stories respond through AI-driven voice and vision systems.",
  authors: [{ name: "Mycelia Interactive LLC" }],
  creator: "Mycelia Interactive LLC",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/images/Mycelia_Interactive_Logo.jpg",
    apple: "/assets/images/Mycelia_Interactive_Logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.myceliainteractive.com",
    title: "Mycelia Interactive LLC | Interactive Entertainment",
    description:
      "Original interactive entertainment across film, games, music, and immersive experiences.",
    siteName: "Mycelia Interactive LLC",
    images: [
      {
        url: "/assets/images/Liminal_Sin_Title.jpg",
        width: 1200,
        height: 630,
        alt: "Mycelia Interactive LLC",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAFAF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Kick off the fetch for the first scroll-scrubber spritesheet
            during initial HTML parsing, before VideoBackground's mount
            effect runs, so the canvas can become scroll-reactive sooner. */}
        <link
          rel="preload"
          as="image"
          href="/assets/frames/spritesheet1.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SiteHeader />
        <main className="flex-grow">
          <SiteMotionShell>{children}</SiteMotionShell>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
