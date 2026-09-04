import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import {
  capitalRequirement,
  formatGbp,
  totalGrossBoxOfficePotential,
  totalPerformanceWeeks,
  weeklyRunningCosts,
} from "@/lib/commercial-model";

const steps = [
  {
    step: "01",
    title: "Commercial Launch Capital",
    body: `The production is raising ${formatGbp(capitalRequirement)} to finance the 2027 World Premiere, including physical production, rehearsals, launch marketing and operating reserve.`,
  },
  {
    step: "02",
    title: "World Premiere Run",
    body: `The commercial launch comprises ${totalPerformanceWeeks} weeks: three weeks in Leeds, one week in Hull and one week in London.`,
  },
  {
    step: "03",
    title: "Revenue and Recoupment",
    body: `The schedule has total gross box office potential of ${formatGbp(totalGrossBoxOfficePotential)} and weekly running costs of ${formatGbp(weeklyRunningCosts)}. Net operating surplus and Theatre Tax Relief support investor recoupment.`,
  },
  {
    step: "04",
    title: "Historic Development Investors",
    body: "Historical investors who financed the development concerts and development of To Sir, With Love collectively hold 175 Development Participation Units. These Units do not participate in repayment of the £750,000 new Investor Capital and receive no distributions until the new Investors have received 100% repayment. They then participate in the 60% Investor Pool alongside the 750 new Investor Participation Units, across 925 total Participation Units.",
  },
];

export default function HowTheInvestmentWorksPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="relative z-10">
              <Reveal>
                <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
                  <Image
                    src="/assets/tswllogo.png"
                    alt="To Sir, With Love logo"
                    width={991}
                    height={590}
                    className="h-auto w-[7.5rem] sm:w-[8.5rem] lg:w-[9rem]"
                  />
                  <div className="max-w-[40rem]">
                    <h1 className="text-[2.15rem] font-bold uppercase leading-[0.98] tracking-[-0.04em] sm:text-[2.9rem] lg:text-[4rem]">
                      <span className="text-[var(--color-ivory)]">How The </span>
                      <span className="text-[var(--color-gold)]">Investment </span>
                      <span className="text-[var(--color-ivory)]">Works</span>
                    </h1>
                    <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.7] text-[var(--color-cream)] sm:text-[1.04rem]">
                      A simplified overview of the proposed recoupment structure
                      for the 2027 World Premiere production.
                    </p>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8 space-y-3.5 lg:mt-7">
                {steps.map((item, index) => (
                  <Reveal key={item.step} delay={index * 0.05}>
                    <article className="group rounded-[1.45rem] border border-[rgba(232,222,203,0.1)] bg-[linear-gradient(180deg,rgba(245,239,225,0.045),rgba(245,239,225,0.015)),rgba(15,22,17,0.24)] px-5 py-4 shadow-[0_12px_28px_rgba(2,8,4,0.08)] transition duration-300 hover:border-[rgba(200,168,110,0.22)] hover:shadow-[0_16px_32px_rgba(2,8,4,0.14)] sm:px-6">
                      <div className="flex items-start gap-4">
                        <div className="min-w-[3.2rem] text-[1.22rem] font-bold leading-none tracking-[0.06em] text-[var(--color-gold)] sm:min-w-[3.6rem] sm:text-[1.3rem]">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-[1.05rem] font-semibold uppercase tracking-[0.04em] text-[var(--color-ivory)] sm:text-[1.12rem]">
                            {item.title}
                          </h2>
                          <div className="mt-3 h-px w-full bg-[linear-gradient(90deg,rgba(200,168,110,0.6),rgba(200,168,110,0.12),transparent)]" />
                          <p className="mt-3 text-[1rem] leading-[1.7] text-[var(--color-cream)] sm:text-[1.02rem]">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal className="mt-8 text-center lg:mt-7 lg:text-left">
                <p className="mx-auto max-w-[42rem] text-[1.08rem] font-semibold leading-[1.5] tracking-[-0.01em] text-[var(--color-gold)] lg:mx-0 lg:text-[1.15rem]">
                  &ldquo;Successful theatrical investments are built on strong
                  material, recognised titles, experienced producers, and
                  long-term audience demand.&rdquo;
                </p>
              </Reveal>

              <Reveal>
                <ContinueButton href="/titles-and-terms" className="lg:mt-7" />
              </Reveal>
            </div>

            <Reveal
              delay={0.08}
              className="relative hidden items-end justify-end lg:flex"
            >
              <div className="relative h-full min-h-[42rem] w-full max-w-[30rem] overflow-hidden border border-[rgba(232,222,203,0.08)] bg-[rgba(8,13,10,0.18)] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                <div
                  className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(8,13,10,0.06),rgba(8,13,10,0.14))]"
                  style={{
                    clipPath: "polygon(6% 0,100% 0,88% 100%,18% 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: "polygon(8% 0,100% 0,90% 100%,20% 100%)",
                  }}
                >
                  <Image
                    src="/assets/wayne2.jpg"
                    alt="Stage performance still from To Sir, With Love"
                    fill
                    className="object-cover object-center grayscale"
                    sizes="30rem"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,245,223,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,rgba(7,28,17,0.1))]" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
