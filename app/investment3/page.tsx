import Link from "next/link";
import { ContinueButton } from "@/components/continue-button";
import { LargerInvestmentThesis } from "@/components/investor-opportunity-sections";

export default function InvestmentThesisPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <nav aria-label="Investment journey" className="mb-2 sm:mb-4">
        <Link
          href="/investment2"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mist)] transition hover:text-[var(--color-gold)]"
        >
          <span aria-hidden="true">&larr;</span>
          Commercial evidence
        </Link>
      </nav>

      <LargerInvestmentThesis />
      <ContinueButton href="/titles-and-terms" label="READ THE TERMS" />
    </div>
  );
}
