import Link from "next/link";
import { ContinueButton } from "@/components/continue-button";
import { CapitalTransparency } from "@/components/investor-opportunity-sections";
import { MarketValidation } from "@/components/market-validation";

export default function InvestmentEvidencePage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <nav aria-label="Investment journey" className="mb-2 sm:mb-4">
        <Link
          href="/investment"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mist)] transition hover:text-[var(--color-gold)]"
        >
          <span aria-hidden="true">&larr;</span>
          Investment overview
        </Link>
      </nav>

      <MarketValidation />
      <CapitalTransparency />
      <ContinueButton href="/investment3" label="TELL ME MORE" />
    </div>
  );
}
