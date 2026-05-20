import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const audienceGroups = [
  "Film fans (50+)",
  "Theatre audiences (40+)",
  "Schools and education groups",
  "Black theatre audiences",
  "Family audiences",
];

export default function TargetAudiencePage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_88%_78%,rgba(255,255,255,0.04),transparent_16%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

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
                <h1 className="pt-1 text-[2.2rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[2.9rem] lg:text-[4rem]">
                  <span className="text-[var(--color-ivory)]">Target </span>
                  <span className="text-[var(--color-gold)]">Audience</span>
                </h1>
                <p className="mt-3 text-[1rem] font-medium leading-[1.45] text-[var(--color-ivory)] sm:text-[1.08rem]">
                  A timeless coming-of-age story for a new generation.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-12">
            <Reveal className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[35rem] rotate-[-4deg] overflow-hidden rounded-[0.4rem] border border-[rgba(214,180,103,0.92)] bg-[rgba(8,13,10,0.16)] shadow-[0_24px_50px_rgba(0,0,0,0.22)]">
                <Image
                  src="/assets/kids2.jpg"
                  alt="Production image of students from To Sir, With Love"
                  width={1200}
                  height={900}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mx-auto max-w-[30rem] text-center lg:mx-0 lg:text-left">
                <h2 className="text-[1.45rem] font-semibold leading-[1.08] text-[var(--color-gold)] sm:text-[1.7rem] lg:text-[2.25rem]">
                  Intergenerational Audience
                </h2>
                <ul className="mt-8 space-y-4 text-[1.08rem] leading-[1.45] text-[var(--color-ivory)] sm:text-[1.2rem] lg:space-y-5 lg:text-[1.35rem]">
                  {audienceGroups.map((group) => (
                    <li key={group} className="flex items-start gap-3">
                      <span className="mt-[0.2em] text-[var(--color-ivory)]">
                        •
                      </span>
                      <span>{group}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10">
            <ContinueButton href="/creative-team" className="lg:mt-12" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
