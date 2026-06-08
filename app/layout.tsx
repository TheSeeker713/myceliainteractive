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
  title: "Mycelia Interactive LLC | Interactive Entertainment",
  description:
    "Mycelia Interactive LLC develops original interactive entertainment where audiences participate in real time — characters hear you, stories respond through AI-driven voice and vision systems.",
  authors: [{ name: "Mycelia Interactive LLC" }],
  creator: "Mycelia Interactive LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myceliainteractive.com",
    title: "Mycelia Interactive LLC | Interactive Entertainment",
    description:
      "Original interactive entertainment across film, games, music, and immersive experiences.",
    siteName: "Mycelia Interactive LLC",
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
