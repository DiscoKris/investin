"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { requireActiveAdminUser } from "./admin-auth-client";
import {
  DEFAULT_SETTINGS,
  DEFAULT_THEATRE_TERMS,
  THEATRES,
  normalizeTheatreTerms,
} from "./constants";
import {
  getFirebaseAuth,
  getFirebaseDb,
} from "./firebase-client";
import {
  calculateFinancialSummary,
  calculateInvestor,
  calculateTheatreNet,
  entriesForCalculation,
  participationFor,
} from "./finance";
import {
  addAudit,
  getAuditLog,
  getEntries,
  getInvestor,
  getInvestors,
  getSettings,
  getStatementHistory,
  getTheatres,
  getTheatreTerms,
  issueStatement,
  nextAccountNumber,
  regenerateDraftStatements,
  updateInvestor,
  writeInvestor,
} from "./store";
import type {
  DashboardData,
  FinancialSummary,
  InvestmentCurrency,
  InvestorStatus,
  PortalSettings,
  TheatreCalculationMethod,
  TheatreKey,
  TheatreTerms,
} from "./types";

const theatreIds: TheatreKey[] = ["leeds", "hull", "london"];

export const EMPTY_ADMIN_DATA: DashboardData = {
  investors: [],
  entries: [],
  settings: DEFAULT_SETTINGS,
  theatres: THEATRES,
  theatreTerms: DEFAULT_THEATRE_TERMS,
  financialSummary: {
    totalGross: 0,
    totalNet: 0,
    totalDeductions: 0,
    availableForRecoupment: 0,
    totalCapitalRecouped: 0,
  },
  statements: [],
  auditLog: [],
};

async function adminContext() {
  const user = await requireActiveAdminUser();
  return { user, db: getFirebaseDb() };
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function positiveNumber(value: unknown, label: string) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
  return number;
}

function nonnegativeNumber(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function nonnegativeWholeNumber(value: unknown, label: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${label} must be a whole number.`);
  }
  return number;
}

async function loadFinancialData() {
  const { db } = await adminContext();
  const results = await Promise.allSettled([
    getEntries(db),
    getSettings(db),
    getTheatres(db),
    getTheatreTerms(db),
  ]);
  const labels = ["box office", "settings", "theatres", "theatre settings"];
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Unable to load admin ${labels[index]}.`, result.reason);
    }
  });
  const loadWarnings = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [`Unable to load ${labels[index]}.`]
      : [],
  );
  const entries = results[0].status === "fulfilled" ? results[0].value : [];
  const settings =
    results[1].status === "fulfilled" ? results[1].value : DEFAULT_SETTINGS;
  const theatres =
    results[2].status === "fulfilled" ? results[2].value : THEATRES;
  const theatreTerms =
    results[3].status === "fulfilled"
      ? results[3].value
      : DEFAULT_THEATRE_TERMS;
  const calculatedEntries = entriesForCalculation(
    entries,
    theatres,
    theatreTerms,
  );
  const financialSummary = calculateFinancialSummary(
    calculatedEntries,
    settings,
  );
  return {
    entries,
    settings,
    theatres,
    theatreTerms,
    financialSummary,
    warnings: loadWarnings,
  };
}

async function loadInvestorsWithSummary(financialSummary: FinancialSummary) {
  const { db } = await adminContext();
  try {
    const investors = await getInvestors(db);
    return {
      investors: investors.map((investor) =>
        calculateInvestor(investor, financialSummary),
      ),
      warnings: [] as string[],
    };
  } catch (error) {
    console.error("Unable to load admin investors.", error);
    return { investors: [], warnings: ["Unable to load investors."] };
  }
}

export async function loadInvestorsSection() {
  const financial = await loadFinancialData();
  const investors = await loadInvestorsWithSummary(
    financial.financialSummary,
  );
  return {
    data: { ...financial, investors: investors.investors },
    warnings: [...financial.warnings, ...investors.warnings],
  };
}

export async function loadBoxOfficeSection() {
  const financial = await loadFinancialData();
  return { data: financial, warnings: financial.warnings };
}

