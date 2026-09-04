import type { Metadata } from "next";
import { Inter, League_Spartan } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

const headline = League_Spartan({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "To Sir, With Love The Musical | Investors",
    template: "%s | To Sir, With Love The Musical",
  },
  description:
    "Investor presentation for the contained five-week 2027 commercial launch of To Sir, With Love The Musical, a new theatrical property.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headline.variable} ${body.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full text-[var(--color-ivory)]">
        <div className="grain pointer-events-none fixed inset-0 z-0 opacity-35" />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
