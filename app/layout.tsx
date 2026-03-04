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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#140a36]/80 border-b border-hero-cyan-300/30 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-white font-bold">
            <Image
              src="/assets/images/Mycelia Interactive Banner.png"
              alt="Mycelia Interactive"
              width={180}
              height={50}
              className="h-10 w-auto object-contain rounded"
            />
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="sticky bottom-0 z-50 w-full backdrop-blur-md bg-[#140a36]/80 border-t border-hero-cyan-300/30 p-4 mt-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-cyan-50/70 text-sm">
            &copy; {new Date().getFullYear()} Mycelia Interactive. All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
