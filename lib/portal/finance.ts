import {
  DEFAULT_SETTINGS,
  DEFAULT_THEATRE_TERMS,
  CREDIT_CARD_FEE_RATE,
  CURRENT_TSWL_UNIT_PRICE,
  normalizeSettings,
  normalizeTheatreTerms,
  TSWL_UNIT_SIZE,
  PRODUCER_PROFIT_RATE,
  REPORTING_ENGAGEMENT_COSTS,
  ROYALTY_RATE,
  THEATRES,
  VAT_DIVISOR,
} from "./constants";
import type {
  BoxOfficeEntry,
  FinancialSummary,
  Investor,
  InvestmentCurrency,
  PortalSettings,
  StatementSnapshot,
  TheatreCalculationBreakdown,
  TheatreTerms,
  TheatreKey,
  Theatre,
} from "./types";

export function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function currencyMoney(
  value: number,
  currency: InvestmentCurrency = "GBP",
) {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function signedCurrencyMoney(
  value: number | null | undefined,
  currency: InvestmentCurrency = "GBP",
) {
  if (value === null || value === undefined) return "—";
  if (value > 0) return `+${currencyMoney(value, currency)}`;
  return currencyMoney(value, currency);
}

export function investorCurrency(investor: Investor): InvestmentCurrency {
  return investor.investmentCurrency === "USD" ? "USD" : "GBP";
}

export function investorGbpBasis(investor: Investor) {
  return Number(investor.originalInvestmentGBP ?? investor.originalInvestment);
}

export function investorOriginalAmount(investor: Investor) {
  return Number(
    investor.originalInvestmentAmount ?? investor.originalInvestment,
  );
}

export function investorReportingValue(
  gbpValue: number,
  investor: Investor,
  gbpUsdExchangeRate: number,
) {
  return investorCurrency(investor) === "USD"
    ? gbpValue * gbpUsdExchangeRate
    : gbpValue;
}

export function percentage(value: number, digits = 2) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function participationFor(
  investment: number,
  capitalization = DEFAULT_SETTINGS.totalCapitalization,
) {
  return capitalization > 0 ? investment / capitalization : 0;
}

export function tswlUnitsFor(investment: number) {
  return Number(investment || 0) / TSWL_UNIT_SIZE;
}

export function formatTswlUnits(investment: number) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 2,
  }).format(tswlUnitsFor(investment));
}

export function investorValuation(
  investment: number,
  currentUnitPrice = CURRENT_TSWL_UNIT_PRICE,
) {
  return tswlUnitsFor(investment) * currentUnitPrice;
}

export function signedMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value > 0) return `+${money(value)}`;
  return money(value);
}

export function maskAccountNumber(accountNumber: string) {
  const suffix = accountNumber.slice(-4);
  const prefix = accountNumber.slice(0, Math.max(0, accountNumber.length - 6));
  return `${prefix}••${suffix}`;
}

export function calculateTheatreNet(
  gross: number,
  theatreId: TheatreKey,
  termsByTheatre: Record<TheatreKey, TheatreTerms>,
) {
  return calculateTheatreBreakdown(gross, theatreId, termsByTheatre)
    .productionResult;
}

/**
 * Applies the same documented engagement-wide calculation everywhere:
 * refunds → VAT removal → card fees → royalties → theatre deal → other
 * approved deductions → producer profit. Fixed rent is applied once to the
 * saved cumulative engagement gross, never per week or performance.
 */
