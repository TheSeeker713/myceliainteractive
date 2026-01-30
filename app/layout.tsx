import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "Step into alternate realities. Experience interactive cinema where your choices shape the story. Full motion video meets branching narratives.",
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
    description: "Experience interactive cinema where your choices shape the story.",
    siteName: "Mycelia Interactive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mycelia Interactive | Interactive Cinema",
    description: "Experience interactive cinema where your choices shape the story.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#2d1b4e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
