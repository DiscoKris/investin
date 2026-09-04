import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import {
  capitalRequirement,
  commercialScenarios,
  formatGbp,
  productionBreakEvenPercentage,
  targetBreakEvenCapacity,
  targetScenario,
  totalGrossBoxOfficePotential,
  totalPerformanceWeeks,
  totalRunningCosts,
  weeklyRunningCosts,
  worldPremiereVenues,
} from "@/lib/commercial-model";

const capacities = commercialScenarios.map((scenario) => ({
  label: scenario.label,
  isTarget: scenario.capacity === targetBreakEvenCapacity,
  accent:
    scenario.accent === "green"
      ? "text-[#b6e269]"
      : scenario.accent === "downside"
        ? "text-[#f0b48f]"
      : "text-[var(--color-gold)]",
}));

const recoupmentRows = [
  {
    label: `Gross Box Office (${totalPerformanceWeeks} Weeks)`,
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.grossBoxOffice),
    ),
    emphasis: false,
  },
  {
    label: "VAT and credit card fees",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.vatAndCardFees),
    ),
    emphasis: false,
  },
  {
    label: "Net Box Office",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.netBoxOffice),
    ),
    emphasis: true,
  },
  {
    label: "Royalties (16% of Net)",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.royalties),
    ),
    emphasis: false,
  },
  {
    label: "Venue share (Hull percentage arrangement only)",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.venueCosts),
    ),
    emphasis: false,
  },
  {
    label: "Production Surplus",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.productionSurplus),
    ),
    emphasis: true,
  },
  {
    label: `Running Costs (${totalPerformanceWeeks} Weeks)`,
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.totalRunningCosts),
    ),
    emphasis: false,
  },
  {
    label: "Merchandise — excluded from this recoupment illustration",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.totalMerchandiseContribution),
    ),
    emphasis: false,
  },
  {
    label: "Estimated Theatre Tax Relief",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.estimatedTheatreTaxRelief),
    ),
    emphasis: false,
  },
  {
    label: "Less Capitalization",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.lessCapitalization),
    ),
    emphasis: false,
  },
  {
    label: "Post-Recoupment Net Profit",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.postRecoupmentProfit),
    ),
    emphasis: true,
  },
  {
    label: "Investor Profit Pool (60%)",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.investorProfitPool),
    ),
    emphasis: true,
  },
  {
    label: "Investor Capital Still Unrecouped",
    values: commercialScenarios.map((scenario) =>
      formatGbp(scenario.unrecoupedCapital),
    ),
    emphasis: true,
  },
];

const summaryRows = [
  {
    label: "Total Gross Box Office Potential",
    qualifier: `${totalPerformanceWeeks} weeks`,
    value: formatGbp(totalGrossBoxOfficePotential),
  },
  {
    label: "Weekly Running Costs",
    qualifier: `${formatGbp(totalRunningCosts)} total`,
    value: formatGbp(weeklyRunningCosts),
  },
  {
    label: "Required Capital Raise",
    qualifier: "",
    value: formatGbp(capitalRequirement),
    accent: true,
  },
];

