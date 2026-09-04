import { InvestorFirst } from "@/components/investor-first";

const thesisStats = [
  { value: "£750,000", label: "Total capital raise" },
  { value: "£2.27M", label: "Gross potential revenue" },
  { value: "Global IP", label: "Creation of a valuable theatrical property" },
];

export function InvestmentThesis() {
  return (
    <div className="mb-8 space-y-6 sm:mb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.12)] bg-[linear-gradient(145deg,rgba(31,49,39,0.92),rgba(8,15,11,0.82))] px-5 py-8 shadow-[0_22px_55px_rgba(0,0,0,0.22)] sm:px-8 sm:py-10">
        <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
          The investment thesis
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {thesisStats.map((stat) => (
            <article key={stat.value} className="rounded-[1.35rem] border border-[rgba(200,168,110,0.2)] bg-[rgba(255,255,255,0.035)] px-5 py-6 text-center">
              <p className="text-[clamp(2rem,7vw,3.25rem)] font-bold uppercase leading-none tracking-[-0.045em] text-[var(--color-ivory)]">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.16em] text-[var(--color-gold)]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-7 max-w-4xl text-center text-[1rem] font-medium leading-[1.7] text-[var(--color-cream)] sm:text-[1.08rem]">
          A contained five-week commercial launch designed to establish the
          world-premiere production and create the platform for potential future
          West End, Broadway and international productions.
        </p>
      </section>
      <InvestorFirst />
    </div>
  );
}