export async function loadStatementsSection() {
  const financial = await loadFinancialData();
  const { db } = await adminContext();
  const [investors, statements] = await Promise.all([
    loadInvestorsWithSummary(financial.financialSummary),
    getStatementHistory(db)
      .then((value) => ({ value, warnings: [] as string[] }))
      .catch((error) => {
        console.error("Unable to load admin statements.", error);
        return { value: [], warnings: ["Unable to load statements."] };
      }),
  ]);
  return {
    data: {
      ...financial,
      investors: investors.investors,
      statements: statements.value,
    },
    warnings: [
      ...financial.warnings,
      ...investors.warnings,
      ...statements.warnings,
    ],
  };
}

export async function loadReportsSection() {
  return loadInvestorsSection();
}

export async function loadSettingsSection() {
  const { db } = await adminContext();
  const [settings, theatreTerms, theatres] = await Promise.allSettled([
    getSettings(db),
    getTheatreTerms(db),
    getTheatres(db),
  ]);
  const warnings: string[] = [];
  if (settings.status === "rejected") {
    console.error("Unable to load admin settings.", settings.reason);
    warnings.push("Unable to load settings.");
  }
  if (theatreTerms.status === "rejected") {
    console.error(
      "Unable to load admin theatre settings.",
      theatreTerms.reason,
    );
    warnings.push("Unable to load theatre settings.");
  }
  if (theatres.status === "rejected") {
    console.error("Unable to load admin theatres.", theatres.reason);
    warnings.push("Unable to load theatres.");
  }
  return {
    data: {
      settings:
        settings.status === "fulfilled" ? settings.value : DEFAULT_SETTINGS,
      theatreTerms:
        theatreTerms.status === "fulfilled"
          ? theatreTerms.value
          : DEFAULT_THEATRE_TERMS,
      theatres: theatres.status === "fulfilled" ? theatres.value : THEATRES,
    },
    warnings,
  };
}

export async function loadAuditSection() {
  const { db } = await adminContext();
  try {
    return { data: { auditLog: await getAuditLog(db) }, warnings: [] };
  } catch (error) {
    console.error("Unable to load administrator audit log.", error);
    return {
      data: { auditLog: [] },
      warnings: ["Unable to load audit log."],
    };
  }
}

