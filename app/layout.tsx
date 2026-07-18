import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Geist, Geist_Mono } from "next/font/google";
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

const myceliaAgent = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mycelia-agent",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myceliainteractive.com"),
  title: "Mycelia Interactive LLC | Interactive Entertainment",
  description:
    "Mycelia Interactive LLC develops original interactive entertainment where audiences participate in real time. Characters hear you, stories respond through AI-driven voice and vision systems.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${myceliaAgent.variable} antialiased flex flex-col min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-site-skip-link)] focus:rounded-lg focus:bg-studio-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-grow">
          <SiteMotionShell>{children}</SiteMotionShell>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
