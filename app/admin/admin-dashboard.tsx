"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  useAdminAuth,
} from "@/components/portal/admin-auth-guard";
import { LogoutButton } from "@/components/portal/logout-button";
import { EmailStatement } from "@/components/portal/email-statement";
import {
  LatestWeeklyDistribution,
  WeeklyStatementDistribution,
} from "@/components/portal/weekly-statement-distribution";
import { getInvestorAddress } from "@/lib/portal/address";
import {
  createInvestor,
  createTestInvestor,
  deleteTestInvestors,
  EMPTY_ADMIN_DATA,
  editInvestor,
  linkInvestorAccount,
  loadCurrencySettings,
  loadAuditSection,
  loadBoxOfficeSection,
  loadExecutiveUpdate,
  loadInvestorsSection,
  loadReportsSection,
  loadSettingsSection,
  loadStatementsSection,
  saveBoxOffice,
  saveExecutiveUpdate,
  saveExchangeRate,
  saveSettings,
  saveTheatreTerms,
  sendInvestorPasswordReset,
} from "@/lib/portal/admin-client";
import { authenticatedAdminFetch } from "@/lib/portal/admin-auth-client";
import { getDashboardBoxOfficeTotals } from "@/lib/portal/dashboard-client";
import {
  calculateTheatreBreakdown,
  calculateTheatreNet,
  currencyMoney,
  describeTheatreDeal,
  formatTswlUnits,
  investorCurrency,
  investorOriginalAmount,
  investorReportingValue,
  money,
  percentage,
  theatreTotals,
} from "@/lib/portal/finance";
import {
  OPERATIONAL_COST_PER_WEEK,
  TOTAL_CAPITALIZATION,
  TSWL_UNIT_SIZE,
} from "@/lib/portal/constants";
import type {
  DashboardBoxOfficeTotals,
  DashboardData,
  DashboardSheetResponse,
  DashboardSummary,
  Investor,
  PortalSettings,
  AuditEntry,
  Theatre,
  TheatreKey,
  TheatreTerms,
} from "@/lib/portal/types";

const EMPTY_DASHBOARD_SUMMARY: DashboardSummary = {
  totalCapitalization: TOTAL_CAPITALIZATION,
  operationalCostPerWeek: OPERATIONAL_COST_PER_WEEK,
  totalInvested: 0,
  capitalRemaining: TOTAL_CAPITALIZATION,
  totalGrossBoxOffice: 0,
  totalNetBoxOffice: 0,
  capitalRaisePercentage: 0,
  updatedAt: "",
};

const LAST_TOTAL_INVESTED_KEY = "tswl:last-total-invested";

function getLastTotalInvested() {
  try {
    const stored = window.localStorage.getItem(LAST_TOTAL_INVESTED_KEY);
    if (stored === null) return null;
    const value = Number(stored);
    return Number.isFinite(value) && value >= 0 ? value : null;
  } catch {
    return null;
  }
}

function rememberTotalInvested(value: number) {
  try {
    window.localStorage.setItem(LAST_TOTAL_INVESTED_KEY, String(value));
  } catch {
    // The in-memory dashboard value remains available when storage is blocked.
  }
}

const tabs = [
  "Dashboard",
  "Investors",
  "Box Office",
  "Statements",
  "Reports",
  "Settings",
  "Audit Log",
] as const;
type Tab = (typeof tabs)[number];
type DataTab = Exclude<Tab, "Dashboard">;

const dataLoaders = {
  Investors: loadInvestorsSection,
  "Box Office": loadBoxOfficeSection,
  Statements: loadStatementsSection,
  Reports: loadReportsSection,
  Settings: loadSettingsSection,
  "Audit Log": loadAuditSection,
} satisfies Record<
  DataTab,
  () => Promise<{ data: Partial<DashboardData>; warnings: string[] }>
>;

async function fetchDashboardSheet() {
  const response = await authenticatedAdminFetch("/api/admin/dashboard");
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.error || "Dashboard figures are temporarily unavailable.",
    );
  }
  return data as DashboardSheetResponse;
}

