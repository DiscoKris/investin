import Link from "next/link";

type CtaButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export function CtaButton({
  href,
  label,
  variant = "primary",
}: CtaButtonProps) {
  const classes =
    variant === "primary"
      ? "border-[rgba(200,168,110,0.45)] text-[var(--color-cream)] hover:border-[rgba(200,168,110,0.75)] hover:text-[var(--color-ivory)]"
      : "border-[rgba(232,222,203,0.2)] text-[var(--color-mist)] hover:border-[rgba(232,222,203,0.45)] hover:text-[var(--color-ivory)]";

  return (
    <Link
      href={href}
      className={`button-type inline-flex items-center justify-center border-b px-0 py-2 ${classes}`}
    >
      {label}
    </Link>
  );
}