export async function saveBoxOffice(
  grossTotals: Record<TheatreKey, number>,
  adjustments: Record<
    TheatreKey,
    { refunds: number; otherApprovedDeductions: number }
  >,
) {
  const { user, db } = await adminContext();
  const theatreTerms = await getTheatreTerms(db);
  const updatedTerms = Object.fromEntries(
    theatreIds.map((id) => [
      id,
      {
        ...theatreTerms[id],
        refunds: nonnegativeNumber(adjustments[id].refunds),
        otherApprovedDeductions: nonnegativeNumber(
          adjustments[id].otherApprovedDeductions,
        ),
      },
    ]),
  ) as Record<TheatreKey, TheatreTerms>;
  const references = theatreIds.map((id) => doc(db, "theatres", id));
  const previousSnapshots = await Promise.all(references.map(getDoc));
  const previous = Object.fromEntries(
    previousSnapshots.map((snapshot, index) => [
      theatreIds[index],
      snapshot.data() ?? null,
    ]),
  );
  const next = Object.fromEntries(
    theatreIds.map((id, index) => {
      const cumulativeGross = nonnegativeNumber(grossTotals[id]);
      const priorGross = previousSnapshots[index].data()?.cumulativeGross;
      const hasPreviousGross =
        typeof priorGross === "number" && Number.isFinite(priorGross);
      return [
        id,
        {
          id,
          cumulativeGross,
          previousGross: hasPreviousGross ? priorGross : null,
          weeklyChange: hasPreviousGross
            ? cumulativeGross - priorGross
            : null,
          cumulativeNet: calculateTheatreNet(
            cumulativeGross,
            id,
            updatedTerms,
          ),
        },
      ];
    }),
  );
  const batch = writeBatch(db);
  theatreIds.forEach((id, index) => {
    batch.set(
      references[index],
      { ...next[id], updatedAt: serverTimestamp() },
      { merge: true },
    );
    batch.set(
      doc(db, "theatreTerms", id),
      {
        refunds: updatedTerms[id].refunds,
        otherApprovedDeductions:
          updatedTerms[id].otherApprovedDeductions,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
  await regenerateDraftStatements(db);
  await addAudit(
    db,
    user.uid,
    "Box-office totals updated",
    "theatres",
    previous,
    next,
  );
}

type InvestorForm = Record<string, FormDataEntryValue>;

export async function createInvestor(values: InvestorForm) {
  const { user, db } = await adminContext();
  const fullName = text(values.fullName);
  const address = String(values.address ?? "");
  const email = text(values.email).toLowerCase();
  const originalInvestmentAmount = positiveNumber(
    values.originalInvestment,
    "Amount invested",
  );
  const investmentCurrency: InvestmentCurrency =
    text(values.investmentCurrency) === "USD" ? "USD" : "GBP";
  const settings = await getSettings(db);
  const investmentExchangeRate =
    investmentCurrency === "USD" ? settings.gbpUsdExchangeRate : 1;
  const originalInvestmentGBP =
    investmentCurrency === "USD"
      ? originalInvestmentAmount / investmentExchangeRate
      : originalInvestmentAmount;
  if (fullName.length < 2 || !address.trim() || !email) {
    throw new Error("Please complete all required investor fields.");
  }

  const investorUid = doc(collection(db, "investors")).id;
  try {
    const accountNumber = await nextAccountNumber(db);
    const now = new Date().toISOString();
    const investor = {
      fullName,
      address,
      email,
      loginStatus: "Not Invited" as const,
      telephone: text(values.telephone),
      investmentCurrency,
      originalInvestmentAmount,
      originalInvestmentGBP,
      investmentExchangeRate,
      originalInvestment: originalInvestmentGBP,
      administrativeNote: text(values.administrativeNote),
      accountNumber,
      participationPercentage: participationFor(originalInvestmentGBP),
      currentStatementValue: originalInvestmentGBP,
      investorStatus: "Pending" as const,
      valuationBasis: "Held at Original Subscription Amount",
      isTest: false,
      subscriptionDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    await writeInvestor(
      db,
      investorUid,
      {
        ...investor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      true,
    );
    await issueStatement(db, investorUid, false);
    await addAudit(
      db,
      user.uid,
      "Investor created",
      `investors/${investorUid}`,
      null,
      investor,
    );
    return { investor: { uid: investorUid, ...investor } };
  } catch (error) {
    await deleteDoc(doc(db, "investors", investorUid)).catch(() => undefined);
    throw error;
  }
}

export async function editInvestor(uid: string, values: InvestorForm) {
  const { user, db } = await adminContext();
  const previous = await getInvestor(db, uid);
  if (!previous) throw new Error("Investor not found.");
  const originalInvestmentAmount = positiveNumber(
    values.originalInvestment,
    "Amount invested",
  );
  const investmentCurrency: InvestmentCurrency =
    text(values.investmentCurrency) === "USD" ? "USD" : "GBP";
  const investmentExchangeRate =
    investmentCurrency === "USD"
      ? positiveNumber(values.investmentExchangeRate, "Investment exchange rate")
      : 1;
  const originalInvestmentGBP =
    investmentCurrency === "USD"
      ? originalInvestmentAmount / investmentExchangeRate
      : originalInvestmentAmount;
  const fullName = text(values.fullName);
  const address = String(values.address ?? "");
  if (fullName.length < 2 || !address.trim()) {
    throw new Error("Please complete all required investor fields.");
  }
  const investorStatus = text(values.investorStatus) as InvestorStatus;
  const update = {
    fullName,
    address,
    email: text(values.email).toLowerCase(),
    telephone: text(values.telephone),
    investmentCurrency,
    originalInvestmentAmount,
    originalInvestmentGBP,
    investmentExchangeRate,
    originalInvestment: originalInvestmentGBP,
    investorStatus,
    administrativeNote: text(values.administrativeNote),
    participationPercentage: participationFor(originalInvestmentGBP),
    isTest: investorStatus === "Test",
    updatedAt: new Date().toISOString(),
  };
  await updateInvestor(db, uid, {
    ...update,
    addressLine1: deleteField(),
    addressLine2: deleteField(),
    city: deleteField(),
    region: deleteField(),
    postalCode: deleteField(),
    country: deleteField(),
    updatedAt: serverTimestamp(),
  });
  await regenerateDraftStatements(db);
  await addAudit(
    db,
    user.uid,
    previous.investmentCurrency !== investmentCurrency ||
      previous.investmentExchangeRate !== investmentExchangeRate
      ? "Investor currency or exchange rate changed"
      : investorStatus === "Closed"
      ? "Investor account disabled"
      : "Investor edited",
    `investors/${uid}`,
    previous,
    update,
  );
}

function validFirebaseUid(value: string) {
  return /^[A-Za-z0-9_-]{20,128}$/.test(value);
}

export async function linkInvestorAccount(
  investorUid: string,
  authenticationUidValue: string,
) {
  const { user, db } = await adminContext();
  const authenticationUid = text(authenticationUidValue);
  if (!validFirebaseUid(authenticationUid)) {
    throw new Error("Enter a valid Firebase Authentication UID.");
  }
  if (authenticationUid === investorUid) {
    const current = await getInvestor(db, investorUid);
    if (!current) throw new Error("Investor not found.");
    const batch = writeBatch(db);
    batch.update(doc(db, "investors", investorUid), {
      authenticationUid,
      activatedAt: current.activatedAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(collection(db, "adminAuditLog")), {
      administratorUid: user.uid,
      action: "Investor Authentication account linked",
      timestamp: serverTimestamp(),
      recordAffected: `investors/${investorUid}`,
      previousValue: {
        authenticationUid: current.authenticationUid ?? null,
      },
      newValue: { authenticationUid },
    });
    await batch.commit();
    return { authenticationUid };
  }

  const oldReference = doc(db, "investors", investorUid);
  const newReference = doc(db, "investors", authenticationUid);
  const [oldSnapshot, newSnapshot] = await Promise.all([
    getDoc(oldReference),
    getDoc(newReference),
  ]);
  if (!oldSnapshot.exists()) throw new Error("Investor not found.");
  if (
    newSnapshot.exists() &&
    newSnapshot.data().migratedFromUid !== investorUid
  ) {
    throw new Error(
      "An investor record already exists for that Authentication UID.",
    );
  }

  const oldData = oldSnapshot.data();
  if (!newSnapshot.exists()) {
    await setDoc(newReference, {
      ...oldData,
      authenticationUid,
      activatedAt: oldData.activatedAt ?? serverTimestamp(),
      migratedFromUid: investorUid,
      updatedAt: serverTimestamp(),
    });
  }

  const statements = await getDocs(
    query(
      collection(db, "statements"),
      where("investorUid", "==", investorUid),
    ),
  );
  for (let start = 0; start < statements.docs.length; start += 450) {
    const batch = writeBatch(db);
    statements.docs.slice(start, start + 450).forEach((statement) => {
      batch.update(statement.ref, {
        investorUid: authenticationUid,
        "investor.uid": authenticationUid,
        "investor.authenticationUid": authenticationUid,
      });
    });
    await batch.commit();
  }

  const oldDraftReference = doc(db, "statementDrafts", investorUid);
  const oldDraft = await getDoc(oldDraftReference);
  const finalBatch = writeBatch(db);
  if (oldDraft.exists()) {
    finalBatch.set(doc(db, "statementDrafts", authenticationUid), {
      ...oldDraft.data(),
      investorUid: authenticationUid,
      investor: {
        ...oldDraft.data().investor,
        uid: authenticationUid,
        authenticationUid,
      },
    });
    finalBatch.delete(oldDraftReference);
  }
  finalBatch.delete(oldReference);
  finalBatch.set(doc(collection(db, "adminAuditLog")), {
    administratorUid: user.uid,
    action: "Investor Authentication account linked",
    timestamp: serverTimestamp(),
    recordAffected: `investors/${authenticationUid}`,
    previousValue: { investorUid },
    newValue: {
      investorUid: authenticationUid,
      authenticationUid,
      accountNumber: oldData.accountNumber,
    },
  });
  await finalBatch.commit();
  return { authenticationUid };
}

export async function sendInvestorPasswordReset(investorUid: string) {
  const { user, db } = await adminContext();
  const investor = await getInvestor(db, investorUid);
  if (!investor) throw new Error("Investor not found.");
  if (!investor.authenticationUid) {
    throw new Error("Link the investor Authentication UID first.");
  }
  if (!investor.email) throw new Error("The investor email is missing.");

  await sendPasswordResetEmail(getFirebaseAuth(), investor.email, {
    url: `${window.location.origin}/login`,
  });
  await updateInvestor(db, investorUid, {
    loginStatus: "Invited",
    invitationSentAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await addAudit(
    db,
    user.uid,
    "Investor password reset email sent",
    `investors/${investorUid}`,
    { loginStatus: investor.loginStatus ?? "Not Invited" },
    { loginStatus: "Invited", email: investor.email },
  );
  return { email: investor.email };
}

export async function saveStatement(
  investorUid: string,
  issued: boolean,
  privateNote = "",
) {
  const { user, db } = await adminContext();
  if (!investorUid) throw new Error("Select an investor.");
  const statement = await issueStatement(
    db,
    investorUid,
    issued,
    privateNote,
  );
  await addAudit(
    db,
    user.uid,
    issued ? "Statement issued" : "Statement generated",
    `statements/${statement.id}`,
    null,
    { investorUid, statementDate: statement.statementDate },
  );
  return { statement };
}

export async function saveSettings(values: InvestorForm) {
  const { user, db } = await adminContext();
  const previous = await getSettings(db);
  const next: PortalSettings = {
    totalCapitalization: DEFAULT_SETTINGS.totalCapitalization,
    weeklyOperatingCosts: DEFAULT_SETTINGS.weeklyOperatingCosts,
    currentUnitPrice: positiveNumber(
      values.currentUnitPrice,
      "Current TSWL unit price",
    ),
    gbpUsdExchangeRate: previous.gbpUsdExchangeRate,
    exchangeRateUpdatedAt: previous.exchangeRateUpdatedAt,
    recoupmentPriority: text(values.recoupmentPriority),
    updatedAt: new Date().toISOString(),
  };
  if (next.recoupmentPriority.length < 3) {
    throw new Error("Enter a valid recoupment priority.");
  }
  await setDoc(
    doc(db, "production", "settings"),
    { ...next, updatedAt: serverTimestamp() },
    { merge: true },
  );
  await regenerateDraftStatements(db);
  const issuedStatements = await getDocs(collection(db, "statements"));
  for (let start = 0; start < issuedStatements.docs.length; start += 450) {
    const batch = writeBatch(db);
    issuedStatements.docs.slice(start, start + 450).forEach((statement) => {
      batch.set(
        statement.ref,
        {
          settings: {
            ...(statement.data().settings ?? {}),
            currentUnitPrice: next.currentUnitPrice,
          },
        },
        { merge: true },
      );
    });
    await batch.commit();
  }
  await addAudit(
    db,
    user.uid,
    "Cost updated",
    "production/settings",
    previous,
    next,
  );
}

export async function loadCurrencySettings() {
  const { db } = await adminContext();
  const settings = await getSettings(db);
  return {
    gbpUsdExchangeRate: settings.gbpUsdExchangeRate,
    exchangeRateUpdatedAt: settings.exchangeRateUpdatedAt ?? "",
  };
}

export async function saveExchangeRate(value: unknown) {
  const { user, db } = await adminContext();
  const previous = await getSettings(db);
  const newRate = positiveNumber(value, "GBP/USD exchange rate");
  const exchangeRateUpdatedAt = new Date().toISOString();
  await setDoc(
    doc(db, "production", "settings"),
    {
      gbpUsdExchangeRate: newRate,
      exchangeRateUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  await regenerateDraftStatements(db);
  const issuedStatements = await getDocs(collection(db, "statements"));
  for (let start = 0; start < issuedStatements.docs.length; start += 450) {
    const batch = writeBatch(db);
    issuedStatements.docs.slice(start, start + 450).forEach((statement) => {
      batch.set(
        statement.ref,
        {
          settings: {
            ...(statement.data().settings ?? {}),
            gbpUsdExchangeRate: newRate,
            exchangeRateUpdatedAt: serverTimestamp(),
          },
        },
        { merge: true },
      );
    });
    await batch.commit();
  }
  await addAudit(
    db,
    user.uid,
    "exchange_rate_updated",
    "production/settings",
    { previousRate: previous.gbpUsdExchangeRate },
    { newRate },
  );
  return { gbpUsdExchangeRate: newRate, exchangeRateUpdatedAt };
}

export async function loadExecutiveUpdate() {
  const { db } = await adminContext();
  const settings = await getSettings(db);
  return {
    executiveUpdate: settings.executiveUpdate ?? "",
    executiveUpdateUpdatedAt: settings.executiveUpdateUpdatedAt ?? "",
  };
}

export async function saveExecutiveUpdate(value: string) {
  const { user, db } = await adminContext();
  const executiveUpdate = value.trim();
  if (executiveUpdate.length > 100) {
    throw new Error("Executive Update must be 100 characters or fewer.");
  }
  if (/[<>]/.test(executiveUpdate)) {
    throw new Error("HTML is not allowed in the Executive Update.");
  }

  const previous = await getSettings(db);
  const executiveUpdateUpdatedAt = new Date().toISOString();
  const settingsReference = doc(db, "production", "settings");
  const auditReference = doc(collection(db, "adminAuditLog"));
  const saveBatch = writeBatch(db);
  saveBatch.set(
    settingsReference,
    {
      executiveUpdate,
      executiveUpdateUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  saveBatch.set(auditReference, {
    action: "executive_update_changed",
    administratorUid: user.uid,
    previousValue: previous.executiveUpdate ?? "",
    newValue: executiveUpdate,
    timestamp: serverTimestamp(),
    recordAffected: settingsReference.path,
  });
  await saveBatch.commit();

  // Issued statements are self-contained so investors only need permission to
  // read their own statement. Keep those snapshots in sync with the central
  // setting without granting investors access to administrator settings.
  const [statements, drafts] = await Promise.all([
    getDocs(collection(db, "statements")),
    getDocs(collection(db, "statementDrafts")),
  ]);
  const snapshots = [...statements.docs, ...drafts.docs];
  for (let start = 0; start < snapshots.length; start += 450) {
    const batch = writeBatch(db);
    snapshots.slice(start, start + 450).forEach((snapshot) => {
      batch.set(
        snapshot.ref,
        {
          settings: {
            ...(snapshot.data().settings ?? {}),
            executiveUpdate,
            executiveUpdateUpdatedAt: serverTimestamp(),
          },
        },
        { merge: true },
      );
    });
    await batch.commit();
  }

  return { executiveUpdate, executiveUpdateUpdatedAt };
}

function calculationOrder(method: TheatreCalculationMethod) {
  const standard = [
    "Gross box office",
    "Refunds",
    "Remove VAT at 20%",
    "Credit-card and ticket commissions at 5% of gross",
    "Royalties at 16%",
  ];
  if (method === "fixedRent") {
    return [
      ...standard,
      "Total fixed theatre rent",
      "Other approved deductions",
      "Producer profit at 40%",
    ];
  }
  if (method === "boxOfficeSplit") {
    return [
      ...standard,
      "Production box-office share",
      "Additional theatre deduction, if configured",
      "Other approved deductions",
      "Producer profit at 40%",
    ];
  }
  if (method === "theatreDeduction") {
    return [
      ...standard,
      "Theatre deduction",
      "Other approved deductions",
      "Producer profit at 40%",
    ];
  }
  return [];
}

export async function saveTheatreTerms(
  theatre: TheatreKey,
  values: InvestorForm,
) {
  const { user, db } = await adminContext();
  const calculationMethod =
    theatre === "leeds" || theatre === "london"
      ? "fixedRent"
      : "boxOfficeSplit";
  const fixedRent =
    theatre === "leeds" || theatre === "london"
      ? DEFAULT_THEATRE_TERMS[theatre].fixedRent
      : calculationMethod === "fixedRent"
        ? nonnegativeNumber(values.fixedRent)
        : 0;
  const productionShare =
    theatre === "leeds" || theatre === "london"
      ? 100
      : DEFAULT_THEATRE_TERMS.hull.productionShare;
  const theatreShare =
    theatre === "hull"
      ? DEFAULT_THEATRE_TERMS.hull.theatreShare
      : 0;
  const keepOptionalTheatreDeduction = theatre === "hull";
  const reference = doc(db, "theatreTerms", theatre);
  const theatreReference = doc(db, "theatres", theatre);
  const [previousTerms, previousTheatre] = await Promise.all([
    getDoc(reference),
    getDoc(theatreReference),
  ]);
  const performances = nonnegativeWholeNumber(
    values.performances,
    "Performances",
  );
  const next: TheatreTerms = normalizeTheatreTerms(theatre, {
    ...DEFAULT_THEATRE_TERMS[theatre],
    theatre,
    calculationMethod,
    fixedRent,
    productionShare,
    theatreShare,
    refunds: nonnegativeNumber(values.refunds),
    theatreDeductionType:
      text(values.theatreDeductionType) === "percentage"
        ? "percentage"
        : "fixed",
    theatreDeductionRate: keepOptionalTheatreDeduction
      ? nonnegativeNumber(values.theatreDeductionRate)
      : 0,
    theatreDeductionAmount: keepOptionalTheatreDeduction
      ? nonnegativeNumber(values.theatreDeductionAmount)
      : 0,
    otherApprovedDeductions: nonnegativeNumber(
      values.otherApprovedDeductions,
    ),
    otherDeductionNote: text(values.otherDeductionNote),
    configured: true,
    calculationOrder: calculationOrder(calculationMethod),
    updatedAt: new Date().toISOString(),
  });
  const saveBatch = writeBatch(db);
  saveBatch.set(reference, { ...next, updatedAt: serverTimestamp() });
  saveBatch.set(
    theatreReference,
    { performances, updatedAt: serverTimestamp() },
    { merge: true },
  );
  await saveBatch.commit();
  await regenerateDraftStatements(db);

  const statements = await getDocs(collection(db, "statements"));
  for (let start = 0; start < statements.docs.length; start += 450) {
    const batch = writeBatch(db);
    statements.docs.slice(start, start + 450).forEach((statement) => {
      const theatres = Array.isArray(statement.data().theatres)
        ? statement.data().theatres.map((item: { id?: string }) =>
            item.id === theatre ? { ...item, performances } : item,
          )
        : [];
      batch.update(statement.ref, { theatres });
    });
    await batch.commit();
  }
  await addAudit(
    db,
    user.uid,
    "Theatre financial terms updated",
    theatreReference.path,
    {
      terms: previousTerms.data() ?? null,
      performances: previousTheatre.data()?.performances ?? null,
    },
    { terms: next, performances },
  );
}

export async function createTestInvestor() {
  const { user, db } = await adminContext();
  const existing = await getDocs(
    query(collection(db, "investors"), where("isTest", "==", true)),
  );
  if (!existing.empty) throw new Error("Test investor data already exists.");
  const email = `investor-test-${Date.now()}@example.com`;
  const investorUid = doc(collection(db, "investors")).id;
  try {
    const accountNumber = await nextAccountNumber(db);
    const now = new Date().toISOString();
    const investor = {
      fullName: "John Smith",
      address:
        "123 High Street\nLondon\nGreater London\nSW1A 1AA\nUnited Kingdom",
      email,
      loginStatus: "Not Invited" as const,
      accountNumber,
      investmentCurrency: "GBP" as const,
      originalInvestmentAmount: 80_000,
      originalInvestmentGBP: 80_000,
      investmentExchangeRate: 1,
      originalInvestment: 80_000,
      participationPercentage: participationFor(80_000),
      currentStatementValue: 80_000,
      valuationBasis: "Held at Original Subscription Amount",
      investorStatus: "Test" as const,
      subscriptionDate: now.slice(0, 10),
      administrativeNote:
        "TEST INVESTOR — created by the test-data utility.",
      isTest: true,
      createdAt: now,
      updatedAt: now,
    };
    await writeInvestor(
      db,
      investorUid,
      {
        ...investor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      true,
    );
    await issueStatement(db, investorUid, true);
    await addAudit(
      db,
      user.uid,
      "Test data created",
      `investors/${investorUid}`,
      null,
      investor,
    );
    return {
      investor: { uid: investorUid, ...investor },
    };
  } catch (error) {
    await deleteDoc(doc(db, "investors", investorUid)).catch(() => undefined);
    throw error;
  }
}

export async function deleteTestInvestors() {
  const { user, db } = await adminContext();
  const tests = await getDocs(
    query(collection(db, "investors"), where("isTest", "==", true)),
  );
  const uids = tests.docs.map((document) => document.id);
  if (uids.length === 0) return { deleted: 0 };
  const batch = writeBatch(db);
  for (const document of tests.docs) batch.delete(document.ref);
  for (const uid of uids) {
    const statements = await getDocs(
      query(collection(db, "statements"), where("investorUid", "==", uid)),
    );
    statements.docs.forEach((document) => batch.delete(document.ref));
    batch.delete(doc(db, "statementDrafts", uid));
  }
  await batch.commit();
  await addAudit(
    db,
    user.uid,
    "Test data deleted",
    "investors/*[isTest=true]",
    { investorUids: uids },
    null,
  );
  return { deleted: uids.length };
}
