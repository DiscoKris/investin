import Link from "next/link";

const footerNavItems = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/tour", label: "Tour" },
  { href: "/music-lyrics-book", label: "Soundtrack" },
  { href: "/thank-you", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="section-shell pb-7 pt-4 sm:pb-8 sm:pt-5">
      <div className="gold-rule h-px w-full" />
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
        <p className="nav-type text-[var(--color-mist)]">
          To Sir, With Love Investor Presentation
        </p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
          {footerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-type text-[var(--color-mist)] hover:text-[var(--color-gold)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
