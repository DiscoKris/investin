import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const qubeCopy =
  "QUBE Theatrical is an executive producer and general management company at the forefront of live entertainment, specialising in concerts, musicals in concert, and theatre productions across the West End, national and international tours, and one-night-only events. Founded by Sam Quested and Darren Bell, QUBE combines over two decades of experience delivering award-winning musicals, world-class concerts and landmark staged events.";

const mpiCopy =
  "Magic Pictures International is a Los Angeles-based production company specialising in theatre and television. Recent theatre credits include producing Grease, Rodgers and Hammerstein's Cinderella, Mary Poppins, Wizard of Oz, Beauty and the Beast and Aladdin. Productions have played across major U.S. regional theatres and international touring markets including Pasadena Playhouse, Tennessee Performing Arts Center and Kirk Douglas Theatre. MPI has produced over 50 musical theatre productions.";

export default function ProducersPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_18%_84%,rgba(152,205,255,0.06),transparent_14%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[6.8rem] sm:w-[7.6rem] lg:absolute lg:left-0 lg:top-[-0.2rem] lg:w-[8rem]"
              />
              <h1 className="max-w-[58rem] pt-1 text-[1.35rem] font-bold uppercase leading-[1.06] tracking-[-0.04em] sm:text-[1.75rem] lg:pl-[7.5rem] lg:text-[2.15rem]">
                <span className="text-[var(--color-ivory)]">Who Are </span>
                <span className="text-[var(--color-gold)]">You </span>
                <span className="text-[var(--color-ivory)]">Trusting </span>
                <span className="text-[var(--color-gold)]">With </span>
                <span className="text-[var(--color-ivory)]">Your Investment?</span>
              </h1>
            </div>
          </Reveal>

          <Reveal className="relative z-10 mt-8 text-center lg:mt-9">
            <h2 className="text-[1.8rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[2.15rem] lg:text-[2.6rem]">
              <span className="text-[var(--color-ivory)]">The </span>
              <span className="text-[var(--color-gold)]">Producers</span>
            </h2>
          </Reveal>

          <div className="relative z-10 mt-10 grid gap-10 lg:mt-11 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <div className="mx-auto flex h-full max-w-[30rem] flex-col text-center lg:mx-0 lg:justify-start lg:text-left">
                <h3 className="text-[1.42rem] font-semibold leading-[1.1] text-[var(--color-ivory)] sm:text-[1.55rem]">
                  Magic Pictures International
                </h3>
                <p className="mt-5 text-[1rem] leading-[1.82] text-[var(--color-cream)] sm:text-[1.05rem]">
                  {mpiCopy}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mx-auto flex h-full max-w-[30rem] flex-col text-center lg:mx-0 lg:justify-start lg:text-left">
                <h3 className="text-[1.42rem] font-semibold leading-[1.1] text-[var(--color-ivory)] sm:text-[1.55rem]">
                  QUBE Theatrical
                </h3>
                <p className="mt-5 text-[1rem] leading-[1.82] text-[var(--color-cream)] sm:text-[1.05rem]">
                  {qubeCopy}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10">
            <ContinueButton href="/investment" className="lg:mt-16" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
