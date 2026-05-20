import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const marketExamples = [
  {
    title: "Come From Away",
    description:
      "A true story about ordinary people in an extraordinary time.",
  },
  {
    title: "Kinky Boots",
    description: "A story of acceptance and transformation.",
  },
  {
    title: "Billy Elliot",
    description: "A working-class story about education and opportunity.",
  },
];

const comparableLogos = [
  {
    title: "Come From Away",
    src: "/assets/come.jpg",
    alt: "Come From Away show logo",
  },
  {
    title: "Kinky Boots",
    src: "/assets/kinky.jpg",
    alt: "Kinky Boots show logo",
  },
  {
    title: "Billy Elliot",
    src: "/assets/billy.jpg",
    alt: "Billy Elliot show logo",
  },
];

const trendPoints = [
  "A recognizable title with built-in audience awareness",
  "A true story rooted in social change and education",
  "A period setting with music that drives nostalgia and energy",
];

export default function WhyNowPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
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
              <div className="flex items-start justify-between gap-6">
                <Image
                  src="/assets/tswllogo.png"
                  alt="To Sir, With Love logo"
                  width={991}
                  height={590}
                  className="h-auto w-[8.8rem] sm:w-[10rem] lg:w-[11.5rem]"
                />
                <h1 className="whitespace-nowrap pt-2 text-right text-[2.3rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[3rem] lg:text-[3.7rem]">
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

              <div className="mt-7 space-y-3">
                <p className="text-[0.96rem] font-medium text-[var(--color-cream)] sm:text-[1rem]">
                  Market Comparables Include:
                </p>
                <div className="space-y-2.5 text-[1rem] leading-[1.5] sm:text-[1.04rem] lg:text-[1.08rem]">
                  {marketExamples.map((example) => (
                    <p key={example.title} className="text-[var(--color-ivory)]">
                      <span className="text-[var(--color-gold)]">
                        {example.title}
                      </span>{" "}
                      - {example.description}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[1rem] leading-[1.55] text-[var(--color-ivory)] sm:text-[1.06rem]">
                  &ldquo;To Sir, with Love sits at the intersection of these
                  proven trends:&rdquo;
                </p>
                <div className="mt-4 space-y-1.5 text-[0.98rem] leading-[1.45] text-[var(--color-cream)] sm:pl-8 sm:text-[1.03rem] lg:pl-14">
                  {trendPoints.map((point) => (
                    <p key={point}>- {point}</p>
                  ))}
                </div>
              </div>

              <p className="mt-auto pt-8 text-[1.35rem] font-semibold leading-[1.28] tracking-[-0.02em] text-[var(--color-gold)] sm:text-[1.6rem] lg:max-w-[52rem] lg:text-[1.95rem]">
                &ldquo;Audiences continue to support emotionally resonant British
                musicals rooted in identity, resilience, and social
                change.&rdquo;
              </p>
              <ContinueButton href="/target-audience" className="lg:mt-8" />
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative flex min-h-[24rem] items-stretch justify-center lg:min-h-0 lg:justify-end"
          >
            <div className="relative w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[linear-gradient(180deg,rgba(13,18,16,0.94),rgba(7,10,9,0.82))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] lg:max-w-none lg:rounded-[2.4rem] lg:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_82%_84%,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
              <div className="relative grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {comparableLogos.map((logo, index) => (
                  <div
                    key={logo.title}
                    className={[
                      "group relative overflow-hidden rounded-2xl border border-[rgba(232,222,203,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-300 hover:border-[rgba(214,180,103,0.3)] hover:shadow-[0_24px_46px_rgba(0,0,0,0.24),0_0_24px_rgba(214,180,103,0.12)]",
                      index === comparableLogos.length - 1
                        ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)] lg:col-span-1 lg:mx-0 lg:w-full"
                        : "",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,rgba(214,180,103,0.04)_100%)]" />
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]" />
                    <div className="relative aspect-[16/10] px-6 py-5 sm:px-7 lg:px-8">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        priority
                        className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 34vw, (min-width: 640px) 42vw, 100vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