export function calculateTheatreBreakdown(
  gross: number,
  theatreId: TheatreKey,
  termsByTheatre: Record<TheatreKey, TheatreTerms>,
): TheatreCalculationBreakdown {
  const terms = termsByTheatre[theatreId];
  const grossBoxOffice = Math.max(0, Number(gross || 0));
  const refunds = Math.max(0, Number(terms?.refunds || 0));
  const grossLessRefunds = Math.max(0, grossBoxOffice - refunds);
  const netOfVat = grossLessRefunds / VAT_DIVISOR;
  const creditCardFees = grossLessRefunds * CREDIT_CARD_FEE_RATE;
  const afterCardFees = netOfVat - creditCardFees;
  const royalties = afterCardFees * ROYALTY_RATE;
  const beforeTheatreDeal = afterCardFees - royalties;
  const otherApprovedDeductions = Math.max(
    0,
    Number(terms?.otherApprovedDeductions || 0),
  );
  const engagementOperatingCost = REPORTING_ENGAGEMENT_COSTS[theatreId];

  if (!terms?.configured || terms.calculationMethod === "custom") {
    const productionResult =
      grossBoxOffice === 0 && engagementOperatingCost > 0
        ? -engagementOperatingCost
        : null;
    return {
      grossBoxOffice,
      refunds,
      grossLessRefunds,
      netOfVat,
      creditCardFees,
      royalties,
      theatreDealDeduction: null,
      otherApprovedDeductions,
      productionResult,
      producerProfit: null,
    };
  }

  let afterTheatreDeal = beforeTheatreDeal;
  if (terms.calculationMethod === "fixedRent") {
    afterTheatreDeal -= terms.fixedRent;
  } else if (terms.calculationMethod === "boxOfficeSplit") {
    afterTheatreDeal *= terms.productionShare / 100;
    if (terms.theatreDeductionType === "fixed") {
      afterTheatreDeal -= terms.theatreDeductionAmount;
    } else {
      afterTheatreDeal *= 1 - terms.theatreDeductionRate / 100;
    }
  } else if (terms.theatreDeductionType === "fixed") {
    afterTheatreDeal -= terms.theatreDeductionAmount;
  } else {
    afterTheatreDeal *= 1 - terms.theatreDeductionRate / 100;
  }

  const theatreDealDeduction = beforeTheatreDeal - afterTheatreDeal;
  const productionResult =
    afterTheatreDeal -
    otherApprovedDeductions -
    engagementOperatingCost;
  const producerProfit =
    productionResult > 0 ? productionResult * PRODUCER_PROFIT_RATE : null;

  return {
    grossBoxOffice,
    refunds,
    grossLessRefunds,
    netOfVat,
    creditCardFees,
    royalties,
    theatreDealDeduction,
    otherApprovedDeductions,
    productionResult,
    producerProfit,
  };
}

export function describeTheatreDeal(terms: TheatreTerms) {
  if (!terms.configured || terms.calculationMethod === "custom") {
    return "Not yet configured";
  }
  if (terms.calculationMethod === "fixedRent") {
    if (terms.fixedRent === 0) {
      return "100% box office; venue cost included in all-in engagement cost";
    }
    return `100% box office less ${money(terms.fixedRent)} fixed rent`;
  }
  if (terms.calculationMethod === "boxOfficeSplit") {
    return `${terms.productionShare}% production / ${terms.theatreShare}% theatre`;
  }
  return terms.theatreDeductionType === "fixed"
    ? `${money(terms.theatreDeductionAmount)} theatre deduction`
    : `${terms.theatreDeductionRate}% theatre deduction`;
}

export function calculateFinancialSummary(
  entries: BoxOfficeEntry[],
  settings: PortalSettings,
): FinancialSummary {
  const totalGross = entries.reduce((sum, entry) => sum + entry.grossBoxOffice, 0);
  const totalNet = entries.reduce((sum, entry) => sum + entry.netBoxOffice, 0);
  const availableForRecoupment = Math.max(0, totalNet);
  const totalCapitalRecouped = Math.min(
    settings.totalCapitalization,
    availableForRecoupment,
  );
  return {
    totalGross,
    totalNet,
    totalDeductions: Math.max(0, totalGross - totalNet),
    availableForRecoupment,
    totalCapitalRecouped,
  };
}

export function entriesForCalculation(
  entries: BoxOfficeEntry[],
  theatres: Theatre[],
  theatreTerms: Record<TheatreKey, TheatreTerms>,
) {
  return theatres.map<BoxOfficeEntry>((theatre) => {
    const historicalGross = entries
      .filter((entry) => entry.theatreId === theatre.id)
      .reduce((sum, entry) => sum + entry.grossBoxOffice, 0);
    const grossBoxOffice = theatre.cumulativeGross ?? historicalGross;
    return {
      id: `cumulative-${theatre.id}`,
      theatreId: theatre.id,
      performanceNumber: 0,
      grossBoxOffice,
      netBoxOffice:
        calculateTheatreNet(
          grossBoxOffice,
          theatre.id,
          theatreTerms,
        ) ?? 0,
      createdAt: "",
      updatedAt: "",
    };
  });
}

