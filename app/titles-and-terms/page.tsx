import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const investorEntitlements = [
  "Repayment of accepted new Investor Capital from the recoupment tier, pro rata among holders of the new Investor Participation Units, as determined following final settlement of the Production accounts.",
  "Following Recoupment, participation in the Investors' 60% Net Profit Pool, shared pro rata across all Investor Participation Units then outstanding.",
  "Two pairs of tickets to the official opening performance in Leeds, together with one pair of tickets in Hull and London during the World Premiere production, subject to availability.",
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

                <p className="mx-auto max-w-full text-center text-[1.5rem] font-semibold leading-[1.25] text-[var(--color-gold)] sm:text-[1.7rem]">
                  Minimum Investment: £20,000 ($27,000)
                </p>
              </div>

              <div className="mt-9 space-y-5 text-[0.98rem] leading-[1.55] text-[var(--color-cream)] sm:text-[1.04rem] lg:mt-10">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-ivory)]">
                      Credit:
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-gold)]">
                      Co-Producer:
                    </span>{" "}
                    standard guideline for investments of £160,000+ ($216,000+): 2nd-line billing, ordered by investment size and date.
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-gold)]">
                      Associate Producer:
                    </span>{" "}
                    standard guideline for investments of £80,000+ ($108,000+): 3rd-line billing and below, ordered by investment size and date.
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[var(--color-gold)]">
                      INVESTOR:
                    </span>{" "}
                    standard guideline for investments of £20,000+ ($27,000+): Investor billing.
                  </p>
                </div>

                <p>
                  Producer credit levels shown are standard guidelines and
                  remain subject to Producer approval and discretion. Any
                  credit must be separately agreed and is not automatic.
                </p>

                <p>
                  <span className="font-semibold text-[var(--color-gold)]">Post-Recoupment Investor Participation:</span>{" "}
                  Following Recoupment, investors participate in the Investors&apos;
                  60% Net Profit Pool, shared pro rata across all Investor
                  Participation Units then outstanding.
                </p>

                <p>
                  Full investment is due upon acceptance and signature of the
                  Subscription Agreement and applicable investment documents.
                </p>

                <p className="text-[0.92rem] text-[rgba(232,222,203,0.78)]">
                  USD equivalents are illustrative. Actual USD subscriptions
                  will be calculated using the applicable agreed GBP/USD
                  exchange rate.
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

                <div className="space-y-3 border-t border-[rgba(200,168,110,0.25)] pt-5">
                  <h2 className="font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                    FOUNDATIONAL INVESTOR CONTINUATION RIGHTS
                  </h2>
                  <p className="font-semibold text-[var(--color-ivory)]">
                    Foundational Investors have the guaranteed first
                    opportunity to maintain their proportional Participation
                    Interest in qualifying future Transfer Productions,
                    including West End, Broadway and international productions,
                    by investing their corresponding share of the new
                    capitalization.
                  </p>
                  <p>
                    Reinvestment is optional. Investors may take their returned
                    capital or reinvest to maintain their proportional
                    participation.
                  </p>
                  <p>
                    Future productions are not guaranteed, and the original
                    World Premiere investment does not automatically carry into
                    them. Each future production will have its own
                    capitalization and definitive investment documents.
                  </p>
                  <p>
                    Because the World Premiere runs for five weeks, final
                    recoupment and investor returns may be confirmed following
                    completion of the final production accounts and receipt of
                    the applicable Theatre Tax Relief claim.
                  </p>
                </div>
              </div>

              <ContinueButton
                href="/opportunity"
                label="GRAB THE OPPORTUNITY"
                className="lg:mt-8"
              />
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
