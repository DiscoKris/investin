import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

export default function ExampleInvestmentPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
        <div className="grid w-full gap-6 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1.04fr_0.96fr] lg:items-stretch">
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

                <h1 className="text-left text-[2.2rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.85rem] lg:text-[4rem]">
                  Example <span className="text-[var(--color-gold)]">Investment</span>
                </h1>
              </div>

              <div className="mt-7 max-w-[41rem] space-y-6 text-[0.99rem] leading-[1.64] text-[var(--color-cream)] sm:text-[1.05rem] lg:mt-8">
                <p className="text-[1.12rem] font-semibold text-[var(--color-gold)] sm:text-[1.2rem]">
                  Pamela Dare invests <span className="font-bold">£100,000.</span>
                </p>

                <div className="space-y-3.5">
                  <p>
                    The show nets{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      £230,000 a week
                    </span>{" "}
                    with running costs of £130,000.
                  </p>
                  <p>
                    In 16 weeks the additional £100,000 per week equals £1.6
                    million.
                  </p>
                  <p>
                    The show capitalization cost is £1m, leaving a profit of{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      £600,000.
                    </span>
                  </p>
                </div>

                <div className="space-y-3.5">
                  <p>
                    Pamela Dare receives her{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      £100,000
                    </span>{" "}
                    back plus profits.
                  </p>
                  <p>
                    The profit to investors is{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      60%
                    </span>{" "}
                    of the £600,000 or £360,000.
                  </p>
                  <p>
                    Her investment represents{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      10%
                    </span>{" "}
                    of the{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      £1m
                    </span>{" "}
                    capitalisation, so she receives 10% of the investors&apos;
                    profit share, or{" "}
                    <span className="font-semibold text-[var(--color-ivory)]">
                      £36,000
                    </span>
                    .
                  </p>
                </div>

                <div className="rounded-[1.45rem] border border-[rgba(214,180,103,0.18)] bg-[rgba(8,13,10,0.16)] px-5 py-4">
                  <p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                    
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-[1.58] text-[var(--color-cream)]">
                
                  </p>
                </div>
              </div>

              <ContinueButton href="/disclaimer" className="lg:mt-8" />
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative flex min-h-[22rem] items-stretch justify-center lg:min-h-0 lg:justify-end"
          >
            <div className="card-panel relative w-full overflow-hidden rounded-[2rem] p-4 lg:rounded-[2.4rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />

              <div className="relative z-10 flex h-full items-end justify-end overflow-hidden rounded-[1.5rem]">
                <div
                  className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-[rgba(8,13,10,0.14)]"
                  style={{
                    clipPath:
                      "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 14% 84%)",
                  }}
                >
                  <Image
                    src="/assets/jess.jpg"
                    alt="Young performer from To Sir, With Love in school uniform on stage"
                    width={1600}
                    height={2200}
                    priority
                    className="h-full w-full object-cover object-[58%_center] brightness-[1.03] contrast-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,12,0.14),transparent_30%,rgba(7,18,12,0.12))]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,244,219,0.12),transparent_24%),radial-gradient(circle_at_78%_82%,rgba(0,0,0,0.18),transparent_30%)]" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
