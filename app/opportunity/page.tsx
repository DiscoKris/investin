import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

export default function OpportunityPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
        <div className="grid w-full gap-8 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1.16fr_0.84fr] lg:items-stretch lg:gap-10">
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
                  The <span className="text-[var(--color-gold)]">Opportunity</span>
                </h1>
              </div>

              <div className="mt-7 max-w-[45rem] space-y-7 text-[0.98rem] leading-[1.64] text-[var(--color-cream)] sm:text-[1.04rem] lg:mt-8">
                <div className="space-y-3">
                  <p className="font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)]">
                    Commercial Launch
                  </p>
                  <p>
                    A five-week World Premiere in Leeds, Hull and London launches
                    the theatrical property and creates the commercial
                    foundation for potential future productions.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)]">
                    1. Production Expenses &amp; Reserves
                  </p>
                  <p>
                    Production revenues are first applied to Production
                    Expenses, Operating Expenses and approved reserves.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)]">
                    2. Recoupment of New Investor Capital
                  </p>
                  <p>
                    Remaining Net Profits are distributed pro rata among
                    holders of the new Investor Participation Units until the
                    accepted new Investor Capital has been returned. The 175
                    Historic Development Participation Units held by the
                    historical investors who financed the development concerts
                    and development of the production do not participate in
                    this recoupment tier and receive no distributions until the
                    new Investors have received 100% repayment.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)]">
                    3. Post-Recoupment Profits
                  </p>
                  <p>
                    Thereafter, distributable Net Profits shall be allocated:
                  </p>
                  <div className="space-y-2 pl-1">
                    <p className="flex gap-3">
                      <span className="pt-[0.18rem] text-[var(--color-gold)]">
                        •
                      </span>
                      <span>
                        60% to the Investors&apos; Profit Pool, distributed pro rata
                        across all Investor Participation Units then outstanding.
                      </span>
                    </p>
                    <p className="flex gap-3">
                      <span className="pt-[0.18rem] text-[var(--color-gold)]">
                        •
                      </span>
                      <span>40% to the Producer Participation Pool.</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)]">
                    Key Points
                  </p>
                  <p>
                    Investor funds are held and applied through the Lead
                    Producers&apos; producing entity,{" "}
                    <span className="font-semibold text-[var(--color-gold)]">
                      Greenslade Productions Ltd.
                    </span>{" "}
                    The Subscription Agreement and applicable investment
                    documents govern recoupment, reporting and investor
                    communications.
                  </p>
                </div>
              </div>

              <ContinueButton
                href="/recoupment-chart"
                label="SCAN THE NUMBERS"
                className="lg:mt-8"
              />
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative flex min-h-[22rem] items-stretch justify-center lg:min-h-0 lg:justify-end lg:pl-6 xl:pl-10"
          >
            <div className="card-panel relative w-full overflow-hidden rounded-[2rem] p-4 lg:rounded-[2.4rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_14%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
              <div className="relative z-10 h-full overflow-hidden rounded-[1.5rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(8,13,10,0.14)]">
                <div
                  className="relative h-full min-h-[22rem] overflow-hidden rounded-[1.5rem]"
                  style={{
                    clipPath:
                      "polygon(14% 0, 100% 0, 100% 100%, 0 100%, 8% 84%)",
                  }}
                >
                  <Image
                    src="/assets/lulu.jpg"
                    alt="To Sir, With Love production image"
                    width={1600}
                    height={2200}
                    priority
                    className="h-full w-full object-cover object-[55%_center]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,12,0.1),transparent_28%,rgba(7,18,12,0.18))]" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
