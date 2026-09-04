import { CommercialEvidenceInteractive } from "@/components/commercial-evidence-interactive";

export function MarketValidation() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-[rgba(200,168,110,0.32)] bg-[linear-gradient(145deg,rgba(35,58,42,0.9),rgba(9,17,12,0.92))] px-6 py-9 sm:mt-10 sm:px-10 sm:py-11">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">Commercial evidence</p>
          <h2 className="mt-3 text-[clamp(2rem,7vw,4rem)] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)]">The Market Has Already Responded</h2>
          <p className="mt-6 text-[clamp(1.7rem,5vw,2.8rem)] font-bold uppercase leading-none text-[var(--color-gold)]">Two Sold-Out London Performances</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-cream)]">Before the 2027 world premiere, To Sir, With Love was presented in concert in London&apos;s West End. Both performances sold out.</p>
          <div className="mt-7 border-l-2 border-[var(--color-gold)] pl-5">
            <p className="text-[3.2rem] font-bold leading-none tracking-[-0.045em] text-[var(--color-ivory)] sm:text-[4.2rem]">£92,339</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">Box office</p>
          </div>
        </div>
        <CommercialEvidenceInteractive />
      </div>
    </section>
  );
}
