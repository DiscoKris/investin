import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import { InvestorFirst } from "@/components/investor-first";
import {
  capitalRequirement,
  existingDevelopmentUnits,
  formatGbp,
  productionBreakEvenPercentage,
  totalPerformanceWeeks,
  totalOperatingCosts,
  weeklyRunningCosts,
} from "@/lib/commercial-model";

export default function InvestmentPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-stretch lg:gap-9">
            <div className="relative z-10">
              <Reveal>
                <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
                  <Image
                    src="/assets/tswllogo.png"
                    alt="To Sir, With Love logo"
                    width={991}
                    height={590}
                    className="h-auto w-[7.2rem] sm:w-[8rem] lg:w-[8.8rem]"
                  />
                  <div className="max-w-[40rem]">
                    <h1 className="text-[2rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] sm:text-[2.65rem] lg:text-[4rem]">
                      <span className="text-[var(--color-gold)]">How </span>
                      <span className="text-[var(--color-ivory)]">The</span>
                      <br />
                      <span className="text-[var(--color-ivory)]">
                        Investment{" "}
                      </span>
                      <span className="text-[var(--color-gold)]">Works</span>
                    </h1>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-7 max-w-[42rem] space-y-6 text-center lg:mt-8 lg:text-left">
                  <dl className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-[rgba(200,168,110,0.28)] bg-[rgba(8,13,10,0.16)] px-4 py-5">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">Capital Raise</dt>
                      <dd className="mt-2 text-[1.65rem] font-bold leading-none text-[var(--color-ivory)]">{formatGbp(capitalRequirement)}</dd>
                    </div>
                    <div className="rounded-[1.2rem] border border-[rgba(200,168,110,0.28)] bg-[rgba(8,13,10,0.16)] px-4 py-5">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">Gross Potential Revenue</dt>
                      <dd className="mt-2 text-[1.65rem] font-bold leading-none text-[var(--color-ivory)]">£2.25m</dd>
                    </div>
                    <div className="rounded-[1.2rem] border border-[rgba(200,168,110,0.28)] bg-[rgba(8,13,10,0.16)] px-4 py-5">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">Commercial Launch</dt>
                      <dd className="mt-2 text-[1.65rem] font-bold leading-none text-[var(--color-ivory)]">Five Weeks</dd>
                    </div>
                  </dl>

                  <p className="text-[1rem] font-semibold leading-[1.65] text-[var(--color-ivory)] sm:text-[1.08rem]">
                    Weekly running costs are {formatGbp(weeklyRunningCosts)}, or{" "}
                    {formatGbp(totalOperatingCosts)} across the World Premiere.
                  </p>

                  <p className="text-[0.96rem] leading-[1.65] text-[var(--color-cream)] sm:text-[1rem]">
                    The {existingDevelopmentUnits} Historic Development
                    Participation Units are excluded from the recoupment tier
                    and receive no distributions until new Investor Capital has
                    been returned in full.
                  </p>

                  <p className="text-[1rem] font-semibold leading-[1.65] text-[var(--color-ivory)] sm:text-[1.08rem]">
                    After Recoupment, Net Profits are split 60/40 between the
                    Investors&apos; Profit Pool and Producer Participation Pool.
                  </p>

                  <div className="pt-1">
                    <p className="text-[1rem] font-bold uppercase leading-[1.4] tracking-[0.04em] text-[var(--color-gold)] sm:text-[1.08rem]">
                      Break Even
                    </p>
                    <p className="mt-2 text-[1rem] font-semibold leading-[1.72] text-[var(--color-ivory)] sm:text-[1.08rem]">
                      The modeled recoupment point is approximately{" "}
                      <span className="text-[var(--color-gold)]">
                        {productionBreakEvenPercentage} capacity across the{" "}
                        {totalPerformanceWeeks}-week World Premiere
                      </span>
                      , including the benefit of estimated UK Theatre Tax
                      Relief.{" "}
                      Theatre Tax Relief is subject to qualifying expenditure
                      and a successful claim.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <ContinueButton
                  href="/investment2"
                  label="TELL ME MORE"
                  className="lg:mt-9"
                />
              </Reveal>
            </div>

            <Reveal
              delay={0.08}
              className="relative hidden items-end justify-end lg:flex"
            >
              <div className="relative h-full min-h-[42rem] w-full max-w-[30rem] overflow-hidden border border-[rgba(232,222,203,0.08)] bg-[rgba(8,13,10,0.18)] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: "polygon(10% 0,100% 0,88% 100%,20% 100%)",
                  }}
                >
                  <Image
                    src="/assets/wayne2.jpg"
                    alt="Stage performance still from To Sir, With Love"
                    fill
                    className="object-cover object-center grayscale"
                    sizes="30rem"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,245,223,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,rgba(7,28,17,0.12))]" />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 border border-[rgba(232,222,203,0.1)]"
                  style={{
                    clipPath: "polygon(10% 0,100% 0,88% 100%,20% 100%)",
                  }}
                />
              </div>
            </Reveal>
          </div>
          <div className="relative z-10 mt-8">
            <InvestorFirst compact />
          </div>
        </div>
      </section>
    </div>
  );
}
