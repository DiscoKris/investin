"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

const privateRoutes = ["/login", "/statement", "/admin"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivate = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isPrivate) return <main className="min-h-screen">{children}</main>;

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
