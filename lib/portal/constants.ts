import type {
  PortalSettings,
  Theatre,
  TheatreKey,
  TheatreTerms,
} from "./types";
import {
  capitalRequirement,
  creditCardFeeRate,
  hullProducerShare,
  hullVenueShare,
  leedsFixedRent,
  londonFixedRent,
  royaltyRate,
  vatDivisor,
  weeklyRunningCosts,
} from "../commercial-model";

// Fixed commercial assumptions. These are deliberately not administrator
// settings: every theatre calculation must use the same values and order.
export const VAT_DIVISOR = vatDivisor;
export const CREDIT_CARD_FEE_RATE = creditCardFeeRate;
export const ROYALTY_RATE = royaltyRate;
export const PRODUCER_PROFIT_RATE = 0.4;
export const TOTAL_CAPITALIZATION = capitalRequirement;
export const OPERATIONAL_COST_PER_WEEK = weeklyRunningCosts;

// Investor statements and administrator reporting use one engagement-cost
// basis per reported venue. Keep this separate from the commercial spreadsheet
// assumptions used by the break-even model.
export const REPORTING_ENGAGEMENT_COSTS: Record<TheatreKey, number> = {
  // Three-week engagement at £105,000 per week, applied once.
  leeds: 315_000,
  hull: 105_000,
  london: 105_000,
};

// TSWL unit pricing is defined once for every investor statement. Updating the
// current price here revalues all statements without changing investor records.
export const TSWL_UNIT_SIZE = 1_000;
export const CURRENT_TSWL_UNIT_PRICE = 1_000;
export const DEFAULT_GBP_USD_EXCHANGE_RATE = 1.35;

export const DEFAULT_SETTINGS: PortalSettings = {
  totalCapitalization: TOTAL_CAPITALIZATION,
  weeklyOperatingCosts: OPERATIONAL_COST_PER_WEEK,
  currentUnitPrice: CURRENT_TSWL_UNIT_PRICE,
  gbpUsdExchangeRate: DEFAULT_GBP_USD_EXCHANGE_RATE,
  recoupmentPriority:
    "Return approved costs, then investor capital, then split profit",
};

export const THEATRES: Theatre[] = [
  { id: "leeds", name: "Leeds", performances: 20, potential: 1_460_000 },
  { id: "hull", name: "Hull", performances: 8, potential: 260_000 },
  { id: "london", name: "London", performances: 14, potential: 550_000 },
];

const STANDARD_ORDER = [
  "Gross box office",
  "Refunds",
  "Remove VAT at 20%",
  "Credit-card and ticket commissions at 5% of gross",
  "Royalties at 16%",
];

const commonTerms = {
  refunds: 0,
  theatreDeductionType: "fixed" as const,
  theatreDeductionRate: 0,
  theatreDeductionAmount: 0,
  otherApprovedDeductions: 0,
  otherDeductionNote: "",
};

export const DEFAULT_THEATRE_TERMS: Record<TheatreKey, TheatreTerms> = {
  leeds: {
    theatre: "leeds",
    calculationMethod: "fixedRent",
    fixedRent: leedsFixedRent,
    productionShare: 100,
    theatreShare: 0,
    ...commonTerms,
    calculationOrder: [
      ...STANDARD_ORDER,
      `${REPORTING_ENGAGEMENT_COSTS.leeds.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })} all-in engagement cost`,
      "Other approved deductions",
      "Producer profit at 40%",
    ],
    configured: true,
  },
  hull: {
    theatre: "hull",
    calculationMethod: "boxOfficeSplit",
    fixedRent: 0,
    productionShare: hullProducerShare * 100,
    theatreShare: hullVenueShare * 100,
    ...commonTerms,
    calculationOrder: [
      ...STANDARD_ORDER,
      `${hullProducerShare * 100}% production box-office share`,
      `${REPORTING_ENGAGEMENT_COSTS.hull.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })} all-in engagement cost`,
      "Additional theatre deduction, if configured",
      "Other approved deductions",
      "Producer profit at 40%",
    ],
    configured: true,
  },
  london: {
    theatre: "london",
    calculationMethod: "fixedRent",
    fixedRent: londonFixedRent,
    productionShare: 100,
    theatreShare: 0,
    ...commonTerms,
    calculationOrder: [
      ...STANDARD_ORDER,
      `${REPORTING_ENGAGEMENT_COSTS.london.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })} all-in engagement cost`,
      "Other approved deductions",
      "Producer profit at 40%",
    ],
    configured: true,
  },
};

