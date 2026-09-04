import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import { StatementPreview } from "./statement-preview";

export default function WeeklyInvestorStatementsPage() {
  return (
    <section className="section-shell py-5 sm:py-6 lg:py-2">
      <div className="mx-auto grid min-h-[calc(100svh-12rem)] max-w-[92rem] gap-7 lg:grid-cols-[minmax(28rem,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-5">
        <Reveal className="flex flex-col justify-center">
          <Image
            src="/assets/tswllogo.png"
            alt="To Sir, With Love logo"
            width={991}
            height={590}
            className="h-auto w-[7rem] sm:w-[7.5rem] lg:w-[6.75rem]"
            priority
          />

          <h1 className="mt-3 text-left text-[2.7rem] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[3.4rem] lg:text-[2.8rem]">
            Biweekly Investor{" "}
            <span className="text-[var(--color-gold)]">Statements</span>
          </h1>

          <p className="mt-5 max-w-[35rem] text-[1.4rem] font-semibold leading-[1.42] text-[var(--color-cream)] sm:text-[1.5rem] lg:text-[1.29rem]">
            Investors can access their statements 24/7 through a secure portal,
            with accounts and statements updated biweekly (every 14 days).
          </p>

          <div className="hidden lg:block">
            <ContinueButton href="/disclaimer" className="mt-3" />
          </div>
        </Reveal>

        <Reveal
          delay={0.08}
          className="flex min-w-0 flex-col items-center justify-center"
        >
          <StatementPreview />

          <div className="lg:hidden">
            <ContinueButton href="/disclaimer" className="mt-6" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
