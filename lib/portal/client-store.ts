"use client";

import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import {
  normalizeSettings,
  normalizeTheatreTerms,
  THEATRES,
} from "./constants";
import {
  createStatementSnapshot,
  entriesForCalculation,
  normalizeStatementSnapshot,
} from "./finance";
import { getFirebaseDb } from "./firebase-client";
import type {
  BoxOfficeEntry,
  Investor,
  PortalSettings,
  StatementSnapshot,
  Theatre,
  TheatreKey,
  TheatreTerms,
} from "./types";

function normalizeInvestor(investor: Investor): Investor {
  const investmentCurrency =
    investor.investmentCurrency === "USD" ? "USD" : "GBP";
  const originalInvestmentGBP = Number(
    investor.originalInvestmentGBP ?? investor.originalInvestment ?? 0,
  );
  const originalInvestmentAmount = Number(
    investor.originalInvestmentAmount ?? investor.originalInvestment ?? 0,
  );
  return {
    ...investor,
    investmentCurrency,
    originalInvestmentAmount,
    originalInvestmentGBP,
    investmentExchangeRate: Number(
      investor.investmentExchangeRate ??
        (investmentCurrency === "USD" && originalInvestmentGBP > 0
          ? originalInvestmentAmount / originalInvestmentGBP
          : 1),
    ),
    originalInvestment: originalInvestmentGBP,
  };
}

function clean<T>(data: DocumentData): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value instanceof Timestamp ? value.toDate().toISOString() : value,
    ]),
  ) as T;
}

export async function getClientIssuedStatement(uid: string) {
  const db = getFirebaseDb();
  const snapshot = await getDocs(
    query(
      collection(db, "statements"),
      where("investor.authenticationUid", "==", uid),
      where("issued", "==", true),
    ),
  );
  const statements = snapshot.docs
    .map((item) =>
      normalizeStatementSnapshot({
        id: item.id,
        ...clean<Omit<StatementSnapshot, "id">>(item.data()),
      }),
    )
    .sort(
      (first, second) =>
        new Date(second.statementDate).getTime() -
        new Date(first.statementDate).getTime(),
    );
  return statements[0] ?? null;
}

export async function getClientCurrentStatement(uid: string) {
  const db = getFirebaseDb();
  const [
    investorSnapshot,
    entriesSnapshot,
    settingsSnapshot,
    ...remainingSnapshots
  ] =
    await Promise.all([
      getDoc(doc(db, "investors", uid)),
      getDocs(
        query(
          collection(db, "boxOfficeEntries"),
          orderBy("performanceDate", "asc"),
        ),
      ),
      getDoc(doc(db, "production", "settings")),
      ...THEATRES.map((theatre) =>
        getDoc(doc(db, "theatres", theatre.id)),
      ),
      ...THEATRES.map((theatre) =>
        getDoc(doc(db, "theatreTerms", theatre.id)),
      ),
    ]);
  if (!investorSnapshot.exists()) return null;
  const theatreSnapshots = remainingSnapshots.slice(0, THEATRES.length);
  const termsSnapshots = remainingSnapshots.slice(THEATRES.length);

  const rawInvestor = normalizeInvestor(
    clean<Investor>(investorSnapshot.data()),
  );
  const investor: Investor = {
    ...rawInvestor,
    uid: investorSnapshot.id,
    capitalRecouped: 0,
    recoveryPercentage: 0,
    capitalRemaining: rawInvestor.originalInvestment,
  };
  const entries: BoxOfficeEntry[] = entriesSnapshot.docs.map((item) => ({
    id: item.id,
    ...clean<Omit<BoxOfficeEntry, "id">>(item.data()),
  }));
  const settings: PortalSettings = normalizeSettings(
    settingsSnapshot.exists() ? clean(settingsSnapshot.data()) : {},
  );
  const theatres: Theatre[] = THEATRES.map((fallback, index) =>
    theatreSnapshots[index].exists()
      ? {
          ...fallback,
          ...clean<Theatre>(theatreSnapshots[index].data()),
          potential: fallback.potential,
        }
      : fallback,
  );
  const theatreTerms = Object.fromEntries(
    THEATRES.map((theatre, index) => [
      theatre.id,
      normalizeTheatreTerms(
        theatre.id,
        termsSnapshots[index].exists()
          ? clean<Partial<TheatreTerms>>(termsSnapshots[index].data())
          : {},
      ),
    ]),
  ) as Record<TheatreKey, TheatreTerms>;
  const calculationEntries = entriesForCalculation(
    entries,
    theatres,
    theatreTerms,
  );
  const statement = createStatementSnapshot(
    investor,
    calculationEntries,
    settings,
    theatreTerms,
  );
  statement.theatres = statement.theatres.map((item) => ({
    ...item,
    performances:
      theatres.find((theatre) => theatre.id === item.id)?.performances ??
      item.performances,
    cumulativeGross: theatres.find((theatre) => theatre.id === item.id)
      ?.cumulativeGross,
    previousGross: theatres.find((theatre) => theatre.id === item.id)
      ?.previousGross,
    weeklyChange: theatres.find((theatre) => theatre.id === item.id)
      ?.weeklyChange,
    actual:
      theatres.find((theatre) => theatre.id === item.id)?.cumulativeGross ??
      item.actual,
  }));
  return statement;
}
