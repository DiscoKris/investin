import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";

export default function StoryPage() {
  return (
    <section className="section-shell py-12 sm:py-16 lg:py-20">
      <div className="mb-5 flex justify-center sm:mb-6 lg:mb-7">
        <p className="max-w-[58rem] text-center text-[1.6rem] italic leading-[1.5] tracking-[-0.02em] text-[var(--color-ivory)] [text-shadow:0_6px_18px_rgba(0,0,0,0.22)] sm:text-[2rem] lg:text-[2.25rem]">
          &ldquo;A timeless coming-of-age story about young teenagers searching
          for identity, belonging, first love, and their place in the
          world.&rdquo;
        </p>
      </div>

      <div className="grid min-h-[calc(100svh-18rem)] gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="card-panel rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <p className="eyebrow mb-4 text-[var(--color-gold)]">To Sir, with Love</p>
          <h1 className="headline max-w-3xl text-[2.9rem] text-[var(--color-ivory)] sm:text-[3.7rem] lg:text-[4.6rem]">
            A TRUE STORY
          </h1>
          <p className="body-copy mt-8 max-w-3xl text-[var(--color-cream)]">
            To Sir, With Love is an autobiographical story that is every bit as
            relevant now as it was then. Rick Braithwaite is more than just a
            Cambridge-educated engineer and a former RAF fighter pilot; he is a
            man battling societal prejudices at every turn. Refusing to bow to
            adversity, he engages his students not as troublesome youths but as
            emerging adults who must soon navigate a world where they will stand
            or fall on their own merits. Through a balance of grit and grace, he
            aims to prepare them for more than just exams; he prepares them for
            life.
          </p>
          <ContinueButton href="/sizzle" label="WATCH THIS" />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute left-8 top-8 hidden h-14 w-14 rounded-full border border-[rgba(232,222,203,0.12)] bg-[rgba(246,241,230,0.04)] lg:block" />
          <div className="absolute right-10 top-14 hidden h-3 w-28 rotate-[18deg] rounded-full bg-[rgba(200,168,110,0.22)] blur-sm lg:block" />
          <div className="absolute -left-2 top-20 hidden h-24 w-24 rounded-full bg-[rgba(255,233,188,0.08)] blur-2xl lg:block" />

          <div className="relative w-full max-w-[34rem] sm:rotate-[-3deg]">
            <div className="absolute right-0 top-5 hidden h-14 w-14 rotate-[18deg] rounded-sm border border-[rgba(232,222,203,0.16)] bg-[rgba(232,222,203,0.1)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:block sm:-right-3" />
            <div className="absolute left-8 top-[-1rem] h-8 w-24 rotate-[-8deg] rounded-sm bg-[rgba(217,188,134,0.4)] shadow-[0_10px_22px_rgba(0,0,0,0.16)]" />
            <div className="absolute -bottom-5 left-4 h-12 w-28 rotate-[6deg] rounded-sm bg-[rgba(217,188,134,0.18)] blur-md" />

            <div className="paper-frame relative overflow-hidden rounded-[0.8rem] p-4 sm:p-5">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,249,238,0.08),rgba(0,0,0,0)_22%,rgba(255,249,238,0.04))]" />
              <div
                className="relative overflow-hidden rounded-[0.35rem] border border-[rgba(79,61,34,0.12)] bg-[rgba(255,255,255,0.6)]"
                style={{
                  clipPath:
                    "polygon(0 2%, 8% 0, 100% 0, 100% 97%, 93% 100%, 0 100%)",
                }}
              >
                <Image
                  src="/assets/braith1.webp"
                  alt="Archival portrait of E. R. Braithwaite"
                  width={636}
                  height={476}
                  priority
                  className="h-auto w-full object-cover grayscale"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_28%,rgba(7,28,17,0.12))]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(255,245,223,0.2),transparent_22%),radial-gradient(circle_at_78%_84%,rgba(0,0,0,0.14),transparent_28%)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
