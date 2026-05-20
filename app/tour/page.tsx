import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import { ConcertFootageModal } from "@/app/tour/concert-footage-modal";

const tourWeeks = [
  { week: "Week 1-3:", details: "Leeds, April 13 2027" },
  { week: "Week 4:", details: "Cheltenham, 26 April 2027" },
  { week: "Week 5:", details: "Hull, 3 May 2027" },
  { week: "Week 6:", details: "Liverpool, 10 May 2027" },
  { week: "Week 7:", details: "Windsor, 17 May 2027" },
  { week: "Week 8:", details: "Blackpool, 24 May 2027" },
  { week: "Week 9:", details: "Chesterfield, 31 May 2027" },
  { week: "Week 10:", details: "Northampton, 7 June 2027" },
  { week: "Week 11:", details: "Malvern, 14 June 2027" },
  { week: "Week 12:", details: "Wolverhampton, 21 June 2027" },
  { week: "Week 13:", details: "Cambridge, 28 June 2027" },
  { week: "Week 14:", details: "Bournemouth, 5 July 2027" },
  { week: "Week 15-16:", details: "London, 12 July 2027" },
];

export default function TourPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
        <div className="grid w-full gap-6 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-8 lg:rounded-[2.4rem] lg:px-10 lg:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

            <div className="relative z-10 flex h-full flex-col">
              <div>
                <p className="text-center text-[2.25rem] font-bold uppercase leading-[0.98] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.85rem] lg:text-[4rem]">
                  The <span className="text-[var(--color-gold)]">60th</span>{" "}
                  Anniversary Tour
                </p>
                <p className="mt-4 text-center text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:text-[0.95rem] lg:text-[1rem]">
                  Hollywood made the movie. Now it&apos;s time for Broadway.
                </p>
              </div>

              <div className="mt-7 grid gap-y-2.5 sm:mt-8 lg:mt-7">
                {tourWeeks.map((stop) => (
                  <p
                    key={`${stop.week}-${stop.details}`}
                    className="text-[0.98rem] leading-[1.42] text-[var(--color-ivory)] sm:text-[1.05rem] lg:text-[1.08rem]"
                  >
                    <span className="font-semibold">{stop.week}</span>{" "}
                    <span className="font-normal">{stop.details}</span>
                  </p>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <p className="mx-auto max-w-[30rem] text-center text-[0.92rem] font-medium uppercase leading-[1.55] tracking-[0.08em] text-[var(--color-cream)] sm:text-[0.98rem]">
                  Watch footage from the London concert for a sneak peek at the
                  production.
                </p>
                <ConcertFootageModal />
                <ContinueButton href="/producers" className="lg:mt-8" />
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative z-0 flex min-h-[24rem] items-stretch justify-center lg:min-h-0 lg:justify-end"
          >
            <div className="card-panel relative z-0 w-full overflow-hidden rounded-[2rem] p-4 lg:rounded-[2.4rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_14%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
              <Image
                src="/assets/tswl-tour-map.png"
                alt="TSWL UK tour map"
                width={1024}
                height={1536}
                priority
                className="relative z-10 h-full w-full rounded-[1.5rem] object-contain bg-[rgba(8,13,10,0.16)] p-2"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
