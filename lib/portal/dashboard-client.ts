"use client";

import { requireActiveAdminUser } from "./admin-auth-client";
import { DEFAULT_SETTINGS } from "./constants";
import { getFirebaseDb } from "./firebase-client";
import {
  calculateFinancialSummary,
  entriesForCalculation,
} from "./finance";
import { getEntries, getTheatres, getTheatreTerms } from "./store";
import type {
  DashboardBoxOfficeTotals,
} from "./types";

export async function getDashboardBoxOfficeTotals(): Promise<DashboardBoxOfficeTotals> {
  await requireActiveAdminUser();
  const db = getFirebaseDb();
  const [entries, theatres, theatreTerms] = await Promise.all([
    getEntries(db),
    getTheatres(db),
    getTheatreTerms(db),
  ]);
  const calculatedEntries = entriesForCalculation(
    entries,
    theatres,
    theatreTerms,
  );
  const summary = calculateFinancialSummary(
    calculatedEntries,
    DEFAULT_SETTINGS,
  );
  return {
    totalGrossBoxOffice: summary.totalGross,
    totalNetBoxOffice: summary.totalNet,
  };
}