export function normalizeSettings(
  data: Partial<PortalSettings> = {},
): PortalSettings {
  return {
    totalCapitalization: TOTAL_CAPITALIZATION,
    weeklyOperatingCosts: OPERATIONAL_COST_PER_WEEK,
    currentUnitPrice:
      data.currentUnitPrice ?? DEFAULT_SETTINGS.currentUnitPrice,
    gbpUsdExchangeRate: Number(
      data.gbpUsdExchangeRate ?? DEFAULT_SETTINGS.gbpUsdExchangeRate,
    ),
    exchangeRateUpdatedAt: data.exchangeRateUpdatedAt,
    recoupmentPriority:
      data.recoupmentPriority ?? DEFAULT_SETTINGS.recoupmentPriority,
    executiveUpdate: data.executiveUpdate ?? "",
    executiveUpdateUpdatedAt: data.executiveUpdateUpdatedAt,
    updatedAt: data.updatedAt,
  };
}

export function normalizeTheatreTerms(
  theatre: TheatreKey,
  data: Partial<TheatreTerms> = {},
): TheatreTerms {
  const defaults = DEFAULT_THEATRE_TERMS[theatre];
  const calculationMethod =
    theatre === "leeds" || theatre === "london"
      ? "fixedRent"
      : "boxOfficeSplit";
  const otherDeductionNote =
    data.otherDeductionNote ?? defaults.otherDeductionNote;
  const savedOtherApprovedDeductions = Number(
    data.otherApprovedDeductions ?? defaults.otherApprovedDeductions,
  );
  const legacyLeedsCostNote =
    /rent|rental|venue|weekly|engagement|all.?in|pre.?production|operating cost/i.test(
      otherDeductionNote,
    );
  const legacyLeedsCostAmount = [
    105_000,
    165_000,
    210_000,
    250_000,
    315_000,
  ].includes(savedOtherApprovedDeductions);
  const otherApprovedDeductions =
    theatre === "leeds" && (legacyLeedsCostNote || legacyLeedsCostAmount)
      ? 0
      : savedOtherApprovedDeductions;
  return {
    theatre,
    calculationMethod,
    fixedRent:
      theatre === "leeds" || theatre === "london"
        ? theatre === "leeds"
          ? leedsFixedRent
          : londonFixedRent
        : calculationMethod === "fixedRent"
          ? Number(data.fixedRent ?? defaults.fixedRent)
          : 0,
    productionShare:
      theatre === "leeds" || theatre === "london"
        ? 100
        : theatre === "hull"
          ? hullProducerShare * 100
          : Number(data.productionShare ?? defaults.productionShare),
    theatreShare:
      theatre === "hull"
        ? hullVenueShare * 100
        : 0,
    refunds: Number(data.refunds ?? defaults.refunds),
    theatreDeductionType:
      data.theatreDeductionType === "percentage" ? "percentage" : "fixed",
    theatreDeductionRate: Number(
      data.theatreDeductionRate ?? defaults.theatreDeductionRate,
    ),
    theatreDeductionAmount: Number(
      data.theatreDeductionAmount ?? defaults.theatreDeductionAmount,
    ),
    otherApprovedDeductions,
    otherDeductionNote,
    calculationOrder:
      theatre === "london"
        ? defaults.calculationOrder
        : data.calculationOrder ?? defaults.calculationOrder,
    configured: true,
    updatedAt: data.updatedAt,
  };
}