export function calculateInvestor(
  investor: Investor,
  summary: FinancialSummary,
  currentUnitPrice = CURRENT_TSWL_UNIT_PRICE,
) {
  const originalInvestmentGBP = investorGbpBasis(investor);
  const participationPercentage = participationFor(originalInvestmentGBP);
  const capitalRecouped = Math.min(
    originalInvestmentGBP,
    summary.totalCapitalRecouped * participationPercentage,
  );
  const capitalRemaining = Math.max(
    0,
    originalInvestmentGBP - capitalRecouped,
  );
  return {
    uid: investor.uid,
    fullName: investor.fullName,
    address: investor.address,
    addressLine1: investor.addressLine1,
    addressLine2: investor.addressLine2,
    city: investor.city,
    region: investor.region,
    postalCode: investor.postalCode,
    country: investor.country,
    email: investor.email,
    authenticationUid: investor.authenticationUid,
    activatedAt: investor.activatedAt,
    loginStatus: investor.loginStatus,
    invitationSentAt: investor.invitationSentAt,
    telephone: investor.telephone,
    accountNumber: investor.accountNumber,
    investmentCurrency: investorCurrency(investor),
    originalInvestmentAmount: investorOriginalAmount(investor),
    originalInvestmentGBP,
    investmentExchangeRate:
      investor.investmentExchangeRate ??
      (investorCurrency(investor) === "USD" && originalInvestmentGBP > 0
        ? investorOriginalAmount(investor) / originalInvestmentGBP
        : 1),
    originalInvestment: originalInvestmentGBP,
    participationPercentage,
    capitalRecouped,
    recoveryPercentage:
      originalInvestmentGBP > 0
        ? capitalRecouped / originalInvestmentGBP
        : 0,
    capitalRemaining,
    currentStatementValue: investorValuation(
      originalInvestmentGBP,
      currentUnitPrice,
    ),
    investorStatus: investor.investorStatus,
    administrativeNote: investor.administrativeNote,
    isTest: investor.isTest,
    subscriptionDate: investor.subscriptionDate,
    lastLoginAt: investor.lastLoginAt,
    createdAt: investor.createdAt,
    updatedAt: investor.updatedAt,
    valuationBasis:
      "Calculated from TSWL Units held multiplied by the current TSWL Unit price.",
  };
}

export function createStatementSnapshot(
  investor: Investor,
  entries: BoxOfficeEntry[],
  settings: PortalSettings = DEFAULT_SETTINGS,
  theatreTerms: Record<TheatreKey, TheatreTerms> = DEFAULT_THEATRE_TERMS,
): StatementSnapshot {
  const financialSummary = calculateFinancialSummary(entries, settings);
  const calculatedInvestor = calculateInvestor(
    investor,
    financialSummary,
    settings.currentUnitPrice,
  );
  const theatres = THEATRES.map((theatre) => {
    const theatreEntries = entries.filter(
      (entry) => entry.theatreId === theatre.id,
    );
    return {
      ...theatre,
      actual:
        theatre.cumulativeGross ??
        theatreEntries.reduce((sum, entry) => sum + entry.grossBoxOffice, 0),
      net: theatreEntries.reduce((sum, entry) => sum + entry.netBoxOffice, 0),
      entered: theatreEntries.length,
    };
  });
  return {
    investorUid: investor.uid,
    statementDate: new Date().toISOString(),
    investor: calculatedInvestor,
    theatres,
    financialSummary,
    settings,
    theatreTerms,
    valuationBasis: calculatedInvestor.valuationBasis!,
    issued: false,
  };
}

export function normalizeStatementSnapshot(
  statement: StatementSnapshot,
): StatementSnapshot {
  const settings = normalizeSettings(statement.settings);
  const theatreTerms = Object.fromEntries(
    THEATRES.map((theatre) => [
      theatre.id,
      normalizeTheatreTerms(
        theatre.id,
        statement.theatreTerms?.[theatre.id] ?? {},
      ),
    ]),
  ) as Record<TheatreKey, TheatreTerms>;
  const theatres = statement.theatres.map((theatre) => {
    const canonical = THEATRES.find((item) => item.id === theatre.id);
    return {
      ...theatre,
      performances: theatre.performances ?? canonical?.performances ?? 0,
      potential: canonical?.potential ?? theatre.potential,
      net:
        calculateTheatreNet(theatre.actual, theatre.id, theatreTerms) ?? 0,
    };
  });
  const financialSummary = calculateFinancialSummary(
    theatres.map((theatre) => ({
      id: `statement-${theatre.id}`,
      theatreId: theatre.id,
      performanceNumber: 0,
      grossBoxOffice: theatre.actual,
      netBoxOffice: theatre.net,
      createdAt: "",
      updatedAt: "",
    })),
    settings,
  );
  return {
    ...statement,
    theatres,
    financialSummary,
    settings,
    theatreTerms,
    investor: calculateInvestor(
      statement.investor,
      financialSummary,
      settings.currentUnitPrice,
    ),
  };
}

export function theatreTotals(
  entries: BoxOfficeEntry[],
  theatreId: TheatreKey,
) {
  const relevant = entries.filter((entry) => entry.theatreId === theatreId);
  const gross = relevant.reduce((sum, entry) => sum + entry.grossBoxOffice, 0);
  const net = relevant.reduce((sum, entry) => sum + entry.netBoxOffice, 0);
  return { entered: relevant.length, gross, net, deductions: gross - net };
}
