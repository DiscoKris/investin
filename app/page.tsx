import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

const disclaimer =
  "The content of this promotion has not been approved by an authorised person within the meaning of the Financial Services and Markets Act 2000. Reliance on this promotion for the purpose of engaging in any investment activity may expose an individual to a significant risk of losing all of the property or other assets invested. This presentation is private and confidential and is for private circulation only to the named recipient. If you are not an intended recipient, please do not access, copy, distribute or rely upon this presentation. All information contained in this presentation is confidential and must not be shared or provided to any third party without the prior written consent of the Producer.";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,217,146,0.12),transparent_20%),radial-gradient(circle_at_82%_20%,rgba(255,209,130,0.1),transparent_18%),linear-gradient(180deg,rgba(15,22,17,0.08),rgba(12,17,13,0.38))]" />
      <div className="section-shell relative min-h-[calc(100svh-4.5rem)] py-8 sm:py-12 lg:py-16">
        <Reveal className="relative z-10 mb-8 text-center">
          <h1 className="headline text-[clamp(2rem,12vw,2.5rem)] font-semibold uppercase tracking-[0.01em] text-[var(--color-ivory)] sm:text-[3.2rem] lg:text-[3.75rem]">
            By Invitation Only
          </h1>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <Reveal className="relative z-10 flex flex-col items-center text-center lg:min-h-[72svh] lg:items-center lg:justify-between">
            <div className="w-full max-w-4xl" />

            <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center">
              <p className="mb-4 text-center text-[1.05rem] font-semibold uppercase leading-tight tracking-[0.12em] text-[var(--color-gold)] sm:text-[1.6rem] sm:tracking-[0.18em] lg:text-[1.9rem]">
                Based On A True Story
              </p>
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love handwritten logo"
                width={991}
                height={590}
                priority
                className="h-auto w-full max-w-[35rem]"
              />
              <p className="mt-8 max-w-3xl text-[1.55rem] font-medium leading-[1.2] tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[2rem] lg:text-[2.35rem]">
                Good teachers don&apos;t just teach.
                <br />
                They change lives.
              </p>
              <div className="mt-8 flex w-full justify-center">
                <a
                  href="/calculator"
                  className="mobile-action inline-flex items-center justify-center rounded-full border border-[rgba(200,168,110,0.44)] bg-[linear-gradient(180deg,rgba(244,236,222,0.9),rgba(223,209,183,0.88))] px-5 py-4 text-center text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#253124] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(200,168,110,0.72)] hover:bg-[linear-gradient(180deg,rgba(247,241,230,0.96),rgba(230,217,192,0.92))] sm:px-14 sm:py-6 sm:text-[1rem] sm:tracking-[0.22em]"
                >
                  Enter The Presentation
                </a>
              </div>
            </div>

            <div className="w-full max-w-5xl pt-8 sm:pt-10 lg:pt-12">
              <p className="mb-5 text-[0.95rem] font-medium uppercase tracking-[0.18em] text-[var(--color-ivory)] sm:text-[1.05rem] lg:text-[1.15rem]">
                WORLD PREMIERE 2027 · WEST END · BROADWAY · INTERNATIONAL
              </p>
              <div className="mx-auto max-w-5xl border-t border-[rgba(232,222,203,0.14)] pt-4">
                <p className="text-[0.78rem] font-semibold uppercase leading-5 tracking-[0.1em] text-[var(--color-cream)] sm:text-[0.8rem] sm:tracking-[0.14em]">
                  Not For Distribution Beyond Authorised Recipients
                </p>
                <p className="mt-3 text-left text-[0.875rem] leading-[1.7] text-[rgba(246,241,230,0.8)]">
                  {disclaimer}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.12}
            className="relative z-10 flex items-center justify-center lg:justify-end"
          >
            <div className="flex w-full max-w-[28rem] flex-col items-center">
              <div className="paper-frame relative w-full rotate-[-2deg] rounded-[0.45rem] p-3 sm:p-4">
                <Image
                  src="/assets/bookcover.png"
                  alt="Original To Sir, With Love book cover"
                  width={1639}
                  height={2500}
                  priority
                  className="h-auto w-full rounded-[0.15rem] object-cover"
                />
              </div>
              <Link
                href="/login"
                className="mt-5 rounded-sm text-[1.45rem] font-semibold leading-7 tracking-[0.08em] text-[var(--color-gold)] transition hover:brightness-125 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] sm:text-[1.6rem] sm:tracking-[0.1em]"
              >
                Already an Investor?
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
