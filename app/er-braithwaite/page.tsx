import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

export default function ErBraithwaitePage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="card-panel relative w-full overflow-hidden rounded-[2.4rem] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_84%_26%,rgba(255,255,255,0.03),transparent_18%),linear-gradient(180deg,rgba(255,250,239,0.02),rgba(8,13,10,0.08))]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(0,0,0,0.16),transparent_30%)]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.5rem] sm:w-[8.5rem] lg:absolute lg:left-0 lg:top-0 lg:w-[9rem]"
              />
              <div>
                <p className="text-[1.25rem] font-semibold uppercase tracking-[0.04em] text-[var(--color-gold)] sm:text-[1.45rem] lg:text-[1.8rem]">
                  The Real
                </p>
                <h1 className="mt-1 text-[2.2rem] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.9rem] lg:text-[4.1rem]">
                  E.R. Braithwaite
                </h1>
              </div>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <Reveal>
              <div className="mx-auto max-w-[48rem] text-left">
                <div className="max-w-[46rem] space-y-7 text-[1rem] leading-[1.72] text-[var(--color-ivory)] sm:text-[1.06rem] lg:text-[1.08rem]">
                  <p className="text-shadow-[0_1px_10px_rgba(0,0,0,0.18)]">
                    A descendant of enslaved people, E. R. Braithwaite
                    (1912–2016) was born and raised in colonial British Guiana.
                    During the Second World War he joined the Royal Air Force,
                    flying Spitfires in the fight against fascism. After the
                    war he completed his degree at Cambridge University and set
                    out to work as an engineer. But despite his education and
                    wartime service, he was unable to secure a single position
                    in his field.
                  </p>

                  <p className="text-shadow-[0_1px_10px_rgba(0,0,0,0.18)]">
                    Instead, Braithwaite accepted a teaching post in
                    London&apos;s East End, facing a classroom of traumatised,
                    working-class students who had grown up in the shadow of
                    war. As a Black man placed before poor white teenagers, many
                    of whom believed they could finally feel superior to someone
                    else, he entered a deeply volatile environment.
                  </p>

                  <p className="text-shadow-[0_1px_10px_rgba(0,0,0,0.18)]">
                    From that experience came{" "}
                    <span className="font-semibold text-[var(--color-gold)]">
                      To Sir, With Love
                    </span>
                    , the small book Braithwaite would later call &ldquo;that
                    little story,&rdquo; written simply to capture the
                    challenges and unexpected humanity he discovered in a London
                    classroom.
                  </p>

                  <p className="text-shadow-[0_1px_10px_rgba(0,0,0,0.18)]">
                    Following Guyana&apos;s independence, he went on to serve
                    as his country&apos;s Permanent Representative to the United
                    Nations and later as Ambassador to Venezuela.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal
              delay={0.08}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative h-[26rem] w-full max-w-[22rem] sm:h-[30rem] sm:max-w-[24rem] lg:h-[36rem] lg:max-w-[26rem]">
                <div className="pointer-events-none absolute inset-x-10 bottom-4 h-10 rounded-full bg-[rgba(0,0,0,0.2)] blur-xl" />
                <Image
                  src="/assets/braith2.png"
                  alt="Full-body portrait of E. R. Braithwaite"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(min-width: 1024px) 26rem, 22rem"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,transparent_18%,rgba(7,28,17,0.12))]" />
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10">
            <ContinueButton href="/music-lyrics-book" className="lg:mt-6" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
