export type InvestorStatus = "Active" | "Pending" | "Closed" | "Test";
export type InvestorLoginStatus = "Not Invited" | "Invited" | "Active";
export type InvestmentCurrency = "GBP" | "USD";

export type Investor = {
  uid: string;
  fullName: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  email: string;
  authenticationUid?: string;
  activatedAt?: string;
  loginStatus?: InvestorLoginStatus;
  invitationSentAt?: string;
  telephone?: string;
  accountNumber: string;
  investmentCurrency?: InvestmentCurrency;
  originalInvestmentAmount?: number;
  originalInvestmentGBP?: number;
  investmentExchangeRate?: number;
  originalInvestment: number;
  participationPercentage: number;
  capitalRecouped: number;
  recoveryPercentage: number;
  capitalRemaining: number;
  currentStatementValue: number;
  investorStatus: InvestorStatus;
  valuationBasis?: string;
  administrativeNote?: string;
  isTest?: boolean;
  subscriptionDate: string;
  lastLoginAt?: string;
  lastStatementSentAt?: string;
  lastStatementEmailStatus?: string;
  createdAt: string;
  updatedAt: string;
};

export type TheatreKey = "leeds" | "hull" | "london";

export type TheatreCalculationMethod =
  | "fixedRent"
  | "boxOfficeSplit"
  | "theatreDeduction"
  | "custom";

export type TheatreTerms = {
  theatre: TheatreKey;
  calculationMethod: TheatreCalculationMethod;
  fixedRent: number;
  productionShare: number;
  theatreShare: number;
  refunds: number;
  theatreDeductionType: "fixed" | "percentage";
  theatreDeductionRate: number;
  theatreDeductionAmount: number;
  otherApprovedDeductions: number;
  otherDeductionNote: string;
  calculationOrder: string[];
  configured: boolean;
  updatedAt?: string;
};

export type TheatreCalculationBreakdown = {
  grossBoxOffice: number;
  refunds: number;
  grossLessRefunds: number;
  netOfVat: number;
  creditCardFees: number;
  royalties: number;
  theatreDealDeduction: number | null;
  otherApprovedDeductions: number;
  productionResult: number | null;
  producerProfit: number | null;
};

export type PortalSettings = {
  totalCapitalization: number;
  weeklyOperatingCosts: number;
  currentUnitPrice: number;
  gbpUsdExchangeRate: number;
  exchangeRateUpdatedAt?: string;
  recoupmentPriority: string;
  executiveUpdate?: string;
  executiveUpdateUpdatedAt?: string;
  updatedAt?: string;
};

export type Theatre = {
  id: TheatreKey;
  name: string;
  performances: number;
  potential: number;
  cumulativeGross?: number;
  cumulativeNet?: number | null;
  previousGross?: number | null;
  weeklyChange?: number | null;
  updatedAt?: string;
};

export type BoxOfficeEntry = {
  id: string;
  theatreId: TheatreKey;
  performanceNumber: number;
  performanceDate?: string;
  grossBoxOffice: number;
  refunds?: number;
  comps?: number;
  vat?: number;
  theatreDeduction?: number;
  royalties?: number;
  otherDeductions?: number;
  notes?: string;
  netBoxOffice: number;
  createdAt: string;
  updatedAt: string;
};

export type FinancialSummary = {
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  availableForRecoupment: number;
  totalCapitalRecouped: number;
};

export type DashboardSummary = {
  totalCapitalization: number;
  operationalCostPerWeek: number;
  totalInvested: number;
  capitalRemaining: number;
  totalGrossBoxOffice: number;
  totalNetBoxOffice: number;
  capitalRaisePercentage: number;
  updatedAt: string;
};

export type DashboardSheetResponse = {
  totalInvested: number;
  updatedAt: string;
};

export type DashboardBoxOfficeTotals = {
  totalGrossBoxOffice: number;
  totalNetBoxOffice: number;
};

export type DashboardData = {
  investors: Investor[];
  entries: BoxOfficeEntry[];
  settings: PortalSettings;
  theatres: Theatre[];
  theatreTerms: Record<TheatreKey, TheatreTerms>;
  financialSummary: FinancialSummary;
  statements: StatementSnapshot[];
  auditLog: AuditEntry[];
};

export type StatementSnapshot = {
  id?: string;
  investorUid: string;
  statementDate: string;
  investor: Investor;
  theatres: Array<Theatre & { actual: number; net: number; entered: number }>;
  financialSummary: FinancialSummary;
  settings: PortalSettings;
  theatreTerms: Record<TheatreKey, TheatreTerms>;
  valuationBasis: string;
  issued: boolean;
  privateNote?: string;
  recipientEmail?: string;
  emailDeliveryStatus?: "sent";
  emailedAt?: string;
  emailProviderMessageId?: string;
};

export type AuditEntry = {
  id: string;
  administratorUid: string;
  action: string;
  timestamp: string;
  recordAffected: string;
  previousValue: unknown;
  newValue: unknown;
};
