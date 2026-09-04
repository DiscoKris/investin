import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const qubeCopy =
  "QUBE Theatrical is a general management company at the forefront of live entertainment, specialising in concerts, musicals in concert, and theatre productions across the West End, national and international tours, and one-night-only events. Founded by Sam Quested and Darren Bell, QUBE combines over two decades of experience delivering award-winning musicals, world-class concerts and landmark staged events.";

const mpiCopy =
  "Magic Pictures International is Lead Producer. Based in Los Angeles, MPI specialises in the development, production and marketing of live entertainment across North America. Recent credits include Grease, Rodgers and Hammerstein's Cinderella, Mary Poppins, Wizard of Oz, Beauty and the Beast and Aladdin. MPI has produced over 50 musical theatre productions.";

const dueDiligence = [
  {
    question: "Have you managed budgets like this before?",
    answer: "Magic Pictures International has produced more than 50 musical-theatre productions across major U.S. regional theatres and international touring markets. QUBE Theatrical brings more than two decades of experience across West End, touring, concert and staged-event production. These credentials demonstrate relevant production and general-management experience; they do not remove investment risk.",
  },
  { question: "Who controls expenditure?", answer: "Both Magic Pictures and QUBE must sign off on all expenditure." },
  { question: "Who signs off overspend?", answer: "Any overspend must be signed off by both QUBE and Magic Pictures. Investors will be notified if the overspend exceeds the production contingency of 3%." },
  { question: "Is there a contingency?", answer: "Yes. A 3% contingency is built into the capitalization." },
  { question: "Can you come back to me for more money?", answer: "No. Your subscribed investment is your committed capital. But you can come back to us and invest more if you like what you are seeing." },
  { question: "Who prepares the production accounts?", answer: "The production accounts are prepared by an independent third-party firm of professional UK accountants." },
  { question: "Who submits the Theatre Tax Relief claim?", answer: "The production accountants submit the Theatre Tax Relief claim and have years of experience preparing and submitting UK Theatre Tax Relief claims." },
  { question: "When are investor statements updated?", answer: "Investor accounts and statements are updated biweekly (every 14 days) during the active production and box-office period." },
  {
    question: "What happens if you’ve raised £600,000 but not £750,000?",
    answer: [
      "The production is capitalized at £750,000. The Producers are responsible for completing the capitalization required for the World Premiere production.",
      "An individual investor is not responsible for funding any shortfall beyond their subscribed investment.",
    ],
  },
  { question: "When is my money released into production?", answer: "Investor capital will be released into the production by April 15, 2027." },
  {
    question: "Is investor capital ring-fenced?",
    answer: [
      "Yes. Greenslade Productions Ltd is the dedicated production company established for TO SIR, WITH LOVE.",
      "Investor capital and Production revenues are accounted for within Greenslade Productions Ltd and are used solely in connection with the development, production, operation and exploitation of TO SIR, WITH LOVE, together with associated Production expenses and reserves.",
      "Unrelated productions or business activities are not funded through Greenslade Productions Ltd.",
    ],
  },
];

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
              <span className="text-[var(--color-gold)]">Production Team</span>
            </h2>
          </Reveal>

          <div className="relative z-10 mt-10 grid gap-10 lg:mt-11 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <div className="mx-auto flex h-full max-w-[30rem] flex-col text-center lg:mx-0 lg:justify-start lg:text-left">
                <h3 className="text-[1.42rem] font-semibold leading-[1.1] text-[var(--color-ivory)] sm:text-[1.55rem]">
                  Magic Pictures International
                </h3>
                <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  Lead Producer
                </p>
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
                <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  General Manager
                </p>
                <p className="mt-5 text-[1rem] leading-[1.82] text-[var(--color-cream)] sm:text-[1.05rem]">
                  {qubeCopy}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10 mt-12 border-t border-[rgba(232,222,203,0.14)] pt-10">
            <div className="mx-auto max-w-5xl">
              <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">Investor due diligence</p>
              <h2 className="mt-3 text-center text-[clamp(1.9rem,6vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-ivory)]">INVESTOR Q&amp;A</h2>
              <div className="mx-auto mt-7 max-w-md">
                <div className="rounded-[1.2rem] border border-[rgba(214,180,103,0.28)] bg-[rgba(8,13,10,0.18)] px-5 py-5 text-center">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-gold)]">Total Capital Raise</p>
                  <p className="mt-2 text-[1.8rem] font-semibold leading-none text-[var(--color-ivory)]">£750,000</p>
                </div>
              </div>
              <div className="mt-7 space-y-3">
                {dueDiligence.map((item, index) => (
                  <details key={item.question} className="group rounded-[1.2rem] border border-[rgba(232,222,203,0.12)] bg-[rgba(8,13,10,0.18)] px-5 py-4" open={index === 0}>
                    <summary className="cursor-pointer list-none pr-7 font-semibold text-[var(--color-ivory)] marker:hidden">
                      <span className="flex items-start justify-between gap-4"><span>{item.question}</span><span aria-hidden="true" className="text-[var(--color-gold)] group-open:rotate-45">+</span></span>
                    </summary>
                    <div className="mt-4 space-y-3 border-t border-[rgba(232,222,203,0.1)] pt-4 text-sm leading-7 text-[var(--color-cream)]">
                      {(Array.isArray(item.answer) ? item.answer : [item.answer]).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="relative z-10">
            <ContinueButton
              href="/investment"
              label="HOW IT ALL WORKS"
              className="lg:mt-16"
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
