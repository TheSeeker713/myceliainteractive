import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
  title: "Mycelia Interactive | Interactive Cinema & Branching Narratives",
  description:
    "Step into alternate realities. Experience interactive cinema where your choices shape the story. Full motion video meets branching narratives.",
  keywords: [
    "interactive cinema",
    "branching narratives",
    "FMV games",
    "choose your own adventure",
    "alternate reality",
    "interactive storytelling",
    "transmedia",
  ],
  authors: [{ name: "Mycelia Interactive" }],
  creator: "Mycelia Interactive",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myceliainteractive.com",
    title: "Mycelia Interactive | Interactive Cinema",
    description:
      "Experience interactive cinema where your choices shape the story.",
    siteName: "Mycelia Interactive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mycelia Interactive | Interactive Cinema",
    description:
      "Experience interactive cinema where your choices shape the story.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#140a36",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-hero-bg-default text-white`}
      >
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#08041a]/90 border-b border-hero-cyan-500/20 py-8 lg:py-10 px-6 shadow-[0_4px_30px_rgba(0,199,255,0.15)] transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-shrink-0">
              <Image
                src="/assets/images/Mycelia Interactive Banner.png"
                alt="Mycelia Interactive"
                width={360}
                height={100}
                className="h-16 lg:h-20 w-auto object-contain rounded drop-shadow-[0_0_10px_rgba(139,44,245,0.3)] transition-transform hover:scale-105"
              />
            </div>
            <div className="hidden sm:flex gap-6 items-center">
              <a
                href="/liminal-sin"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-hero-magenta-600 to-hero-cyan-600 font-semibold text-white hover:from-hero-magenta-500 hover:to-hero-cyan-500 hover:shadow-[0_0_20px_rgba(139,44,245,0.5)] transition-all duration-300"
              >
                Play Liminal Sin Demo
              </a>
              <a
                href="/ls/lsr.html"
                className="px-6 py-2.5 rounded-lg bg-hero-bg-light/50 border border-hero-cyan-400/30 text-cyan-50 font-medium hover:bg-hero-cyan-900/40 hover:border-hero-cyan-300 hover:text-white transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="sticky bottom-0 z-50 w-full backdrop-blur-md bg-[#140a36]/80 border-t border-hero-cyan-300/30 py-6 px-6 lg:py-8 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-start text-cyan-50/70 text-sm">
            &copy; {new Date().getFullYear()} Mycelia Interactive. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
