import { PageHero } from "@/components/page-hero";
import { PageSection } from "@/components/page-section";
import { SectionCard } from "@/components/section-card";
import { investmentSteps } from "@/lib/site-content";

export default function HowInvestmentWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How Investment Works"
        title="Theatre investment explained in plain English."
        intro="This page strips away jargon. It gives prospective investors a clear visual sense of what usually happens between first interest, documentation, production launch and eventual participation."
      />
      <PageSection
        eyebrow="Simple Process"
        title="Five clear steps."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {investmentSteps.map((item) => (
            <SectionCard
              key={item.step}
              eyebrow={`Step ${item.step}`}
              title={item.title}
              body={item.body}
            />
          ))}
        </div>
      </PageSection>
    </>
  );
}
