import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const featuredTeam = [
  {
    name: "Sheldon Epps",
    role: "Director",
    imageSrc: "/assets/sheldon.png",
    imageAlt: "Portrait of Sheldon Epps",
  },
  {
    name: "E.R. Braithwaite",
    role: "Autobiography",
    imageSrc: "/assets/braith1.webp",
    imageAlt: "Archival portrait of E. R. Braithwaite",
  },
  {
    name: "Joseph Joubert",
    role: "Orchestrator",
    imageSrc: "/assets/joseph.jpg",
    imageAlt: "Portrait of Joseph Joubert",
  },
  {
    name: "Sean Greene",
    role: "Musical Director",
    imageSrc: "/assets/sean.webp",
    imageAlt: "Portrait of Sean Greene",
  },
  {
    name: "Kieran Donovan",
    role: "Choreographer",
    imageSrc: "/assets/kieran.jpg",
    imageAlt: "Portrait of Kieran Donovan",
  },
  {
    name: "Shereen Phillips",
    role: "Dramaturg",
    imageSrc: "/assets/shereen.png",
    imageAlt: "Portrait of Shereen Phillips",
  },
  {
    name: "Debbie O'Brien",
    role: "Casting Director",
    imageSrc: "/assets/debbie.jpeg",
    imageAlt: "Portrait of Debbie O'Brien",
  },
];

const sheldonBio =
  "Sheldon Epps is one of the most acclaimed directors in American theatre. Epps is the visionary behind the Tony Award-nominated Blues in the Night and the Broadway musical Play On!, celebrated for blending powerful storytelling with unforgettable music.\n\nFor over twenty years, he served as Artistic Director of the legendary Pasadena Playhouse, helping shape it into one of America's premier regional theatres. His directing credits also span television classics including Friends, Frasier, and Everybody Loves Raymond.\n\nWidely respected for bringing emotional depth, humanity, and commercial appeal to his productions, Epps brings exceptional Broadway pedigree and creative leadership to To Sir, With Love.";

const josephBio =
  "Orchestrations by Joseph Joubert, an acclaimed Broadway composer, arranger, conductor, and musical director whose work spans theatre, television, and symphonic music.\n\nJoubert served as musical director and conductor for the Tony Award-winning Broadway revival of Caroline, or Change and associate conductor for The Color Purple. His theatre credits also include Dreamgirls, Chicago, and Ain't Misbehavin'.\n\nHe has collaborated with legendary artists including Nina Simone, Gladys Knight, and Patti LaBelle, and is renowned for creating rich, cinematic orchestrations that blend jazz, gospel, and contemporary musical theatre.\n\nJoseph Joubert brings exceptional Broadway pedigree, musical sophistication, and emotional power to To Sir, With Love.";

export default function CreativeTeamPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_92%_12%,rgba(255,255,255,0.04),transparent_14%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />
          <div className="pointer-events-none absolute right-8 top-6 hidden h-16 w-16 rounded-full border border-[rgba(232,222,203,0.1)] opacity-60 lg:block" />
          <div className="pointer-events-none absolute right-10 top-10 hidden h-10 w-10 rotate-[12deg] border-t border-[rgba(232,222,203,0.14)] lg:block" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.5rem] sm:w-[8.5rem] lg:absolute lg:left-0 lg:top-0 lg:w-[9rem]"
              />
              <h1 className="pt-1 text-[2.4rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[3rem] lg:text-[4.4rem]">
                <span className="text-[var(--color-ivory)]">Creative </span>
                <span className="text-[var(--color-gold)]">Team</span>
              </h1>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:mt-10 lg:grid-cols-8 lg:gap-x-5 lg:gap-y-8 xl:px-8">
            {featuredTeam.map((member, index) => (
              <Reveal
                key={member.name}
                delay={index * 0.05}
                className={`flex flex-col items-center text-center ${
                  index < 4 ? "lg:col-span-2" : ""
                } ${
                  index === 4 ? "lg:col-span-2 lg:col-start-2" : ""
                } ${
                  index === 5 ? "lg:col-span-2 lg:col-start-4" : ""
                } ${
                  index === 6 ? "lg:col-span-2 lg:col-start-6" : ""
                } ${
                  index >= 4 ? "lg:translate-y-[-0.5rem]" : ""
                }`}
              >
                <div className="group">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[rgba(214,180,103,0.92)] bg-[rgba(8,13,10,0.24)] shadow-[0_16px_36px_rgba(0,0,0,0.2)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_44px_rgba(0,0,0,0.26)] sm:h-44 sm:w-44 lg:h-40 lg:w-40 xl:h-44 xl:w-44">
                    <Image
                      src={member.imageSrc}
                      alt={member.imageAlt}
                      fill
                      className={`object-cover object-center brightness-[1.04] contrast-[1.04] saturate-[1.06] transition duration-300 group-hover:scale-[1.03] ${
                        member.name === "E.R. Braithwaite"
                          ? "grayscale"
                          : "opacity-95"
                      }`}
                      sizes="(min-width: 1280px) 11rem, (min-width: 1024px) 10rem, 11rem"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(180deg,transparent,rgba(7,15,11,0.22))]" />
                  </div>
                </div>
                <p className="mt-4 text-[1.05rem] font-semibold leading-[1.18] text-[var(--color-ivory)] sm:text-[1.12rem]">
                  {member.name}
                </p>
                <p className="mt-1 text-[0.92rem] leading-[1.25] text-[var(--color-cream)] sm:text-[0.96rem]">
                  {member.role}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="relative z-10 mt-9 flex justify-center lg:mt-8">
            <a
              href="#visionaries"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(200,168,110,0.44)] bg-[linear-gradient(180deg,rgba(244,236,222,0.9),rgba(223,209,183,0.88))] px-8 py-4 text-center text-[0.86rem] font-semibold uppercase tracking-[0.2em] text-[#253124] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(200,168,110,0.72)] hover:bg-[linear-gradient(180deg,rgba(247,241,230,0.96),rgba(230,217,192,0.92))] sm:px-10 sm:py-5 sm:text-[0.92rem]"
            >
              Meet the Visionaries
            </a>
          </Reveal>
        </div>
      </section>

      <section
        id="visionaries"
        className="scroll-mt-28 py-8 sm:py-10 lg:py-12"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.34)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(255,233,188,0.07),transparent_22%),linear-gradient(180deg,rgba(255,250,239,0.02),rgba(8,13,10,0.06))]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7rem] sm:w-[8rem] lg:absolute lg:left-0 lg:top-0 lg:w-[8.5rem]"
              />
              <h2 className="text-[2rem] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-gold)] sm:text-[2.5rem] lg:text-[3.4rem]">
                Why These Visionaries
              </h2>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <div className="max-w-[34rem]">
                <h3 className="text-[1.7rem] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[1.95rem] lg:text-[2.35rem]">
                  Sheldon Epps - Director
                </h3>
                <p className="mt-6 whitespace-pre-line text-[1.02rem] leading-[1.8] text-[var(--color-cream)] sm:text-[1.08rem]">
                  {sheldonBio}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="max-w-[34rem]">
                <h3 className="text-[1.7rem] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[1.95rem] lg:text-[2.35rem]">
                  Joseph Joubert - Orchestrator
                </h3>
                <p className="mt-6 whitespace-pre-line text-[1.02rem] leading-[1.8] text-[var(--color-cream)] sm:text-[1.08rem]">
                  {josephBio}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10">
            <ContinueButton href="/er-braithwaite" className="lg:mt-12" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
