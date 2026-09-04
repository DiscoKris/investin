import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const marketExamples = [
  {
    title: "Come From Away",
    description: "Ordinary people caught in an extraordinary true story.",
  },
  {
    title: "Kinky Boots",
    description: "Acceptance, transformation and community.",
  },
  {
    title: "Billy Elliot",
    description: "A working-class story of education and opportunity.",
  },
];

const comparableLogos = [
  {
    title: "Come From Away",
    src: "/assets/come.jpg",
    alt: "Come From Away show logo",
    width: 396,
    height: 252,
    frameClass: "max-w-[24rem]",
  },
  {
    title: "Kinky Boots",
    src: "/assets/kinky.jpg",
    alt: "Kinky Boots show logo",
    width: 894,
    height: 922,
    frameClass: "max-w-[15rem]",
  },
  {
    title: "Billy Elliot",
    src: "/assets/billy.jpg",
    alt: "Billy Elliot show logo",
    width: 437,
    height: 437,
    frameClass: "max-w-[16rem]",
  },
];

const trendPoints = [
  "A recognisable title with built-in awareness",
  "A true story rooted in education and social change",
  "A period setting powered by music, nostalgia and energy",
];

export default function WhyNowPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] flex-col justify-center">
        <div className="grid w-full gap-6 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-8 lg:rounded-[2.4rem] lg:px-10 lg:py-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,233,188,0.1),transparent_24%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />
            <div
              className="absolute inset-y-0 right-[-5rem] hidden w-36 bg-[rgba(34,56,35,0.92)] lg:block"
              style={{
                clipPath: "polygon(22% 0, 100% 0, 72% 100%, 0 100%)",
              }}
            />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:text-right">
                <Image
                  src="/assets/tswllogo.png"
                  alt="To Sir, With Love logo"
                  width={991}
                  height={590}
                  className="h-auto w-[8.8rem] sm:w-[10rem] lg:w-[11.5rem]"
                />
                <h1 className="pt-2 text-center text-[2.3rem] font-bold uppercase leading-none tracking-[-0.03em] sm:whitespace-nowrap sm:text-right sm:text-[3rem] lg:text-[3.7rem]">
                  <span className="text-[var(--color-gold)]">Why </span>
                  <span className="text-[var(--color-ivory)]">Now?</span>
                </h1>
              </div>

              <p className="mt-6 max-w-[46rem] text-[1.08rem] leading-[1.64] text-[var(--color-ivory)] sm:text-[1.16rem] lg:mt-7 lg:text-[1.22rem] lg:leading-[1.68]">
                &ldquo;To Sir, With Love is not a typical period piece, it is a
                mirror reflecting the world we are living in today. Audiences
                are increasingly responding to true stories, social history, and
                emotionally grounded musicals that combine entertainment with
                meaning. At its heart, it is an uplifting coming-of-age story
                about young people searching for identity, belonging and hope.&rdquo;
              </p>

              <div className="mt-7 grid gap-4">
                <article className="rounded-[1.4rem] border border-[rgba(200,168,110,0.4)] bg-[rgba(200,168,110,0.09)] px-5 py-5 sm:px-6">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">A natural cultural moment</p>
                  <h2 className="mt-2 text-[1.65rem] font-bold uppercase leading-none tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[2rem]">The 60th Anniversary</h2>
                  <p className="mt-4 text-[0.96rem] leading-7 text-[var(--color-cream)]">The world premiere arrives sixty years after To Sir, With Love became an international cultural phenomenon. Released in 1967, the film introduced generations of audiences to E. R. Braithwaite&apos;s extraordinary story and created one of cinema&apos;s most enduring teacher-student narratives. The anniversary creates a natural international press, marketing and audience-engagement moment for the first major stage musical adaptation.</p>
                </article>
                <article className="rounded-[1.4rem] border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.035)] px-5 py-5 sm:px-6">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">Recognition + Creative Whitespace</p>
                  <h2 className="mt-2 text-[1.65rem] font-bold uppercase leading-none tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[2rem]">Famous, But Not Exhausted</h2>
                  <p className="mt-4 text-[0.96rem] leading-7 text-[var(--color-cream)]">Many of the world&apos;s best-known film titles have already been repeatedly adapted, revived or franchised for the stage. To Sir, With Love is different: it carries decades of international awareness, a celebrated film legacy and one of the most recognisable title songs of its era, yet this famous IP has not already been exhausted as a major stage musical. That combination of recognition and creative whitespace is increasingly rare.</p>
                </article>
              </div>

              <div className="mt-7 space-y-3">
                <p className="text-[0.96rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)] sm:text-[1rem]">
                  Market Comparables
                </p>
                <div className="space-y-2.5 text-[1rem] leading-[1.5] sm:text-[1.04rem] lg:text-[1.08rem]">
                  {marketExamples.map((example) => (
                    <p key={example.title} className="text-[var(--color-ivory)]">
                      <span className="block font-semibold text-[var(--color-gold)]">
                        {example.title}
                      </span>
                      <span className="mt-0.5 block text-[var(--color-cream)]">
                        {example.description}
                      </span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[1rem] font-semibold uppercase leading-[1.55] tracking-[0.08em] text-[var(--color-ivory)] sm:text-[1.06rem]">
                  To Sir, With Love brings together:
                </p>
                <div className="mt-4 space-y-1.5 text-[0.98rem] leading-[1.45] text-[var(--color-cream)] sm:pl-8 sm:text-[1.03rem] lg:pl-14">
                  {trendPoints.map((point) => (
                    <p key={point}>• {point}</p>
                  ))}
                </div>
              </div>

              <p className="mt-auto pt-8 text-[1.35rem] font-bold leading-[1.28] tracking-[-0.02em] text-[var(--color-gold)] sm:text-[1.6rem] lg:max-w-[52rem] lg:text-[1.95rem]">
                The World Premiere creates the commercial foundation for
                a theatrical property with future West End, Broadway and
                international potential.
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative flex min-h-0 items-start justify-center lg:self-start lg:justify-end"
          >
            <div className="relative w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[linear-gradient(180deg,rgba(13,18,16,0.94),rgba(7,10,9,0.82))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] lg:max-w-none lg:rounded-[2.4rem] lg:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_82%_84%,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
              <div className="relative grid content-center justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {comparableLogos.map((logo, index) => (
                  <div
                    key={logo.title}
                    className={[
                      `group relative w-full ${logo.frameClass} overflow-hidden rounded-2xl border border-[rgba(232,222,203,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-300 hover:border-[rgba(214,180,103,0.3)] hover:shadow-[0_24px_46px_rgba(0,0,0,0.24),0_0_24px_rgba(214,180,103,0.12)]`,
                      index === comparableLogos.length - 1
                        ? "sm:col-span-2 sm:mx-auto lg:col-span-1"
                        : "",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,rgba(214,180,103,0.04)_100%)]" />
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]" />
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        priority
                        className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 34vw, (min-width: 640px) 42vw, 100vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <ContinueButton
            href="/target-audience"
            label="WHO’S COMING?"
            className="mt-8 lg:mt-10"
          />
        </Reveal>
      </div>
    </section>
  );
}
