import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

export default function LegacyPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.5rem] sm:w-[8.5rem] lg:absolute lg:left-0 lg:top-0 lg:w-[9rem]"
              />
              <h1 className="pt-1 text-[2.25rem] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.9rem] lg:text-[4rem]">
                The Legacy
              </h1>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-8 lg:mt-9 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <Reveal className="flex flex-col">
              <p className="text-[1.15rem] font-semibold uppercase tracking-[0.03em] text-[var(--color-gold)] sm:text-[1.28rem]">
                Hollywood Made A Movie.....
              </p>
              <div className="mt-7 max-w-[44rem] space-y-8 text-[1.08rem] leading-[1.78] text-[var(--color-ivory)] sm:text-[1.16rem] lg:text-[1.34rem] lg:leading-[1.84]">
                <p>
                  Released in 1967 and directed by James Clavell, To Sir, With
                  Love was adapted from E. R. Braithwaite&apos;s 1959 novel.
                </p>
                <p>
                  The film starred Sidney Poitier, who had already made history
                  by winning the 1964 Academy Award for Best Actor for Lilies
                  of the Field, becoming the first Black man to receive that
                  honour. His performance in To Sir, With Love further
                  cemented his reputation as one of cinema&apos;s most respected
                  figures. The soundtrack introduced Lulu, then a teenage pop
                  singer, in her acting debut.
                </p>
              </div>
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex flex-col items-center lg:-mt-1 lg:items-end"
            >
              <div className="relative w-full max-w-[23rem] lg:max-w-[25.5rem]">
                <div className="absolute inset-x-8 -top-5 h-10 rounded-full bg-[rgba(0,0,0,0.22)] blur-lg" />
                <div
                  className="relative overflow-hidden shadow-[0_22px_48px_rgba(0,0,0,0.28)]"
                  style={{
                    clipPath:
                      "polygon(0 0,100% 0,100% 88%,50% 100%,0 88%)",
                  }}
                >
                  <Image
                    src="/assets/sidney.png"
                    alt="To Sir, With Love film poster"
                    width={1200}
                    height={1800}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10 mt-10 flex flex-col items-center lg:mt-8">
            <div
              className="w-full max-w-[48rem] border border-[rgba(214,180,103,0.9)] bg-[rgba(22,24,25,0.72)] px-10 py-8 text-center shadow-[0_22px_48px_rgba(0,0,0,0.24)] sm:px-12 sm:py-9"
              style={{
                clipPath:
                  "polygon(0 8%,50% 0,100% 8%,100% 92%,50% 100%,0 92%)",
              }}
            >
              <p className="text-[1.75rem] font-semibold leading-none text-[var(--color-gold)] sm:text-[2rem]">
                The Movie
              </p>
              <div className="mt-5 space-y-2 text-[1.5rem] font-semibold leading-[1.28] text-[var(--color-ivory)] sm:text-[1.8rem]">
                <p>Grossed $42m on $1m Budget</p>
                <p>#1 Song in US and UK</p>
                <p>Still used in Education Today</p>
              </div>
            </div>

            <ContinueButton href="/why-now" className="mt-8" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