export default function RecoupmentChartPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
        <Reveal className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-8 lg:rounded-[2.4rem] lg:px-10 lg:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(255,233,188,0.04),transparent_18%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex flex-col gap-5">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.25rem] sm:w-[8rem]"
              />

              <div className="text-center">
                <h1 className="text-[2.2rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.85rem] lg:text-[4rem]">
                  Recoupment <span className="text-[var(--color-gold)]">Chart</span>
                </h1>
                <p className="mt-3 text-[0.98rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold)] sm:text-[1.05rem] lg:text-[1.1rem]">
                  Five-week World Premiere: Leeds, Hull and London
                </p>
              </div>
            </div>

            <div className="mx-auto mt-6 w-full max-w-[34rem] rounded-[1.4rem] border border-[rgba(214,180,103,0.62)] bg-[rgba(12,14,13,0.72)] px-5 py-4 shadow-[0_18px_42px_rgba(0,0,0,0.26)] sm:rounded-[1.6rem] sm:px-8">
              <div className="space-y-2.5">
                {summaryRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 text-[1rem] leading-[1.35] sm:grid-cols-[1fr_auto_auto] sm:items-center sm:text-[1.05rem]"
                  >
                    <p
                      className={`${
                        row.accent
                          ? "font-semibold text-[var(--color-gold)]"
                          : "text-[var(--color-ivory)]"
                      }`}
                    >
                      {row.label}
                    </p>
                    <p className="hidden text-[var(--color-cream)] sm:block">{row.qualifier}</p>
                    <p
                      className={`text-right font-semibold ${
                        row.accent
                          ? "text-[var(--color-gold)]"
                          : "text-[var(--color-ivory)]"
                      }`}
                    >
                      {row.value}
                    </p>
                    {row.qualifier ? (
                      <p className="col-span-2 text-sm text-[var(--color-cream)] sm:hidden">
                        {row.qualifier}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {worldPremiereVenues.map((venue) => (
                <div
                  key={venue.venue}
                  className="rounded-[1.25rem] border border-[rgba(214,180,103,0.2)] bg-[rgba(8,13,10,0.18)] px-4 py-4 text-center"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                    {venue.venue}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--color-ivory)]">
                    {formatGbp(venue.grossBoxOfficePotential)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-mist)]">
                    {venue.timing} · {venue.weeks}{" "}
                    {venue.weeks === 1 ? "week" : "weeks"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-4 md:hidden">
              {capacities.map((capacity, capacityIndex) => (
                <article
                  key={capacity.label}
                  className="overflow-hidden rounded-[1.5rem] border border-[rgba(214,180,103,0.52)] bg-[linear-gradient(145deg,rgba(2,3,3,0.9),rgba(44,44,44,0.68))] shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[rgba(232,222,203,0.12)] px-5 py-4">
                    <h2 className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-cream)]">
                      Percentage capacity
                    </h2>
                    <p className={`text-[1.45rem] font-bold leading-none ${capacity.accent}`}>
                      {capacity.label}
                    </p>
                  </div>
                  <dl className="px-5 py-3">
                    {recoupmentRows.map((row) => {
                      const value = row.values[capacityIndex];
                      const isNegative = value.startsWith("-");

                      return (
                        <div
                          key={`${capacity.label}-${row.label}`}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-[rgba(232,222,203,0.07)] py-3 last:border-b-0"
                        >
                          <dt className={`text-sm leading-5 ${row.emphasis ? "font-semibold text-[var(--color-gold)]" : "text-[var(--color-mist)]"}`}>
                            {row.label}
                          </dt>
                          <dd className={`whitespace-nowrap text-right text-sm leading-5 ${row.emphasis ? "font-semibold" : "text-[var(--color-cream)]"} ${capacity.isTarget ? (isNegative ? "text-[#c9df8d]" : "text-[#b6e269]") : row.emphasis ? "text-[var(--color-gold)]" : ""}`}>
                            {value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-7 hidden overflow-x-auto rounded-[1.9rem] border border-[rgba(214,180,103,0.72)] bg-[linear-gradient(90deg,rgba(2,3,3,0.88),rgba(44,44,44,0.72))] px-5 py-6 shadow-[0_20px_46px_rgba(0,0,0,0.3)] sm:px-7 md:block lg:mt-8 lg:px-8 lg:py-7">
              <div className="grid min-w-[68rem] grid-cols-[1.55fr_repeat(5,minmax(0,1fr))] items-end gap-x-4 border-b border-[rgba(232,222,203,0.12)] pb-3">
                <div>
                  <p className="text-[1.06rem] font-semibold uppercase tracking-[0.04em] text-[var(--color-gold)] sm:text-[1.1rem]">
                    Percentage Capacity
                  </p>
                </div>
                {capacities.map((capacity) => (
                  <div key={capacity.label} className="text-center">
                    <p
                      className={`text-[1.18rem] font-bold leading-none sm:text-[1.28rem] ${capacity.accent}`}
                    >
                      {capacity.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1.5">
                {recoupmentRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid min-w-[68rem] grid-cols-[1.55fr_repeat(5,minmax(0,1fr))] items-center gap-x-4 border-b border-[rgba(232,222,203,0.06)] py-2.5 last:border-b-0"
                  >
                    <p
                      className={`text-[0.98rem] leading-[1.2] sm:text-[1.02rem] ${
                        row.emphasis
                          ? "font-semibold text-[var(--color-gold)]"
                          : "text-[var(--color-cream)]"
                      }`}
                    >
                      {row.label}
                    </p>

                    {row.values.map((value, index) => {
                      const isThreshold =
                        capacities[index]?.isTarget;
                      const isNegative = value.startsWith("-");

                      return (
                        <p
                          key={`${row.label}-${capacities[index]?.label}`}
                          className={`text-center text-[0.98rem] leading-[1.2] sm:text-[1.04rem] ${
                            row.emphasis
                              ? "font-semibold"
                              : "font-medium text-[var(--color-cream)]"
                          } ${
                            isThreshold
                              ? isNegative
                                ? "text-[#c9df8d]"
                                : "text-[#b6e269]"
                              : row.emphasis
                                ? "text-[var(--color-gold)]"
                                : "text-[var(--color-cream)]"
                          }`}
                        >
                          {value}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-[rgba(182,226,105,0.28)] bg-[rgba(182,226,105,0.06)] px-5 py-4 sm:px-6">
              <p className="text-center text-[0.94rem] leading-[1.65] text-[var(--color-cream)] sm:text-[0.98rem]">
                <span className="font-semibold uppercase tracking-[0.08em] text-[#b6e269]">Modeled recoupment point:</span>{" "}
                approximately{" "}
                <span className="font-semibold text-[#b6e269]">
                  {productionBreakEvenPercentage} of modeled gross potential
                </span>
                , based on the assumptions shown and including estimated UK
                Theatre Tax Relief. At this modeled point, new investor capital
                is fully recouped and
                Post-Recoupment Net Profit is{" "}
                <span className="font-semibold text-[var(--color-ivory)]">
                  {formatGbp(targetScenario.postRecoupmentProfit)}
                </span>
                . This is not a guarantee. Theatre Tax Relief is estimated and
                remains subject to qualifying expenditure and a successful claim.
              </p>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-[rgba(240,180,143,0.34)] bg-[rgba(240,180,143,0.07)] px-5 py-4 sm:px-6">
              <p className="text-center text-[0.94rem] leading-[1.65] text-[var(--color-cream)] sm:text-[0.98rem]">
                <span className="font-semibold uppercase tracking-[0.08em] text-[#f0b48f]">50% capacity downside:</span>{" "}
                lower box-office performance leaves{" "}
                <span className="font-semibold text-[var(--color-ivory)]">
                  {formatGbp(commercialScenarios.at(-1)?.unrecoupedCapital ?? 0)}
                </span>{" "}
                of total investor capital unrecouped in the model. Theatre
                investment involves substantial risk; lower performance may
                result in only partial return of capital or loss of the entire
                investment.
              </p>
            </div>

            <ContinueButton
              href="/example-investment"
              label="I NEED AN EXAMPLE"
              className="lg:mt-8"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
