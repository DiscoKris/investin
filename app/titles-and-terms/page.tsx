import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const investorEntitlements = [
  "Repayment of their subscriptions from 100% of the net surplus of the Production prior to recoupment, as determined following final settlement of the Production accounts.",
  "Their percentage share of net profits, if any, in accordance with their respective participation terms following recoupment.",
  "Two pairs of tickets to the official opening performance in Leeds, together with one pair of tickets at each venue on the tour, subject to availability.",
];

export default function TitlesAndTermsPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
        <div className="grid w-full gap-6 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-8 lg:rounded-[2.4rem] lg:px-10 lg:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex flex-col gap-5">
                <Image
                  src="/assets/tswllogo.png"
                  alt="To Sir, With Love logo"
                  width={991}
                  height={590}
                  className="h-auto w-[7.25rem] sm:w-[8rem]"
                />

                <h1 className="text-center text-[2.25rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.85rem] lg:text-[4rem]">
                  Titles & <span className="text-[var(--color-gold)]">Terms</span>
                </h1>

                <p className="mx-auto max-w-3xl text-center text-[0.92rem] leading-[1.65] text-[rgba(232,222,203,0.88)] sm:text-[0.98rem]">
                  Foundational investors in the UK Tour production of{" "}
                  <span className="text-[var(--color-gold)]">
                    To Sir, With Love
                  </span>{" "}
                  can participate proportionally in future commercial transfer entities and/or designated subsidiary rights participation pools, including but not limited to West End and Broadway productions, subject to offering terms, production structure, and applicable securities regulations.
                </p>
              </div>

              <div className="mt-7 space-y-5 text-[0.98rem] leading-[1.55] text-[var(--color-cream)] sm:text-[1.04rem] lg:mt-8">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold uppercase text-[1.1em] text-[var(--color-gold)]">
                      Minimum Investment:
                    </span>{" "}
                    <span className="text-[var(--color-ivory)]">
                      £24,000 or $32,500
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-ivory)]">
                      Credit:
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-gold)]">
                      Co-Producer:
                    </span>{" "}
                     for investment of £192,000+ (60% Terms)(2nd line billing, order by investment size and date),
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-gold)]">
                      Associate Producer:
                    </span>{" "}
                    for investments of £96,000+ (60% Terms) (3rd line and below order of investment size, and date) 
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-gold)]">
                      INVESTOR:
                    </span>{" "}
                    for investments of £24,000+ (60%
                    Terms) (Investor billing) 
                  </p>
                </div>

                <p>
                  Full investment is due upon acceptance and signature of the
                  Participation Agreement.
                </p>

                <div className="space-y-2.5">
                  <p className="font-semibold text-[var(--color-ivory)]">
                    Investors are entitled pro-rata to:
                  </p>
                  <ul className="list-none space-y-2 pl-0">
                    {investorEntitlements.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="pt-[0.18rem] text-[var(--color-ivory)]">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  Due to the limited tour length of{" "}
                  <span className="font-semibold text-[var(--color-gold)]">
                    To Sir, With Love
                  </span>{" "}
                  final recoupment calculations and any investor distributions
                  may be determined following completion of the
                  Production&apos;s final accounts, including full receipt of
                  the applicable Theatre Tax Relief claim.
                </p>
              </div>

              <ContinueButton href="/opportunity" className="lg:mt-8" />
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative flex min-h-[22rem] items-stretch justify-center lg:min-h-0 lg:justify-end"
          >
            <div className="card-panel relative w-full overflow-hidden rounded-[2rem] p-4 lg:rounded-[2.4rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
              <div className="relative z-10 flex h-full items-end justify-end overflow-hidden rounded-[1.5rem]">
                <div
                  className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-[rgba(8,13,10,0.22)]"
                  style={{
                    clipPath:
                      "polygon(16% 0, 100% 0, 100% 100%, 0 100%, 10% 82%)",
                  }}
                >
                  <Image
                    src="/assets/tswl-stage-hero.jpg"
                    alt="To Sir, With Love production image"
                    width={1600}
                    height={2200}
                    priority
                    className="h-full w-full object-cover object-[50%_center]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,12,0.2),transparent_34%,rgba(7,18,12,0.16))]" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
