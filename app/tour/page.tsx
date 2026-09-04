import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import { ConcertFootageModal } from "@/app/tour/concert-footage-modal";
import {
  formatGbp,
  worldPremiereVenues,
} from "@/lib/commercial-model";

function JourneyConnector() {
  return (
    <div
      aria-hidden="true"
      className="flex h-14 flex-col items-center justify-center sm:h-16"
    >
      <span className="h-9 w-px bg-gradient-to-b from-[rgba(214,180,103,0.28)] to-[var(--color-gold)] sm:h-10" />
      <span className="-mt-px rotate-45 border-b border-r border-[var(--color-gold)] p-1.5" />
    </div>
  );
}

function PendingDestinationCard({
  city,
  duration,
}: {
  city: string;
  duration: string;
}) {
  return (
    <article className="mx-auto flex h-[11rem] w-full flex-col items-center justify-center rounded-[1.35rem] border border-[rgba(214,180,103,0.24)] bg-[linear-gradient(145deg,rgba(46,71,45,0.86),rgba(19,37,25,0.94))] px-5 py-6 text-center shadow-[0_18px_38px_rgba(0,0,0,0.19)] sm:h-[11.5rem] sm:max-w-[34rem] sm:px-8 sm:py-7">
      <h3 className="text-[1.65rem] font-bold uppercase leading-none tracking-[-0.02em] text-[var(--color-ivory)] sm:text-[2rem]">
        {city}
      </h3>
      <span className="mx-auto my-3 block h-px w-10 bg-[var(--color-gold)]" />
      <p className="text-[0.95rem] font-medium leading-6 text-[var(--color-cream)] sm:text-base">
        {duration}
      </p>
      <p className="mt-3 text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.18em] text-[var(--color-gold)] sm:text-[0.72rem]">
        Announcement to Come
      </p>
    </article>
  );
}

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
                  The <span className="text-[var(--color-gold)]">World</span>{" "}
                  Premiere
                </p>
                <p className="mt-4 text-center text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:text-[0.95rem] lg:text-[1rem]">
                  A contained five-week commercial launch of a global theatrical property
                </p>
              </div>

              <div className="mt-7 grid gap-4 sm:mt-8 lg:mt-7">
                {worldPremiereVenues.map((stop) => (
                  <div
                    key={stop.venue}
                    className="rounded-[1.35rem] border border-[rgba(232,222,203,0.1)] bg-[rgba(8,13,10,0.16)] px-5 py-4"
                  >
                    <p className="font-semibold text-[var(--color-ivory)] sm:text-[1.08rem]">
                      {stop.timing}: {stop.venue}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-mist)]">
                      {stop.weeks} {stop.weeks === 1 ? "week" : "weeks"} ·{" "}
                      {formatGbp(stop.grossBoxOfficePotential)} gross box office
                      potential
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-8 sm:pt-10">
                <p className="mx-auto max-w-[34rem] text-center text-[1rem] font-medium leading-[1.7] text-[var(--color-cream)]">
                  This World Premiere establishes the production, audience
                  response and commercial platform for future West End,
                  Broadway and international productions.
                </p>
                <ConcertFootageModal />
                <ContinueButton
                  href="/producers"
                  label="WHO ARE YOU TRUSTING?"
                  className="lg:mt-8"
                />
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative z-0 flex items-stretch justify-center lg:justify-end"
          >
            <div className="card-panel relative z-0 w-full overflow-hidden rounded-[2rem] px-5 py-7 sm:px-7 sm:py-8 lg:rounded-[2.4rem] lg:px-8 lg:py-9">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_14%,rgba(255,233,188,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
              <div className="relative z-10">
                <header className="mx-auto max-w-[40rem] text-center">
                  <h2 className="text-[clamp(1.55rem,7vw,2.65rem)] font-bold uppercase leading-[1.08] tracking-[-0.025em] text-[var(--color-ivory)]">
                    World Premiere Commercial Production
                  </h2>
                </header>

                <ol className="mx-auto mt-7 max-w-[48rem] sm:mt-8">
                  <li>
                    <article className="group relative overflow-hidden rounded-[1.4rem] border border-[rgba(214,180,103,0.24)] bg-[rgba(7,18,12,0.48)] shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:rounded-[1.65rem]">
                      <Image
                        src="/assets/leedsweb.png"
                        alt="To Sir, With Love at Leeds Grand Theatre"
                        width={2048}
                        height={944}
                        priority
                        className="h-auto w-full"
                        sizes="(min-width: 1024px) 44vw, (min-width: 640px) calc(100vw - 7rem), calc(100vw - 4.75rem)"
                      />
                      <div className="border-t border-[rgba(214,180,103,0.18)] px-5 py-5 text-center sm:px-7 sm:py-6">
                        <h3 className="text-[1.65rem] font-bold uppercase leading-none tracking-[-0.02em] text-[var(--color-ivory)] sm:text-[2rem]">
                          Leeds
                        </h3>
                        <span className="mx-auto my-3 block h-px w-10 bg-[var(--color-gold)]" />
                        <p className="text-[0.95rem] font-medium leading-6 text-[var(--color-cream)] sm:text-base">
                          3 Week World Premiere Engagement
                        </p>
                      </div>
                    </article>
                  </li>

                  <li>
                    <JourneyConnector />
                    <article className="group relative overflow-hidden rounded-[1.4rem] border border-[rgba(214,180,103,0.24)] bg-[rgba(7,18,12,0.48)] shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:rounded-[1.65rem]">
                      <Image
                        src="/hull.png"
                        alt="To Sir, With Love at Hull Theatres"
                        width={1920}
                        height={1080}
                        className="h-auto w-full"
                        sizes="(min-width: 1024px) 44vw, (min-width: 640px) calc(100vw - 7rem), calc(100vw - 4.75rem)"
                      />
                      <div className="border-t border-[rgba(214,180,103,0.18)] px-5 py-5 text-center sm:px-7 sm:py-6">
                        <h3 className="text-[1.65rem] font-bold uppercase leading-none tracking-[-0.02em] text-[var(--color-ivory)] sm:text-[2rem]">
                          Hull
                        </h3>
                        <span className="mx-auto my-3 block h-px w-10 bg-[var(--color-gold)]" />
                        <p className="text-[0.95rem] font-medium leading-6 text-[var(--color-cream)] sm:text-base">
                          1 Week Engagement
                        </p>
                      </div>
                    </article>
                  </li>

                  <li>
                    <JourneyConnector />
                    <PendingDestinationCard
                      city="London"
                      duration="1 Week Engagement"
                    />
                  </li>
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
