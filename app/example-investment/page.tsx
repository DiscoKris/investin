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

                <h1 className="text-left text-[2.2rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.85rem] lg:text-[3.65rem]">
                  Pamela Dare Invests{" "}
                  <span className="text-[var(--color-gold)]">£100,000</span>
                </h1>
              </div>

              <div className="mt-7 max-w-[42rem] space-y-7 text-[1rem] leading-[1.6] text-[var(--color-cream)] sm:text-[1.06rem] lg:mt-8">
                <p className="text-[1.08rem] leading-[1.65] text-[var(--color-ivory)] sm:text-[1.16rem]">
                  Pamela invests <strong>£100,000</strong> in the World Premiere
                  of <em>To Sir, With Love</em>.
                </p>

                <p>
                  If the production performs at <strong>100% of its modelled
                  venue capacities</strong>, the current financial model projects
                  that Pamela receives:
                </p>

                <div className="rounded-[1.75rem] border border-[rgba(200,168,110,0.42)] bg-[linear-gradient(145deg,rgba(200,168,110,0.12),rgba(8,13,10,0.22))] px-5 py-7 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:px-8 sm:py-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">Pamela Invests</p>
                    <p className="mt-2 text-[2.1rem] font-bold leading-none text-[var(--color-ivory)] sm:text-[2.5rem]">£100,000</p>
                  </div>

                  <p aria-hidden="true" className="my-4 text-2xl text-[var(--color-gold)]">↓</p>

                  <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">Her Original Investment Back</p>
                      <p className="mt-2 text-[2rem] font-bold leading-none text-[var(--color-ivory)] sm:text-[2.3rem]">£100,000</p>
                    </div>
                    <p aria-hidden="true" className="text-2xl font-semibold text-[var(--color-gold)]">+</p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">Plus Potential Profit</p>
                      <p className="mt-2 text-[2rem] font-bold leading-none text-[var(--color-ivory)] sm:text-[2.3rem]">£30,000</p>
                    </div>
                  </div>

                  <p aria-hidden="true" className="my-4 text-2xl font-semibold text-[var(--color-gold)]">=</p>

                  <div className="border-t border-[rgba(200,168,110,0.3)] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">Potential Total Cash Returned</p>
                    <p className="mt-3 text-[clamp(3.2rem,10vw,5.5rem)] font-bold leading-none tracking-[-0.055em] text-[var(--color-ivory)]">£130,000</p>
                  </div>
                </div>

                <p className="text-[1.05rem] font-bold leading-[1.6] text-[var(--color-gold)] sm:text-[1.12rem]">
                  Her £100,000 comes back first, with approximately £30,000
                  additional projected profit at this performance level.
                </p>

                <p className="text-sm leading-6 text-[rgba(232,222,203,0.7)]">
                  Illustrative only. Actual returns depend on box office
                  performance, production costs, Theatre Tax Relief and the
                  definitive investment terms.
                </p>
              </div>

              <ContinueButton
                href="/weekly-investor-statements"
                label="TRANSPARENCY"
                className="lg:mt-8"
              />
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
