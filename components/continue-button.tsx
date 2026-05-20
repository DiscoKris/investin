import Link from "next/link";

type ContinueButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export function ContinueButton({
  href,
  label = "CONTINUE",
  className = "",
}: ContinueButtonProps) {
  return (
    <div className={`mt-10 flex justify-center ${className}`.trim()}>
      <Link
        href={href}
        className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-[rgba(210,178,116,0.46)] bg-[linear-gradient(180deg,rgba(248,241,229,0.96),rgba(229,216,191,0.92))] px-10 py-4 text-center text-[0.88rem] font-semibold uppercase tracking-[0.24em] text-[#263224] shadow-[0_14px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,250,240,0.14)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,178,116,0.76)] hover:bg-[linear-gradient(180deg,rgba(250,244,234,0.98),rgba(235,223,199,0.94))] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24),0_0_0_1px_rgba(255,250,240,0.2)_inset] sm:min-w-[15rem] sm:px-11 sm:py-5 sm:text-[0.92rem]"
      >
        {label}
      </Link>
    </div>
  );
}
