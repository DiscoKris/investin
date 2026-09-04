export function InvestorFirst({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.55rem] border border-[rgba(200,168,110,0.52)] bg-[linear-gradient(135deg,rgba(200,168,110,0.13),rgba(20,39,27,0.68))] text-center shadow-[0_18px_42px_rgba(0,0,0,0.2)] ${compact ? "px-5 py-6" : "mx-auto max-w-4xl px-6 py-7 sm:px-9 sm:py-8"}`}
    >
      <div className="pointer-events-none absolute inset-x-[18%] top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-gold),transparent)]" />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
        Investor-protection principle
      </p>
      <h2 className={`${compact ? "mt-3 text-[1.6rem]" : "mt-3 text-[clamp(1.7rem,6vw,3.35rem)]"} font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)]`}>
        Investors Recoup First
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-[1rem] font-semibold leading-[1.6] text-[var(--color-ivory)] sm:text-[1.1rem]">
        All investor capital is returned in full before any profits are
        distributed to the Producers.
      </p>
    </section>
  );
}
