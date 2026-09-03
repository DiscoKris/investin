export const capitalRequirement = 750_000;
export const unitPrice = 1_000;
export const existingDevelopmentUnits = 175;
export const historicDevelopmentExpenditure = 175_000;
export const offeringUnits = capitalRequirement / unitPrice;
export const fullySubscribedUnits = existingDevelopmentUnits + offeringUnits;
export const weeklyRunningCosts = 105_000;
export const operatingWeeks = 5;
export const totalOperatingCosts = operatingWeeks * weeklyRunningCosts;
export const totalMerchandiseContribution = 60_000;
export const estimatedTheatreTaxRelief = 275_000;
export const investorPostRecoupmentShare = 0.6;
export const vatDivisor = 1.2;
export const creditCardFeeRate = 0.05;
export const royaltyRate = 0.16;

export const leedsEngagementCost = 315_000;
export const hullEngagementCost = 105_000;
export const londonEngagementCost = 105_000;

// Leeds and London venue/rental costs are included in their approved all-in
// engagement costs, so neither has a separate fixed-rent deduction.
export const leedsFixedRent = 0;
export const hullProducerShare = 0.85;
export const hullVenueShare = 1 - hullProducerShare;
export const londonFixedRent = 0;

export const worldPremiereVenues = [
  {
    venue: "Leeds",
    weeks: 3,
    timing: "Weeks 1–3",
    grossBoxOfficePotential: 1_460_000,
  },
  {
    venue: "Hull",
    weeks: 1,
    timing: "Week 4",
    grossBoxOfficePotential: 260_000,
  },
  {
    venue: "London",
    weeks: 1,
    timing: "Week 5",
    grossBoxOfficePotential: 550_000,
  },
] as const;

// The approved five-week, three-city gross potential inputs are kept consistent
// with the £2,270,000 total presented throughout the investor materials. Leeds
// and London use approved all-in costs; only Hull has a venue percentage share.
const spreadsheetFinancialVenues = [
  {
    venue: "Leeds",
    grossBoxOfficePotential: 1_460_000,
    engagementCost: leedsEngagementCost,
    deal: { type: "allIn" },
  },
  {
    venue: "Hull",
    weeks: 1,
    timing: "Week 4",
    grossBoxOfficePotential: 260_000,
    engagementCost: hullEngagementCost,
    deal: { type: "boxOfficeSplit", producerShare: hullProducerShare },
  },
  {
    venue: "London",
    grossBoxOfficePotential: 550_000,
    engagementCost: londonEngagementCost,
    deal: { type: "allIn" },
  },
] as const;

export const totalPerformanceWeeks = worldPremiereVenues.reduce(
  (total, venue) => total + venue.weeks,
  0,
);

export const totalGrossBoxOfficePotential = worldPremiereVenues.reduce(
  (total, venue) => total + venue.grossBoxOfficePotential,
  0,
);

export const totalRunningCosts = spreadsheetFinancialVenues.reduce(
  (total, venue) => total + venue.engagementCost,
  0,
);

// The approved model totals five operating weeks at the stated all-in weekly
// cost. Keep this assertion close to the spreadsheet-derived venue inputs so a
// future edit cannot silently reintroduce a schedule/cost mismatch.
if (totalRunningCosts !== totalOperatingCosts) {
  throw new Error("Commercial model running costs do not match the five-week schedule.");
}

function calculateVenueScenario(
  venue: (typeof spreadsheetFinancialVenues)[number],
  capacity: number,
) {
  const grossBoxOffice = venue.grossBoxOfficePotential * capacity;
  const boxOfficeExcludingVat = grossBoxOffice / vatDivisor;
  const vat = grossBoxOffice - boxOfficeExcludingVat;
  const creditCardFees = grossBoxOffice * creditCardFeeRate;
  const vatAndCardFees = vat + creditCardFees;
  const netBoxOffice = grossBoxOffice - vatAndCardFees;
  const royalties = netBoxOffice * royaltyRate;
  const beforeVenueCosts = netBoxOffice - royalties;
  const venueCosts =
    venue.deal.type === "boxOfficeSplit"
      ? beforeVenueCosts * (1 - venue.deal.producerShare)
      : 0;
  const productionSurplus = beforeVenueCosts - venueCosts;

  return {
    venue: venue.venue,
    grossBoxOffice,
    vatAndCardFees,
    netBoxOffice,
    royalties,
    venueCosts,
    productionSurplus,
  };
}

