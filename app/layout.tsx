import type { Metadata } from "next";
import { Inter, League_Spartan } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

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
    "Investor presentation website for To Sir, With Love The Musical and the planned 2027 UK Tour.",
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
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