async function downloadStatementPdf(investorUid: string) {
  const response = await authenticatedAdminFetch(
    `/api/statement/pdf?investor=${encodeURIComponent(investorUid)}`,
  );
  if (!response.ok) {
    throw new Error("Unable to download the statement.");
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = "TSWL-investor-statement.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboard() {
  const adminUser = useAdminAuth();
  const adminEmail = adminUser.email ?? "Administrator";
  const [active, setActive] = useState<Tab>("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<DashboardData>(EMPTY_ADMIN_DATA);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (active === "Dashboard") return;
    setDataLoading(true);
    try {
      const result = await dataLoaders[active]();
      setData((current) => ({ ...current, ...result.data }));
      setError(result.warnings.join(" "));
    } catch (caught) {
      setError(
        (caught as Error).message ||
          "Administrator data is temporarily unavailable.",
      );
    } finally {
      setDataLoading(false);
    }
  }, [active]);

  useEffect(() => {
    if (active === "Dashboard") return;

    let activeRequest = true;
    dataLoaders[active]()
      .then((result) => {
        if (activeRequest) {
          setData((current) => ({ ...current, ...result.data }));
          setError(result.warnings.join(" "));
        }
      })
      .catch((caught) => {
        if (activeRequest) {
          setError(
            (caught as Error).message ||
              "Administrator data is temporarily unavailable.",
          );
        }
      })
      .finally(() => {
        if (activeRequest) setDataLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, [active]);

  async function mutate(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await action();
      setNotice(success);
      await refresh();
      return result;
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="portal-page min-h-screen bg-[#f0eee8] lg:grid lg:grid-cols-[250px_1fr]">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="no-print fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`no-print fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#173b29] px-5 py-7 text-white transition-transform lg:sticky lg:top-0 lg:min-h-screen lg:w-auto lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-white/15 px-2 pb-7">
          <Image
            src="/assets/tswllogo.png"
            alt="To Sir, With Love"
            width={220}
            height={116}
            className="h-14 w-auto"
            priority
          />
          <p className="mt-4 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#d6bb83]">
            Investor Management System
          </p>
        </div>
        <nav className="mt-6 space-y-1" aria-label="Administration">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => {
                if (tab !== "Dashboard") setDataLoading(true);
                setActive(tab);
                setMobileOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] ${
                active === tab
                  ? "bg-[#c7a764] text-[#173325]"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/15 px-2 pt-5">
          <p className="truncate text-xs text-white/55">{adminEmail}</p>
          <LogoutButton className="mt-3 text-xs font-bold uppercase tracking-wider text-white hover:text-[#d7b976]" />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="no-print sticky top-0 z-30 flex items-center gap-4 border-b border-[#d9d4ca] bg-[#fffdf9]/95 px-5 py-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#cfc8ba] text-xl text-[#234331] lg:hidden"
            aria-label="Open secure navigation"
          >
            ☰
          </button>
          <div className="min-w-0 flex-1 lg:hidden">
            <p className="truncate text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#9b7c40]">Investor Management System</p>
            <h1 className="truncate text-lg font-semibold text-[#183627]">{active}</h1>
          </div>
          <div className="hidden flex-1 lg:block">
            <p className="portal-kicker">Back office</p>
            <h1 className="text-xl font-semibold text-[#183627]">{active}</h1>
          </div>
          <LogoutButton className="text-xs font-bold uppercase tracking-wider text-[#31523f] lg:hidden" />
        </header>

        <main className="p-5 lg:p-8">
          {(notice || error) && (
            <div
              role="status"
              className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
                error
                  ? "border-[#d5aaa3] bg-[#fff1ee] text-[#872f26]"
                  : "border-[#bad0bf] bg-[#edf8ef] text-[#285e36]"
              }`}
            >
              <span>{error || notice}</span>
              {error && active !== "Dashboard" && (
                <button
                  type="button"
                  className="font-bold underline underline-offset-4"
                  onClick={() => void refresh()}
                >
                  Refresh data
                </button>
              )}
            </div>
          )}
          {active !== "Dashboard" && dataLoading && (
            <div
              className="mb-5 rounded-lg border border-[#d8d2c6] bg-[#faf8f3] px-4 py-3 text-sm text-[#647168]"
              role="status"
            >
              Loading {active.toLowerCase()}…
            </div>
          )}
          {active === "Dashboard" ? (
            <Overview />
          ) : active === "Box Office" ? (
            <BoxOffice data={data} busy={busy} mutate={mutate} />
          ) : active === "Investors" ? (
            <Investors data={data} busy={busy} mutate={mutate} />
          ) : active === "Statements" ? (
            <Statements data={data} busy={busy} mutate={mutate} onRefresh={refresh} />
          ) : active === "Reports" ? (
            <Reports data={data} />
          ) : active === "Settings" ? (
            <Settings
              settings={data.settings}
              theatres={data.theatres}
              theatreTerms={data.theatreTerms}
              busy={busy}
              mutate={mutate}
              onRefresh={refresh}
            />
          ) : (
            <AuditLog entries={data.auditLog} />
          )}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="portal-card p-5">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#758078]">{label}</p>
      <p className={`mt-3 text-2xl font-semibold tabular-nums ${accent ? "text-[#9a7837]" : "text-[#173727]"}`}>
        {value}
      </p>
    </div>
  );
}

function Overview() {
  const [summary, setSummary] = useState(EMPTY_DASHBOARD_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const [executiveUpdate, setExecutiveUpdate] = useState("");
  const [executiveUpdateUpdatedAt, setExecutiveUpdateUpdatedAt] = useState("");
  const [executiveUpdateLoading, setExecutiveUpdateLoading] = useState(true);
  const [executiveUpdateSaving, setExecutiveUpdateSaving] = useState(false);
  const [executiveUpdateMessage, setExecutiveUpdateMessage] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1.35);
  const [exchangeRateUpdatedAt, setExchangeRateUpdatedAt] = useState("");
  const [exchangeRateLoading, setExchangeRateLoading] = useState(true);
  const [exchangeRateSaving, setExchangeRateSaving] = useState(false);
  const [exchangeRateMessage, setExchangeRateMessage] = useState("");

  const applyDashboardResults = useCallback(
    (
      sheet: DashboardSheetResponse | null,
      boxOffice: DashboardBoxOfficeTotals | null,
    ) => {
      const retainedTotalInvested = sheet ? null : getLastTotalInvested();
      if (sheet) rememberTotalInvested(sheet.totalInvested);
      setSummary((previous) => {
        const totalInvested =
          sheet?.totalInvested ??
          retainedTotalInvested ??
          previous.totalInvested;
        return {
          totalCapitalization: TOTAL_CAPITALIZATION,
          operationalCostPerWeek: OPERATIONAL_COST_PER_WEEK,
          totalInvested,
          capitalRemaining: Math.max(
            0,
            TOTAL_CAPITALIZATION - totalInvested,
          ),
          totalGrossBoxOffice:
            boxOffice?.totalGrossBoxOffice ?? previous.totalGrossBoxOffice,
          totalNetBoxOffice:
            boxOffice?.totalNetBoxOffice ?? previous.totalNetBoxOffice,
          capitalRaisePercentage:
            (totalInvested / TOTAL_CAPITALIZATION) * 100,
          updatedAt: sheet?.updatedAt ?? previous.updatedAt,
        };
      });
    },
    [],
  );

  const refreshSummary = useCallback(async () => {
    setLoading(true);
    setWarning("");
    try {
      const [sheetResult, boxOfficeResult] = await Promise.allSettled([
        fetchDashboardSheet(),
        getDashboardBoxOfficeTotals(),
      ]);
      const sheet = sheetResult.status === "fulfilled" ? sheetResult.value : null;
      const boxOffice =
        boxOfficeResult.status === "fulfilled" ? boxOfficeResult.value : null;
      applyDashboardResults(sheet, boxOffice);
      setWarning(
        !sheet && !boxOffice
          ? "Dashboard figures are temporarily unavailable."
          : !sheet
            ? "Total invested is temporarily unavailable. Showing the last known value."
            : !boxOffice
              ? "Box-office figures are temporarily unavailable."
              : "",
      );
    } finally {
      setLoading(false);
    }
  }, [applyDashboardResults]);

  useEffect(() => {
    let activeRequest = true;
    Promise.allSettled([
      fetchDashboardSheet(),
      getDashboardBoxOfficeTotals(),
    ])
      .then(([sheetResult, boxOfficeResult]) => {
        if (activeRequest) {
          const sheet =
            sheetResult.status === "fulfilled" ? sheetResult.value : null;
          const boxOffice =
            boxOfficeResult.status === "fulfilled"
              ? boxOfficeResult.value
              : null;
          applyDashboardResults(sheet, boxOffice);
          setWarning(
            !sheet && !boxOffice
              ? "Dashboard figures are temporarily unavailable."
              : !sheet
                ? "Total invested is temporarily unavailable. Showing the last known value."
                : !boxOffice
                  ? "Box-office figures are temporarily unavailable."
                  : "",
          );
        }
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });
    const interval = window.setInterval(refreshSummary, 5 * 60 * 1000);
    return () => {
      activeRequest = false;
      window.clearInterval(interval);
    };
  }, [applyDashboardResults, refreshSummary]);

  useEffect(() => {
    let activeRequest = true;
    loadExecutiveUpdate()
      .then((result) => {
        if (!activeRequest) return;
        setExecutiveUpdate(result.executiveUpdate);
        setExecutiveUpdateUpdatedAt(result.executiveUpdateUpdatedAt);
      })
      .catch((error) => {
        if (activeRequest) {
          setExecutiveUpdateMessage(
            (error as Error).message || "Unable to load the Executive Update.",
          );
        }
      })
      .finally(() => {
        if (activeRequest) setExecutiveUpdateLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, []);

  useEffect(() => {
    let activeRequest = true;
    loadCurrencySettings()
      .then((result) => {
        if (!activeRequest) return;
        setExchangeRate(result.gbpUsdExchangeRate);
        setExchangeRateUpdatedAt(result.exchangeRateUpdatedAt);
      })
      .catch((error) => {
        if (activeRequest) {
          setExchangeRateMessage(
            (error as Error).message || "Unable to load currency settings.",
          );
        }
      })
      .finally(() => {
        if (activeRequest) setExchangeRateLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, []);

  async function submitExecutiveUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setExecutiveUpdateSaving(true);
    setExecutiveUpdateMessage("");
    try {
      const result = await saveExecutiveUpdate(executiveUpdate);
      setExecutiveUpdate(result.executiveUpdate);
      setExecutiveUpdateUpdatedAt(result.executiveUpdateUpdatedAt);
      setExecutiveUpdateMessage("Executive Update saved.");
    } catch (error) {
      setExecutiveUpdateMessage(
        (error as Error).message || "Unable to save the Executive Update.",
      );
    } finally {
      setExecutiveUpdateSaving(false);
    }
  }

  async function submitExchangeRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setExchangeRateSaving(true);
    setExchangeRateMessage("");
    try {
      const result = await saveExchangeRate(exchangeRate);
      setExchangeRate(result.gbpUsdExchangeRate);
      setExchangeRateUpdatedAt(result.exchangeRateUpdatedAt);
      setExchangeRateMessage("Exchange rate saved.");
    } catch (error) {
      setExchangeRateMessage(
        (error as Error).message || "Unable to save the exchange rate.",
      );
    } finally {
      setExchangeRateSaving(false);
    }
  }

  const progress = Math.min(
    100,
    Math.max(0, summary.capitalRaisePercentage),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="portal-kicker">Last updated</p>
          <p className="mt-1 text-sm text-[#536158]">
            {summary.updatedAt
              ? new Date(summary.updatedAt).toLocaleString("en-GB")
              : loading
                ? "Loading spreadsheet data…"
                : "No spreadsheet data loaded"}
          </p>
        </div>
        <button
          type="button"
          className="portal-button"
          disabled={loading}
          onClick={() => void refreshSummary()}
        >
          {loading ? "Refreshing…" : "Refresh Dashboard"}
        </button>
      </div>
      {warning && (
        <div
          role="status"
          className="rounded-lg border border-[#dfc991] bg-[#fff8e5] px-4 py-3 text-sm text-[#6c5422]"
        >
          {warning}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total capitalization" value={money(summary.totalCapitalization)} />
        <Stat label="Operational cost per week" value={money(summary.operationalCostPerWeek)} />
        <Stat label="Total invested" value={money(summary.totalInvested)} accent />
        <Stat label="Capital remaining" value={money(summary.capitalRemaining)} />
        <Stat label="Total gross box office" value={money(summary.totalGrossBoxOffice)} />
        <Stat label="Total net box office" value={money(summary.totalNetBoxOffice)} />
      </div>
      <section className="portal-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="portal-kicker">Capital raise progress</p>
            <p className="mt-2 text-3xl font-semibold text-[#173727]">
              {progress.toFixed(1)}%
            </p>
          </div>
          <p className="text-sm text-[#657168]">
            {money(summary.capitalRemaining)} remaining to raise
          </p>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e5e0d6]">
          <div className="h-full rounded-full bg-[#b4914c]" style={{ width: `${progress}%` }} />
        </div>
      </section>
      <section className="portal-card p-6">
        <p className="portal-kicker">Executive Update</p>
        <form onSubmit={submitExecutiveUpdate} className="mt-4">
          <label className="portal-field">
            <span className="sr-only">Executive Update</span>
            <input
              type="text"
              value={executiveUpdate}
              maxLength={100}
              disabled={executiveUpdateLoading || executiveUpdateSaving}
              onChange={(event) => setExecutiveUpdate(event.target.value)}
              placeholder="Enter one short production update"
            />
          </label>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#68746c]">
            <span>{executiveUpdate.length} / 100</span>
            <span>
              Last updated:{" "}
              {executiveUpdateUpdatedAt
                ? new Date(executiveUpdateUpdatedAt).toLocaleString("en-GB")
                : "Not yet updated"}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span
              className="text-sm text-[#68746c]"
              role={executiveUpdateMessage ? "status" : undefined}
            >
              {executiveUpdateMessage}
            </span>
            <button
              type="submit"
              className="portal-button"
              disabled={executiveUpdateLoading || executiveUpdateSaving}
            >
              {executiveUpdateSaving ? "Saving…" : "SAVE UPDATE"}
            </button>
          </div>
        </form>
      </section>
      <section className="portal-card max-w-xl p-6">
        <p className="portal-kicker">Currency settings</p>
        <form onSubmit={submitExchangeRate} className="mt-4">
          <label className="portal-field">
            <span>GBP / USD exchange rate</span>
            <input
              type="number"
              min="0.0001"
              step="0.0001"
              required
              value={exchangeRate}
              disabled={exchangeRateLoading || exchangeRateSaving}
              onChange={(event) => setExchangeRate(Number(event.target.value))}
            />
          </label>
          <p className="mt-2 text-sm font-semibold text-[#31533e]">
            £1 GBP = ${Number(exchangeRate || 0).toFixed(2)} USD
          </p>
          <p className="mt-2 text-xs text-[#68746c]">
            Last updated:{" "}
            {exchangeRateUpdatedAt
              ? new Date(exchangeRateUpdatedAt).toLocaleString("en-GB")
              : "Not yet updated"}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-[#68746c]" role={exchangeRateMessage ? "status" : undefined}>
              {exchangeRateMessage}
            </span>
            <button className="portal-button" disabled={exchangeRateLoading || exchangeRateSaving}>
              {exchangeRateSaving ? "Saving…" : "Save exchange rate"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function BoxOffice({
  data,
  busy,
  mutate,
}: {
  data: DashboardData;
  busy: boolean;
  mutate: (action: () => Promise<unknown>, success: string) => Promise<unknown>;
}) {
  const [grossTotals, setGrossTotals] = useState(
    () =>
      Object.fromEntries(
        data.theatres.map((theatre) => [
          theatre.id,
          theatre.cumulativeGross ??
            theatreTotals(data.entries, theatre.id).gross,
        ]),
      ) as Record<"leeds" | "hull" | "london", number>,
  );
  const [adjustments, setAdjustments] = useState(
    () =>
      Object.fromEntries(
        data.theatres.map((theatre) => [
          theatre.id,
          {
            refunds: data.theatreTerms[theatre.id].refunds,
            otherApprovedDeductions:
              data.theatreTerms[theatre.id].otherApprovedDeductions,
          },
        ]),
      ) as Record<
        TheatreKey,
        { refunds: number; otherApprovedDeductions: number }
      >,
  );
  const liveTerms = Object.fromEntries(
    data.theatres.map((theatre) => [
      theatre.id,
      {
        ...data.theatreTerms[theatre.id],
        ...adjustments[theatre.id],
      },
    ]),
  ) as Record<TheatreKey, TheatreTerms>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(
      () => saveBoxOffice(grossTotals, adjustments),
      "Box-office totals saved and statements recalculated.",
    );
  }
  const actualGross = Object.values(grossTotals).reduce(
    (sum, gross) => sum + gross,
    0,
  );
  const actualNet = data.theatres.reduce(
    (sum, theatre) =>
      sum +
      (calculateTheatreNet(
        grossTotals[theatre.id],
        theatre.id,
        liveTerms,
      ) ?? 0),
    0,
  );
  const totalPotential = data.theatres.reduce(
    (sum, theatre) => sum + theatre.potential,
    0,
  );

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        {data.theatres.map((theatre) => {
          const gross = grossTotals[theatre.id];
          const breakdown = calculateTheatreBreakdown(
            gross,
            theatre.id,
            liveTerms,
          );
          const deal = describeTheatreDeal(data.theatreTerms[theatre.id]);
          const historicalUpdates = data.entries
            .filter((entry) => entry.theatreId === theatre.id)
            .map((entry) => entry.updatedAt)
            .filter(Boolean)
            .sort();
          const updatedAt =
            theatre.updatedAt ??
            historicalUpdates[historicalUpdates.length - 1];

          return (
            <section className="portal-card p-5 sm:p-6" key={theatre.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="portal-kicker">{theatre.name}</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Gross Box Office
                  </h2>
                </div>
                <p className="text-right text-xs leading-5 text-[#738078]">
                  Potential
                  <br />
                  <strong>{money(theatre.potential)}</strong>
                </p>
              </div>
              <label className="portal-field mt-5">
                <span>{theatre.name.toUpperCase()} GROSS BOX OFFICE</span>
                <input
                  aria-label={`${theatre.name} gross box office`}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={gross}
                  onChange={(event) =>
                    setGrossTotals((current) => ({
                      ...current,
                      [theatre.id]: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="portal-field">
                  <span>REFUNDS (£)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={adjustments[theatre.id].refunds}
                    onChange={(event) =>
                      setAdjustments((current) => ({
                        ...current,
                        [theatre.id]: {
                          ...current[theatre.id],
                          refunds: Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>
                <label className="portal-field">
                  <span>OTHER APPROVED DEDUCTIONS (£)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      adjustments[theatre.id].otherApprovedDeductions
                    }
                    onChange={(event) =>
                      setAdjustments((current) => ({
                        ...current,
                        [theatre.id]: {
                          ...current[theatre.id],
                          otherApprovedDeductions: Number(
                            event.target.value,
                          ),
                        },
                      }))
                    }
                  />
                </label>
              </div>
              <dl className="mt-5 grid gap-4 border-t border-[#e1dbcf] pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Metric label="Deal structure" value={deal} />
                <Metric
                  label="Gross less refunds"
                  value={money(breakdown.grossLessRefunds)}
                />
                <Metric
                  label="Net of VAT"
                  value={money(breakdown.netOfVat)}
                />
                <Metric
                  label="Credit-card fees"
                  value={money(breakdown.creditCardFees)}
                />
                <Metric
                  label="Royalties"
                  value={money(breakdown.royalties)}
                />
                <Metric
                  label="Theatre deal deduction / share"
                  value={
                    breakdown.theatreDealDeduction === null
                      ? "Pending"
                      : money(breakdown.theatreDealDeduction)
                  }
                />
                <Metric
                  label="Other approved deductions"
                  value={money(breakdown.otherApprovedDeductions)}
                />
                <Metric
                  label="Calculated production result"
                  value={
                    breakdown.productionResult === null
                      ? "Pending"
                      : money(breakdown.productionResult)
                  }
                />
                <Metric
                  label="Producer profit"
                  value={
                    breakdown.productionResult === null
                      ? "Pending"
                      : breakdown.producerProfit === null
                        ? "Not applicable"
                      : money(breakdown.producerProfit)
                  }
                />
                <Metric
                  label="Potential achieved"
                  value={percentage(gross / theatre.potential)}
                />
              </dl>
              {!data.theatreTerms[theatre.id].configured && (
                <p className="mt-4 rounded-lg border border-[#dfc991] bg-[#fff8e5] p-3 text-xs text-[#6c5422]">
                  {theatre.name} financial terms not yet configured.
                </p>
              )}
              <p className="mt-5 text-xs text-[#7a847e]">
                Last updated:{" "}
                {updatedAt
                  ? new Date(updatedAt).toLocaleString("en-GB")
                  : "Not yet saved"}
              </p>
            </section>
          );
        })}
      </div>
      <section className="portal-card p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Total potential gross" value={money(totalPotential)} />
          <Metric label="Total gross box office" value={money(actualGross)} />
          <Metric
            label="Total calculated production result"
            value={money(actualNet)}
          />
          <Metric
            label="Total potential achieved"
            value={percentage(actualGross / totalPotential)}
          />
        </div>
      </section>
      <div className="flex justify-end">
        <button className="portal-button w-full sm:w-auto" disabled={busy}>
          Save Box Office
        </button>
      </div>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[0.64rem] font-bold uppercase tracking-wider text-[#7b847e]">{label}</dt><dd className="mt-1 font-semibold tabular-nums text-[#1d3c2b]">{value}</dd></div>;
}

function Field({ label, name, type = "text", required = false, select = false, options = [] }: { label: string; name: string; type?: string; required?: boolean; select?: boolean; options?: string[][] }) {
  return (
    <label className="portal-field">
      <span>{label}{required ? " *" : ""}</span>
      {select ? <select name={name}>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select> : <input name={name} type={type} required={required} min={type === "number" ? 0 : undefined} step={type === "number" ? "0.01" : undefined} />}
    </label>
  );
}

function Investors({
  data,
  busy,
  mutate,
}: {
  data: DashboardData;
  busy: boolean;
  mutate: (action: () => Promise<unknown>, success: string) => Promise<unknown>;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "investment" | "participation">("name");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Investor | null>(null);
  const [authenticationUid, setAuthenticationUid] = useState("");
  const [addCurrency, setAddCurrency] = useState<"GBP" | "USD">("GBP");
  const [addAmount, setAddAmount] = useState(0);
  const [editCurrency, setEditCurrency] = useState<"GBP" | "USD">("GBP");
  const [editAmount, setEditAmount] = useState(0);
  const [editExchangeRate, setEditExchangeRate] = useState(1);
  const currentExchangeRate = data.settings.gbpUsdExchangeRate;
  const visible = useMemo(() => data.investors
    .filter((item) => `${item.fullName} ${item.email} ${item.accountNumber}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "investment") return b.originalInvestment - a.originalInvestment;
      if (sortBy === "participation") return b.participationPercentage - a.participationPercentage;
      return a.fullName.localeCompare(b.fullName);
    }), [data.investors, search, sortBy]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    await mutate(async () => {
      return createInvestor(values);
    }, "Investor created.");
    form.reset();
    setAddAmount(0);
    setAddCurrency("GBP");
    setShowAdd(false);
  }
  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    await mutate(
      () => editInvestor(editing.uid, values),
      "Investor details updated and statements recalculated.",
    );
    setEditing(null);
  }
  function openEditor(investor: Investor) {
    setEditing(investor);
    setAuthenticationUid(investor.authenticationUid ?? "");
    const currency = investorCurrency(investor);
    setEditCurrency(currency);
    setEditAmount(investorOriginalAmount(investor));
    setEditExchangeRate(
      currency === "USD"
        ? investor.investmentExchangeRate || currentExchangeRate
        : 1,
    );
  }
  const loginStatus =
    editing?.loginStatus ?? (editing?.lastLoginAt ? "Active" : "Not Invited");
  return (
    <div className="space-y-6">
      {editing && (
        <section className="portal-card border-[#b79a5a] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div><p className="portal-kicker">Edit investor</p><h2 className="mt-1 text-xl font-semibold">{editing.fullName}</h2></div>
            <button type="button" onClick={() => setEditing(null)} className="text-sm font-semibold text-[#58685e]">Cancel</button>
          </div>
          <form onSubmit={update} className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["NAME", "fullName", "text", editing.fullName, true],
              ["EMAIL", "email", "email", editing.email, true],
              ["TELEPHONE (OPTIONAL)", "telephone", "tel", editing.telephone || "", false],
              ["NOTES (OPTIONAL)", "administrativeNote", "text", editing.administrativeNote || "", false],
            ].map(([label, name, type, value, required]) => <label className="portal-field" key={String(name)}><span>{label}</span><input name={String(name)} type={String(type)} defaultValue={String(value)} required={Boolean(required)} /></label>)}
            <label className="portal-field"><span>CURRENCY</span><select name="investmentCurrency" value={editCurrency} onChange={(event) => {
              const currency = event.target.value as "GBP" | "USD";
              setEditCurrency(currency);
              if (currency === "USD" && editExchangeRate === 1) setEditExchangeRate(currentExchangeRate);
            }}><option value="GBP">GBP</option><option value="USD">USD</option></select></label>
            <label className="portal-field"><span>AMOUNT INVESTED ({editCurrency})</span><input name="originalInvestment" type="number" min="0.01" step="0.01" required value={editAmount || ""} onChange={(event) => setEditAmount(Number(event.target.value))} /></label>
            {editCurrency === "USD" && <label className="portal-field"><span>INVESTMENT GBP/USD RATE</span><input name="investmentExchangeRate" type="number" min="0.0001" step="0.0001" required value={editExchangeRate} onChange={(event) => setEditExchangeRate(Number(event.target.value))} /></label>}
            {editCurrency === "GBP" && <input type="hidden" name="investmentExchangeRate" value="1" />}
            <InvestmentPreview currency={editCurrency} amount={editAmount} exchangeRate={editCurrency === "USD" ? editExchangeRate : 1} />
            <label className="portal-field md:col-span-3">
              <span>ADDRESS</span>
              <textarea
                name="address"
                rows={5}
                defaultValue={getInvestorAddress(editing)}
                required
              />
            </label>
            <label className="portal-field"><span>Investor status</span><select name="investorStatus" defaultValue={editing.investorStatus}><option>Active</option><option>Pending</option><option>Closed</option><option>Test</option></select></label>
            <div className="flex items-end"><button className="portal-button w-full" disabled={busy}>Save changes</button></div>
          </form>
          <section className="mt-6 border-t border-[#ded8cd] pt-6">
            <p className="portal-kicker">Investor Portal</p>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#758078]">Email</p>
                <p className="mt-1 break-all text-sm font-semibold text-[#203d2d]">{editing.email}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#758078]">Portal Access</p>
                <p className="mt-1 text-sm font-semibold text-[#203d2d]">{editing.authenticationUid ? "Activated" : "Not Activated"}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#758078]">Login status</p>
                <p className="mt-1 text-sm font-semibold text-[#203d2d]">{loginStatus}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#758078]">Activated</p>
                <p className="mt-1 text-sm font-semibold text-[#203d2d]">{editing.activatedAt ? new Date(editing.activatedAt).toLocaleString("en-GB") : "—"}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-[#68746c]">
              Investors can activate access from the login page once this record is Active. Manual UID linking remains available for account recovery and administration.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="portal-field">
                <span>Firebase Authentication UID</span>
                <input
                  value={authenticationUid}
                  onChange={(event) => setAuthenticationUid(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <button
                type="button"
                className="portal-button self-end"
                disabled={busy || !authenticationUid.trim()}
                onClick={async () => {
                  const result = await mutate(
                    () => linkInvestorAccount(editing.uid, authenticationUid),
                    "Investor Authentication account linked.",
                  );
                  if (result) setEditing(null);
                }}
              >
                Link Investor Account
              </button>
            </div>
            <button
              type="button"
              className="portal-button portal-button-secondary mt-4"
              disabled={busy || !editing.authenticationUid}
              onClick={async () => {
                const result = await mutate(
                  () => sendInvestorPasswordReset(editing.uid),
                  "Password reset email sent.",
                );
                if (result) {
                  setEditing((current) =>
                    current ? { ...current, loginStatus: "Invited" } : current,
                  );
                }
              }}
            >
              SEND PASSWORD RESET EMAIL
            </button>
          </section>
        </section>
      )}
      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        <WeeklyStatementDistribution disabled={busy} />
        <button type="button" className="portal-button" onClick={() => setShowAdd((value) => !value)}>
          {showAdd ? "Close form" : "Add investor"}
        </button>
      </div>
      {showAdd && <section className="portal-card p-5 sm:p-6">
        <p className="portal-kicker">Add investor</p>
        <h2 className="mt-1 text-xl font-semibold">Create investor account</h2>
        <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="NAME" name="fullName" required />
          <label className="portal-field"><span>CURRENCY *</span><select name="investmentCurrency" value={addCurrency} onChange={(event) => setAddCurrency(event.target.value as "GBP" | "USD")}><option value="GBP">GBP</option><option value="USD">USD</option></select></label>
          <label className="portal-field"><span>AMOUNT INVESTED ({addCurrency}) *</span><input name="originalInvestment" type="number" min="0.01" step="0.01" required value={addAmount || ""} onChange={(event) => setAddAmount(Number(event.target.value))} /></label>
          <InvestmentPreview currency={addCurrency} amount={addAmount} exchangeRate={addCurrency === "USD" ? currentExchangeRate : 1} />
          <label className="portal-field md:col-span-3">
            <span>ADDRESS</span>
            <textarea name="address" rows={5} required />
          </label>
          <Field label="EMAIL" name="email" type="email" required />
          <Field label="TELEPHONE (OPTIONAL)" name="telephone" type="tel" />
          <Field label="NOTES (OPTIONAL)" name="administrativeNote" />
          <div className="flex items-end md:col-span-3 md:justify-end"><button className="portal-button w-full md:w-auto" disabled={busy}>Create investor</button></div>
        </form>
      </section>}
      <section className="portal-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ded8cd] p-5">
          <div><p className="portal-kicker">Investor records</p><h2 className="mt-1 text-xl font-semibold">{data.investors.length} investors</h2></div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <label className="portal-field sm:w-72"><span className="sr-only">Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or account…" /></label>
            <label className="portal-field"><span className="sr-only">Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}><option value="name">Sort: Name</option><option value="investment">Sort: Investment</option><option value="participation">Sort: Participation</option></select></label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-[#f7f4ed] text-[0.65rem] uppercase tracking-wider text-[#68736c]"><tr><th className="p-4">Investor</th><th className="p-4">Account</th><th className="p-4 text-right">Original investment</th><th className="p-4 text-right">Participation</th><th className="p-4 text-right">Capital recouped</th><th className="p-4 text-right">Recovery</th><th className="p-4 text-right">Capital remaining</th><th className="p-4 text-right">Statement value</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#ebe7df]">
              {visible.map((investor) => <tr key={investor.uid} className="hover:bg-[#fbfaf6]"><td className="p-4"><strong className="block text-[#203d2d]">{investor.fullName}</strong><span className="text-xs text-[#758078]">{investor.email}</span><span className="mt-1 block whitespace-pre-wrap text-xs leading-5 text-[#758078]">{getInvestorAddress(investor)}</span>{investor.isTest && <span className="mt-1 block w-fit rounded bg-[#f4e4b8] px-2 py-0.5 text-[0.6rem] font-bold tracking-wider text-[#765b20]">TEST INVESTOR</span>}</td><td className="p-4 font-mono text-xs">{investor.accountNumber}</td><td className="p-4 text-right tabular-nums">{currencyMoney(investorOriginalAmount(investor), investorCurrency(investor))}</td><td className="p-4 text-right tabular-nums">{percentage(investor.participationPercentage)}</td><td className="p-4 text-right tabular-nums">{money(investor.capitalRecouped)}</td><td className="p-4 text-right tabular-nums">{percentage(investor.recoveryPercentage)}</td><td className="p-4 text-right tabular-nums">{money(investor.capitalRemaining)}</td><td className="p-4 text-right font-semibold tabular-nums">{currencyMoney(investorReportingValue(investor.currentStatementValue, investor, currentExchangeRate), investorCurrency(investor))}</td><td className="p-4"><span className="rounded-full bg-[#e8f0e9] px-2 py-1 text-xs font-semibold text-[#31573b]">{investor.investorStatus}</span></td><td className="p-4"><div className="flex gap-3"><a className="font-semibold text-[#496d56] underline-offset-4 hover:underline" href={`/statement?investor=${investor.uid}`}>View</a><button type="button" onClick={() => openEditor(investor)} className="font-semibold text-[#496d56] underline-offset-4 hover:underline">Edit</button></div></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function InvestmentPreview({
  currency,
  amount,
  exchangeRate,
}: {
  currency: "GBP" | "USD";
  amount: number;
  exchangeRate: number;
}) {
  const gbpEquivalent =
    currency === "USD" && exchangeRate > 0 ? amount / exchangeRate : amount;
  return (
    <div className="rounded-lg border border-[#ddd6ca] bg-[#faf8f3] p-4 md:col-span-3">
      <p className="portal-kicker">Investment basis</p>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Investment" value={currencyMoney(amount, currency)} />
        <Metric label="GBP equivalent" value={money(gbpEquivalent)} />
        <Metric
          label="Exchange rate"
          value={currency === "USD" ? `£1 = $${exchangeRate.toFixed(2)}` : "GBP base"}
        />
        <Metric label="TSWL units" value={formatTswlUnits(gbpEquivalent)} />
      </dl>
      {currency === "USD" && (
        <p className="mt-3 text-xs text-[#68746c]">
          GBP equivalent: {money(gbpEquivalent)} at the historical investment rate. One TSWL Unit is {money(TSWL_UNIT_SIZE)}.
        </p>
      )}
    </div>
  );
}

function Statements({
  data,
  busy,
  mutate,
  onRefresh,
}: {
  data: DashboardData;
  busy: boolean;
  mutate: (action: () => Promise<unknown>, success: string) => Promise<unknown>;
  onRefresh: () => Promise<void>;
}) {
  const [investorUid, setInvestorUid] = useState(data.investors[0]?.uid || "");
  const [privateNote, setPrivateNote] = useState("");
  const selectedInvestorUid = data.investors.some(
    (item) => item.uid === investorUid,
  )
    ? investorUid
    : data.investors[0]?.uid || "";
  const investor = data.investors.find(
    (item) => item.uid === selectedInvestorUid,
  );
  const emailedStatements = data.statements.filter(
    (statement) => statement.emailDeliveryStatus === "sent",
  );
  return (
    <div className="space-y-6">
      <LatestWeeklyDistribution />
      <section className="portal-card p-6">
        <p className="portal-kicker">Statement controls</p>
        <h2 className="mt-1 text-xl font-semibold">Investor statement</h2>
        <label className="portal-field mt-5"><span>Search or select investor</span><select value={selectedInvestorUid} onChange={(event) => { setInvestorUid(event.target.value); setPrivateNote(""); }}>{data.investors.map((item) => <option value={item.uid} key={item.uid}>{item.fullName} — {item.accountNumber}</option>)}</select></label>
        <label className="portal-field mt-4"><span>Private administrative note</span><textarea rows={4} placeholder="Not visible to the investor" value={privateNote} onChange={(event) => setPrivateNote(event.target.value)} /></label>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <a href={selectedInvestorUid ? `/statement?investor=${selectedInvestorUid}` : "#"} className="portal-button flex items-center justify-center">Preview</a>
          <button
            type="button"
            disabled={busy || !selectedInvestorUid}
            onClick={() =>
              void mutate(
                () => downloadStatementPdf(selectedInvestorUid),
                "Statement PDF downloaded.",
              )
            }
            className="portal-button portal-button-secondary flex items-center justify-center"
          >
            Download PDF
          </button>
          {investor && <EmailStatement investor={investor} privateNote={privateNote} disabled={busy} onSent={onRefresh} />}
        </div>
        <p className="mt-4 text-xs leading-5 text-[#737d76]">Successfully emailed statements are automatically preserved as immutable historical snapshots.</p>
      </section>
      <section className="portal-card overflow-hidden">
        <div className="border-b border-[#ded8cd] p-5">
          <p className="portal-kicker">Statement history</p>
          <h2 className="mt-1 text-xl font-semibold">Prior snapshots</h2>
          <p className="mt-2 text-sm text-[#68746c]">Only statements successfully emailed to investors are stored here.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-[#f7f4ed] text-left text-[0.65rem] uppercase tracking-wider text-[#68736c]"><tr><th className="p-4">Statement date</th><th className="p-4">Investor</th><th className="p-4">Account</th><th className="p-4">Email recipient</th><th className="p-4">Time sent</th><th className="p-4 text-right">Statement value</th><th className="p-4">Status</th></tr></thead>
            <tbody className="divide-y divide-[#ebe7df]">
              {emailedStatements.length === 0 ? <tr><td colSpan={7} className="p-6 text-center text-[#758078]">No emailed statement history yet.</td></tr> : emailedStatements.map((statement) => <tr key={statement.id}><td className="p-4">{new Date(statement.statementDate).toLocaleDateString("en-GB")}</td><td className="p-4 font-semibold">{statement.investor.fullName}</td><td className="p-4 font-mono text-xs">{statement.investor.accountNumber}</td><td className="p-4 break-all">{statement.recipientEmail || "—"}</td><td className="p-4 whitespace-nowrap">{statement.emailedAt ? new Date(statement.emailedAt).toLocaleString("en-GB") : "—"}</td><td className="p-4 text-right font-semibold tabular-nums">{currencyMoney(investorReportingValue(statement.investor.currentStatementValue, statement.investor, statement.settings.gbpUsdExchangeRate), investorCurrency(statement.investor))}</td><td className="p-4 font-semibold">EMAILED</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Reports({ data }: { data: DashboardData }) {
  const totalInvested = data.investors.reduce((sum, item) => sum + item.originalInvestment, 0);
  return (
    <div className="space-y-6">
      <section className="portal-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="portal-kicker">Management reporting</p>
            <h2 className="mt-1 text-xl font-semibold">Production financial summary</h2>
          </div>
          <button type="button" onClick={() => window.print()} className="portal-button portal-button-secondary no-print">
            Print report
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Subscribed capital" value={money(totalInvested)} />
          <Stat label="Actual gross receipts" value={money(data.financialSummary.totalGross)} />
          <Stat label="Actual net receipts" value={money(data.financialSummary.totalNet)} />
        </div>
      </section>
      <section className="portal-card overflow-hidden">
        <div className="border-b border-[#ded8cd] p-5">
          <p className="portal-kicker">Theatre report</p>
          <h2 className="mt-1 text-xl font-semibold">Potential versus actual</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-[#f7f4ed] text-left text-[0.65rem] uppercase tracking-wider text-[#68736c]"><tr><th className="p-4">Theatre</th><th className="p-4 text-right">Performances</th><th className="p-4 text-right">Gross potential</th><th className="p-4 text-right">Actual gross</th><th className="p-4 text-right">Actual net</th><th className="p-4 text-right">Achievement</th></tr></thead>
            <tbody className="divide-y divide-[#ebe7df]">
              {data.theatres.map((theatre) => {
                const totals = theatreTotals(data.entries, theatre.id);
                const gross = theatre.cumulativeGross ?? totals.gross;
                const net = calculateTheatreNet(
                  gross,
                  theatre.id,
                  data.theatreTerms,
                );
                return <tr key={theatre.id}><td className="p-4 font-semibold uppercase">{theatre.name}</td><td className="p-4 text-right">{theatre.performances}</td><td className="p-4 text-right tabular-nums">{money(theatre.potential)}</td><td className="p-4 text-right tabular-nums">{money(gross)}</td><td className="p-4 text-right tabular-nums">{net === null ? "Pending" : money(net)}</td><td className="p-4 text-right tabular-nums">{percentage(gross / theatre.potential)}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AuditLog({ entries }: { entries: AuditEntry[] }) {
  const [search, setSearch] = useState("");
  const visible = entries.filter((entry) =>
    `${entry.action} ${entry.recordAffected} ${entry.administratorUid}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <section className="portal-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ded8cd] p-5">
        <div><p className="portal-kicker">Security record</p><h2 className="mt-1 text-xl font-semibold">Administrator audit log</h2></div>
        <label className="portal-field w-full sm:w-72"><span className="sr-only">Search audit log</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search action or record…" /></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-[#f7f4ed] text-left text-[0.65rem] uppercase tracking-wider text-[#68736c]"><tr><th className="p-4">Timestamp</th><th className="p-4">Action</th><th className="p-4">Record affected</th><th className="p-4">Administrator UID</th></tr></thead>
          <tbody className="divide-y divide-[#ebe7df]">
            {visible.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-[#748078]">No audit entries found.</td></tr> : visible.map((entry) => <tr key={entry.id}><td className="p-4 whitespace-nowrap">{entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-GB") : "Pending"}</td><td className="p-4 font-semibold">{entry.action}</td><td className="p-4 font-mono text-xs">{entry.recordAffected}</td><td className="p-4 font-mono text-xs text-[#6e7972]">{entry.administratorUid}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Settings({
  settings,
  theatres,
  theatreTerms,
  busy,
  mutate,
  onRefresh,
}: {
  settings: PortalSettings;
  theatres: Theatre[];
  theatreTerms: Record<TheatreKey, TheatreTerms>;
  busy: boolean;
  mutate: (action: () => Promise<unknown>, success: string) => Promise<unknown>;
  onRefresh: () => Promise<void>;
}) {
  const [testMessage, setTestMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    await mutate(
      () => saveSettings(values),
      "Calculation settings saved and statements regenerated.",
    );
  }
  return (
    <section className="portal-card max-w-5xl p-5 sm:p-7">
      <p className="portal-kicker">Recoupment configuration</p>
      <h2 className="mt-1 text-xl font-semibold">Financial settings</h2>
      <p className="mt-2 text-sm text-[#68746c]">Changes apply to calculated drafts; prior issued statements remain unchanged.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ["Total capitalization", "totalCapitalization"],
          ["Weekly operating costs", "weeklyOperatingCosts"],
          ["Current TSWL unit price", "currentUnitPrice"],
        ].map(([label, name]) => {
          const value = settings[name as keyof PortalSettings];
          return <label className="portal-field" key={name}><span>{label}</span><input name={name} type="number" min="0" step="0.0001" defaultValue={typeof value === "number" ? value : ""} /></label>;
        })}
        <label className="portal-field md:col-span-2"><span>Recoupment priority</span><textarea name="recoupmentPriority" rows={3} defaultValue={settings.recoupmentPriority} /></label>
        <button className="portal-button md:col-span-2 md:justify-self-end" disabled={busy}>Save settings</button>
      </form>
      <div className="mt-8 border-t border-[#ddd6ca] pt-6">
        <p className="portal-kicker">Net box-office calculations</p>
        <h3 className="mt-1 text-lg font-semibold">Theatre financial terms</h3>
        <p className="mt-2 text-sm text-[#69756d]">
          Each theatre uses an independent Firestore record. Percentages apply
          sequentially to the running balance in the calculation order shown.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {(["leeds", "hull", "london"] as const).map((id) => (
            <TheatreTermsCard
              key={id}
              terms={theatreTerms[id]}
              performances={
                theatres.find((theatre) => theatre.id === id)?.performances ??
                0
              }
              busy={busy}
              mutate={mutate}
            />
          ))}
        </div>
      </div>
      <div className="mt-8 border-t border-[#ddd6ca] pt-6">
        <p className="portal-kicker">Test data</p>
        <h3 className="mt-1 text-lg font-semibold">Sample investor controls</h3>
        <p className="mt-2 text-sm text-[#69756d]">
          Test records are explicitly labelled and never created automatically.
        </p>
        {testMessage && <p className="mt-4 rounded-lg bg-[#f4f0e7] p-3 text-sm">{testMessage}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="portal-button"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm("Create the clearly labelled John Smith test investor?")) return;
              try {
                await createTestInvestor();
                setTestMessage("Test investor record created without an Authentication account.");
                await onRefresh();
              } catch (error) {
                setTestMessage((error as Error).message);
              }
            }}
          >
            Create test investor
          </button>
          <button
            type="button"
            className="portal-button border border-[#a64d43] bg-white text-[#8b3028] hover:bg-[#fff1ef]"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm("Delete all records marked as test data? Production investor records will not be affected.")) return;
              try {
                const result = await deleteTestInvestors();
                setTestMessage(`${result.deleted} test investor record(s) deleted.`);
                await onRefresh();
              } catch (error) {
                setTestMessage((error as Error).message);
              }
            }}
          >
            Delete all test data
          </button>
        </div>
      </div>
    </section>
  );
}

function TheatreTermsCard({
  terms,
  performances,
  busy,
  mutate,
}: {
  terms: TheatreTerms;
  performances: number;
  busy: boolean;
  mutate: (action: () => Promise<unknown>, success: string) => Promise<unknown>;
}) {
  const [deductionType, setDeductionType] = useState<"fixed" | "percentage">(
    terms.theatreDeductionType,
  );
  const name = terms.theatre[0].toUpperCase() + terms.theatre.slice(1);
  const lockedMethod =
    terms.theatre === "leeds" || terms.theatre === "london"
      ? "fixedRent"
      : "boxOfficeSplit";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    await mutate(
      () => saveTheatreTerms(terms.theatre, values),
      `${name} financial terms saved.`,
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-[#d9d2c5] bg-[#faf8f3] p-5"
    >
      <p className="text-sm font-bold uppercase tracking-wider text-[#294936]">
        {name} Terms
      </p>
      <input
        type="hidden"
        name="calculationMethod"
        value={lockedMethod}
      />
      <p className="mt-3 rounded-lg bg-[#efebe2] p-3 text-sm font-semibold text-[#294936]">
        Deal: {describeTheatreDeal(terms)}
      </p>
      <label className="portal-field mt-4">
        <span>Performances</span>
        <input
          name="performances"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={performances}
        />
      </label>
      <>
          {terms.theatre === "leeds" && (
            <input type="hidden" name="fixedRent" value={terms.fixedRent} />
          )}
          {terms.theatre === "london" && (
            <input type="hidden" name="fixedRent" value={terms.fixedRent} />
          )}
          {terms.theatre === "hull" && (
            <>
              <input type="hidden" name="productionShare" value="85" />
              <input type="hidden" name="theatreShare" value="15" />
            </>
          )}
          {terms.theatre === "hull" && (
            <div className="mt-4 rounded-lg border border-[#ddd6ca] p-3">
              <label className="portal-field">
                <span>
                  {terms.theatre === "hull"
                    ? "Additional theatre deduction"
                    : "Theatre deduction"}
                </span>
                <select
                  name="theatreDeductionType"
                  value={deductionType}
                  onChange={(event) =>
                    setDeductionType(
                      event.target.value as "fixed" | "percentage",
                    )
                  }
                >
                  <option value="fixed">Fixed pound amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </label>
              {deductionType === "fixed" ? (
                <label className="portal-field mt-3">
                  <span>Deduction amount (£)</span>
                  <input
                    name="theatreDeductionAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={terms.theatreDeductionAmount}
                  />
                </label>
              ) : (
                <TermsNumber
                  label="Deduction percentage"
                  name="theatreDeductionRate"
                  value={terms.theatreDeductionRate}
                />
              )}
            </div>
          )}
          <TheatreAdjustments terms={terms} />
      </>
      <div className="mt-4 border-t border-[#ddd6ca] pt-3 text-xs leading-5 text-[#69756d]">
        <p>VAT removed at 20%</p>
        <p>Royalty: 16%</p>
        <p>Credit-card and ticket commissions: 5% of gross</p>
        <p>Producer profit: 40%</p>
      </div>
      <p className="mt-4 text-xs text-[#758078]">
        Last updated:{" "}
        {terms.updatedAt
          ? new Date(terms.updatedAt).toLocaleString("en-GB")
          : "Using default terms"}
      </p>
      <button className="portal-button mt-4 w-full" disabled={busy}>
        Save {name} Terms
      </button>
    </form>
  );
}

function TheatreAdjustments({ terms }: { terms: TheatreTerms }) {
  return (
    <>
      <label className="portal-field mt-4">
        <span>Refunds (£)</span>
        <input
          name="refunds"
          type="number"
          min="0"
          step="0.01"
          defaultValue={terms.refunds}
        />
      </label>
      <label className="portal-field mt-3">
        <span>Other Approved Deductions (£)</span>
        <input
          name="otherApprovedDeductions"
          type="number"
          min="0"
          step="0.01"
          defaultValue={terms.otherApprovedDeductions}
        />
      </label>
      <label className="portal-field mt-3">
        <span>Other deduction note</span>
        <textarea
          name="otherDeductionNote"
          rows={3}
          defaultValue={terms.otherDeductionNote}
        />
      </label>
    </>
  );
}

function TermsNumber({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: number;
}) {
  return (
    <label className="portal-field">
      <span>{label}</span>
      <input
        name={name}
        type="number"
        min="0"
        max="100"
        step="0.0001"
        defaultValue={value}
      />
    </label>
  );
}