export function calculateCommercialScenario(capacity: number) {
  const venueScenarios = spreadsheetFinancialVenues.map((venue) =>
    calculateVenueScenario(venue, capacity),
  );
  const sum = (key: keyof (typeof venueScenarios)[number]) =>
    venueScenarios.reduce(
      (total, venue) =>
        total + (typeof venue[key] === "number" ? venue[key] : 0),
      0,
    );
  const grossBoxOffice = sum("grossBoxOffice");
  const vatAndCardFees = sum("vatAndCardFees");
  const netBoxOffice = sum("netBoxOffice");
  const royalties = sum("royalties");
  const venueCosts = sum("venueCosts");
  const productionSurplus = sum("productionSurplus");
  const operatingProfit = productionSurplus - totalRunningCosts;
  const totalAvailableForInvestors =
    operatingProfit + estimatedTheatreTaxRelief;
  const lessCapitalization = -capitalRequirement;
  const postRecoupmentProfit =
    totalAvailableForInvestors + lessCapitalization;
  const unrecoupedCapital = Math.max(-postRecoupmentProfit, 0);
  const investorProfitPool =
    Math.max(postRecoupmentProfit, 0) * investorPostRecoupmentShare;
  const investorReturnPool =
    Math.min(Math.max(totalAvailableForInvestors, 0), capitalRequirement) +
    investorProfitPool;

  return {
    capacity,
    venueScenarios,
    grossBoxOffice,
    vatAndCardFees,
    netBoxOffice,
    royalties,
    venueCosts,
    productionSurplus,
    totalRunningCosts,
    totalMerchandiseContribution,
    operatingProfit,
    estimatedTheatreTaxRelief,
    totalAvailableForInvestors,
    lessCapitalization,
    postRecoupmentProfit,
    unrecoupedCapital,
    investorProfitPool,
    investorReturnPool,
  };
}

const zeroCapacityScenario = calculateCommercialScenario(0);
const fullCapacityScenario = calculateCommercialScenario(1);

export const productionBreakEvenCapacity =
  -zeroCapacityScenario.postRecoupmentProfit /
  (fullCapacityScenario.postRecoupmentProfit -
    zeroCapacityScenario.postRecoupmentProfit);
export const productionBreakEvenPercentage = `${Math.round(
  productionBreakEvenCapacity * 100,
)}%`;

export const targetBreakEvenCapacity = productionBreakEvenCapacity;
export const targetBreakEvenPercentage = productionBreakEvenPercentage;

export const capacityScenarios = [
  { capacity: 1, label: "100%", accent: "gold" },
  { capacity: 0.9, label: "90%", accent: "gold" },
  { capacity: 0.8, label: "80%", accent: "gold" },
  {
    capacity: productionBreakEvenCapacity,
    label: productionBreakEvenPercentage,
    accent: "green",
  },
  { capacity: 0.5, label: "50%", accent: "downside" },
] as const;

export const commercialScenarios = capacityScenarios.map((scenario) => ({
  ...scenario,
  ...calculateCommercialScenario(scenario.capacity),
}));

export const targetScenario = calculateCommercialScenario(
  targetBreakEvenCapacity,
);

export const calculatorScenarios = commercialScenarios;

export function calculateInvestorProjection(
  investment: number,
  scenario: Pick<
    ReturnType<typeof calculateCommercialScenario>,
    "totalAvailableForInvestors" | "investorProfitPool"
  >,
) {
  const units = investment / unitPrice;
  const recoupmentShare = investment / capitalRequirement;
  const postRecoupmentShare = units / fullySubscribedUnits;
  const capitalReturned =
    Math.min(
      Math.max(scenario.totalAvailableForInvestors, 0),
      capitalRequirement,
    ) * recoupmentShare;
  const investorProfit = scenario.investorProfitPool * postRecoupmentShare;
  const projectedTotalReturn = capitalReturned + investorProfit;
  const projectedProfit = projectedTotalReturn - investment;
  const percentReturn =
    investment > 0 ? (projectedProfit / investment) * 100 : 0;

  return {
    units,
    investorShare: recoupmentShare,
    recoupmentShare,
    postRecoupmentShare,
    projectedTotalReturn,
    projectedProfit,
    capitalReturned,
    investorProfit,
    capitalUnrecouped: Math.max(investment - capitalReturned, 0),
    percentReturn,
  };
}

export const formatGbp = (value: number) => {
  const roundedValue = Math.round(value / 1_000) * 1_000;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Object.is(roundedValue, -0) ? 0 : roundedValue);
};
