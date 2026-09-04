import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const andyBio =
  "Andy Walmsley is the internationally acclaimed designer behind some of the world's biggest theatrical productions, concerts, and live television events.\n\nBest known as the original set designer of Blood Brothers, his work spans Broadway, the West End, Las Vegas, and global touring markets, combining theatrical storytelling with bold large-scale spectacle.\n\nWalmsley brings exceptional visual imagination and world-class production value to To Sir, With Love.";

const scenicRenders = [
  {
    src: "/assets/walkin.jpg",
    alt: "Scenic production render for To Sir, With Love",
    tilt: "lg:rotate-[-1.2deg]",
    imagePosition: "center 15%",
  },
  {
    src: "/assets/staffroom.jpg",
    alt: "Second scenic production render for To Sir, With Love",
    tilt: "lg:rotate-[1deg]",
    imagePosition: "center 15%",
  },
];

export default function SetsCostumesPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_88%_78%,rgba(186,224,255,0.05),transparent_16%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.5rem] sm:w-[8.5rem] lg:absolute lg:left-0 lg:top-0 lg:w-[9rem]"
              />
              <h1 className="pt-1 text-[2.15rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[2.9rem] lg:text-[4.15rem]">
                <span className="text-[var(--color-ivory)]">Sets & </span>
                <span className="text-[var(--color-gold)]">Costumes</span>
              </h1>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 flex flex-col gap-8 lg:mt-10 lg:gap-9">
            <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-4">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <Reveal className="flex flex-col items-center lg:items-start">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[rgba(214,180,103,0.92)] bg-[rgba(8,13,10,0.24)] shadow-[0_16px_36px_rgba(0,0,0,0.2)] sm:h-44 sm:w-44">
                    <Image
                      src="/assets/andy.jpg"
                      alt="Portrait of Andy Walmsley"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: "center -20%",
                        filter:
                          "brightness(0.85) contrast(1.1) saturate(0.85)",
                        transform: "scale(1.2)",
                      }}
                      sizes="11rem"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.18)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.14),transparent_24%),linear-gradient(180deg,transparent,rgba(7,15,11,0.18))]" />
                  </div>
                  <p className="mt-4 text-[1.12rem] font-semibold leading-[1.2] text-[var(--color-ivory)]">
                    Andy Walmsley
                  </p>
                  <p className="mt-1 text-[0.86rem] font-medium uppercase tracking-[0.14em] text-[var(--color-gold)]">
                    Set &amp; Costume Designer
                  </p>
                </Reveal>
              </div>

              <div className="flex flex-col justify-center lg:-ml-4 lg:pl-0">
                <Reveal delay={0.06}>
                  <p className="whitespace-pre-line text-center text-[0.98rem] leading-[1.72] text-[var(--color-cream)] sm:text-[1.04rem] lg:max-w-[58rem] lg:text-left">
                    {andyBio}
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
              {scenicRenders.map((render, index) => (
                <Reveal
                  key={render.src}
                  delay={0.08 + index * 0.05}
                  className={render.tilt}
                >
                  <div className="overflow-hidden rounded-[1.35rem] border border-[rgba(214,180,103,0.82)] bg-[rgba(8,13,10,0.24)] shadow-[0_24px_50px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_58px_rgba(0,0,0,0.28)]">
                    <Image
                      src={render.src}
                      alt={render.alt}
                      width={1600}
                      height={980}
                      className="aspect-[1.26/1] w-full object-cover"
                      style={{ objectPosition: render.imagePosition }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,228,175,0.06),transparent_38%),linear-gradient(180deg,transparent,rgba(7,15,11,0.12))]" />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal
              delay={0.1}
              className="flex flex-col items-center text-center"
            >
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)] sm:text-[1.08rem]">
                Set Fly By
              </p>
              <div className="mt-5 w-full max-w-[48rem] overflow-hidden rounded-[1.4rem] border border-[rgba(214,180,103,0.24)] bg-[rgba(8,13,10,0.22)] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
                <div className="relative aspect-video overflow-hidden rounded-[1rem]">
                  <iframe
                    src="https://player.vimeo.com/video/1178991015?title=0&byline=0&portrait=0&badge=0&dnt=1"
                    title="To Sir, With Love set flyby"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-[linear-gradient(180deg,rgba(7,18,12,0.72),rgba(7,18,12,0.36),transparent)]" />
                </div>
              </div>
            </Reveal>

            <Reveal>
              <ContinueButton
                href="/tour"
                label="WHERE ARE WE GOING?"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
