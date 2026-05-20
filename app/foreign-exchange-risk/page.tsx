import { ContinueButton } from "@/components/continue-button";
import { PageHero } from "@/components/page-hero";
import { PageSection } from "@/components/page-section";
import { SectionCard } from "@/components/section-card";
import { foreignExchangeCopy } from "@/lib/site-content";

export default function ForeignExchangeRiskPage() {
  return (
    <>
      <PageHero
        eyebrow="Foreign Exchange Risk"
        title="Exchange-rate treatment in the investor deck."
        intro="This route isolates the foreign exchange section as its own step in the presentation flow while keeping the existing investor framing."
        imageSrc="/assets/bookcover.png"
      />
      <PageSection
        eyebrow="Risk Treatment"
        title="How non-GBP exposure is addressed."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {foreignExchangeCopy.map((item) => (
            <SectionCard
              key={item}
              title={item}
              body="Included because the deck separately addresses foreign exchange exposure for non-GBP investors."
            />
          ))}
        </div>
        <ContinueButton href="/thank-you" />
      </PageSection>
    </>
  );
}
