import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

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
                <div className="mt-7 max-w-[42rem] space-y-5 text-center lg:mt-8 lg:text-left">
                  <p className="text-[1rem] font-semibold leading-[1.72] text-[var(--color-ivory)] sm:text-[1.08rem]">
                    <span className="block">
                      UK Tour 2027 production capitalisation is{" "}
                      <span className="text-[var(--color-gold)]">£1m</span>
                    </span>
                    <span className="mt-4 block">
                      Weekly Operating Costs{" "}
                      <span className="text-[var(--color-gold)]">£130,000</span>
                    </span>
                    <span className="block text-[0.94rem] font-semibold leading-[1.7] text-[var(--color-cream)] sm:text-[0.98rem]">
                      (Weekly Operating Costs Include Salaries, Production
                      Staff, Marketing, Theatre Costs &amp; Admin)
                    </span>
                  </p>

                  <p className="text-[1rem] font-semibold leading-[1.72] text-[var(--color-ivory)] sm:text-[1.08rem]">
                    Following 100% recoupment, net profits are split 60/40
                    between investors and producers.
                  </p>

                  <p className="text-[1rem] font-semibold leading-[1.72] text-[var(--color-ivory)] sm:text-[1.08rem]">
                    All net operating profits are distributed to investors pro
                    rata until recoupment.
                  </p>

                  <div className="pt-1">
                    <p className="text-[1rem] font-bold uppercase leading-[1.4] tracking-[0.04em] text-[var(--color-gold)] sm:text-[1.08rem]">
                      Break Even
                    </p>
                    <p className="mt-2 text-[1rem] font-semibold leading-[1.72] text-[var(--color-ivory)] sm:text-[1.08rem]">
                      The production is forecast to break even at approximately{" "}
                      <span className="text-[var(--color-gold)]">
                        65% capacity over 16 weeks
                      </span>
                      .
                      <br />
                      Theatre Tax Relief (TTR) is treated separately and
                      provides additional downside protection rather than being
                      relied upon.
                    </p>
                  </div>

                  <p className="pt-1 text-[1rem] font-semibold leading-[1.72] text-[var(--color-gold)] sm:text-[1.08rem]">
                    Additional revenue opportunities include merchandise,
                    future licensing, cast recordings, and international
                    productions.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <ContinueButton href="/titles-and-terms" className="lg:mt-9" />
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
        </div>
      </section>
    </div>
  );
}
