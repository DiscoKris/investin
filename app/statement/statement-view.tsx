"use client";

import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/portal/logout-button";
import { InvestorAccountMenu } from "@/components/portal/investor-account-menu";
import { StatementActions } from "@/components/portal/statement-actions";
import {
  ensureAuthPersistence,
  getFirebaseAuth,
  getPortalAccess,
} from "@/lib/portal/firebase-client";
import {
  getClientCurrentStatement,
  getClientIssuedStatement,
} from "@/lib/portal/client-store";
import { getInvestorAddress } from "@/lib/portal/address";
import {
  currencyMoney,
  formatTswlUnits,
  investorCurrency,
  investorGbpBasis,
  investorValuation,
  investorOriginalAmount,
  investorReportingValue,
  maskAccountNumber,
  money,
  signedCurrencyMoney,
  signedMoney,
} from "@/lib/portal/finance";
import {
  OPERATIONAL_COST_PER_WEEK,
  TSWL_UNIT_SIZE,
} from "@/lib/portal/constants";
import type { StatementSnapshot } from "@/lib/portal/types";

export function StatementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedInvestor = searchParams.get("investor");
  const [admin, setAdmin] = useState(false);
  const [statement, setStatement] = useState<StatementSnapshot | null>();

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    let active = true;
    void ensureAuthPersistence().then(() => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        const access = await getPortalAccess(user).catch(() => null);
        if (!access) {
          router.replace("/login");
          return;
        }
        if (access === "admin") {
          if (!requestedInvestor) {
            router.replace("/admin");
            return;
          }
          const current = await getClientCurrentStatement(requestedInvestor);
          if (active) {
            setAdmin(true);
            setStatement(current);
          }
          return;
        }
        if (requestedInvestor) {
          router.replace("/statement");
          return;
        }
        const issued = await getClientIssuedStatement(user.uid);
        if (active) setStatement(issued);
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [requestedInvestor, router]);

  if (statement === undefined) {
    return (
      <div className="portal-page flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-[#647168]" role="status">
          Checking statement access…
        </p>
      </div>
    );
  }

  if (statement === null) {
    return (
      <div className="portal-page flex min-h-screen items-center justify-center p-6">
        <section className="portal-card max-w-lg p-8 text-center">
          <h1 className="text-2xl font-semibold">Statement unavailable</h1>
          <p className="mt-3 text-sm text-[#69736d]">
            Your investor record has not yet been issued. Please contact the production office.
          </p>
          <div className="mt-6 flex justify-center">
            {admin ? (
              <LogoutButton className="portal-button" />
            ) : (
              <InvestorAccountMenu />
            )}
          </div>
        </section>
      </div>
    );
  }
  const { investor } = statement;
  const totalPotential = statement.theatres.reduce((sum, item) => sum + item.potential, 0);
  const totalActual = statement.theatres.reduce((sum, item) => sum + item.actual, 0);
  const weeklyChanges = statement.theatres.map((item) => item.weeklyChange);
  const totalWeeklyChange = weeklyChanges.every(
    (value): value is number => typeof value === "number",
  )
    ? weeklyChanges.reduce((sum, value) => sum + (value ?? 0), 0)
    : null;
  const currentUnitPrice = statement.settings.currentUnitPrice;
  const currency = investorCurrency(investor);
  const originalInvestmentGBP = investorGbpBasis(investor);
  const originalInvestmentAmount = investorOriginalAmount(investor);
  const reportingExchangeRate = statement.settings.gbpUsdExchangeRate;
  const currentValuationGBP = investorValuation(
    originalInvestmentGBP,
    currentUnitPrice,
  );
  const currentValuation = investorReportingValue(
    currentValuationGBP,
    investor,
    reportingExchangeRate,
  );
  const pricePaid =
    currency === "USD"
      ? TSWL_UNIT_SIZE * (investor.investmentExchangeRate || reportingExchangeRate)
      : TSWL_UNIT_SIZE;
  const todayPrice = investorReportingValue(
    currentUnitPrice,
    investor,
    reportingExchangeRate,
  );
  const totalGain = currentValuation - originalInvestmentAmount;
  const params = admin ? `?investor=${requestedInvestor}` : "";

  return (
    <div className="portal-page min-h-screen px-4 py-6 sm:px-7 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
          {admin ? (
            <Link href="/admin" className="text-sm font-semibold text-[#335840]">← Back to administration</Link>
          ) : <span />}
          <div className="flex items-center gap-4">
            <StatementActions pdfHref={`/api/statement/pdf${params}`} />
            {admin ? (
              <LogoutButton className="text-xs font-bold uppercase tracking-wider text-[#31533e]" />
            ) : (
              <InvestorAccountMenu />
            )}
          </div>
        </div>
        <article className="border border-[#d6d0c4] bg-[#fffefa] p-6 shadow-xl sm:p-10 lg:p-14">
          <header className="border-b-2 border-[#244532] pb-8">
            <div className="mx-auto flex w-full max-w-sm justify-center rounded-lg bg-[#173b29] px-8 py-4">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love — A New Musical"
                width={244}
                height={150}
                className="h-auto w-44"
                priority
              />
            </div>
            <h1 className="mt-5 text-center text-3xl font-semibold uppercase tracking-[0.08em] text-[#183829]">
              Investor Statement
            </h1>
            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <address className="not-italic text-sm leading-6 text-[#4f5e55]">
                <strong className="block text-base text-[#243e2f]">{investor.fullName}</strong>
                <span className="block whitespace-pre-wrap">
                  {getInvestorAddress(investor)}
                </span>
                {investor.email}
              </address>
              <p className="mt-4 text-xs text-[#718078]">
                <strong>Last login</strong><br />
                {investor.lastLoginAt ? new Date(investor.lastLoginAt).toLocaleString("en-GB") : "First access"}
              </p>
              </div>
              <dl className="grid min-w-52 content-start gap-4 text-sm">
                <StatementLabel label="Statement date" value={new Date(statement.statementDate).toLocaleDateString("en-GB")} />
                <StatementLabel label="Account number" value={maskAccountNumber(investor.accountNumber)} />
                <StatementLabel label="Investor status" value={investor.investorStatus} />
                {investor.isTest && <StatementLabel label="Box office status" value="Awaiting Opening Performance" />}
              </dl>
            </div>
          </header>

          {statement.settings.executiveUpdate?.trim() && (
            <section className="border-b border-[#d9d3c8] py-6">
              <p className="portal-kicker">Executive Update</p>
              <p className="mt-2 break-words text-sm leading-6 text-[#4f5e55]">
                {statement.settings.executiveUpdate.trim()}
              </p>
            </section>
          )}

          <section className="py-8">
            <p className="portal-kicker">Production summary</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SummaryBox label="Total Capitalization" value={money(statement.settings.totalCapitalization)} />
              <SummaryBox label="Operational Cost Per Week (6)" value={money(OPERATIONAL_COST_PER_WEEK)} />
            </div>
          </section>

          <section>
            <h2 className="border-b border-[#d9d3c8] pb-3 text-lg font-semibold text-[#1d3d2c]">Theatre box office</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-sm">
                <thead className="text-left text-[0.65rem] uppercase tracking-wider text-[#738077]">
                  <tr><th className="py-3">Theatre</th><th className="py-3 text-right">Performances</th><th className="py-3 text-right">Current gross</th><th className="py-3 text-right">Current net</th><th className="py-3 text-right">Change since previous statement</th><th className="py-3 text-right">Goal</th></tr>
                </thead>
                <tbody className="divide-y divide-[#e5e0d7]">
                  {statement.theatres.map((theatre) => (
                    <tr key={theatre.id}>
                      <td className="py-4 font-semibold uppercase text-[#274633]">{theatre.name}</td>
                      <td className="py-4 text-right tabular-nums">{theatre.performances}</td>
                      <td className="py-4 text-right font-semibold tabular-nums">{money(theatre.actual)}</td>
                      <td className="py-4 text-right font-semibold tabular-nums">{money(theatre.net)}</td>
                      <td className="py-4 text-right tabular-nums">{signedMoney(theatre.weeklyChange)}</td>
                      <td className="py-4 text-right tabular-nums">{money(theatre.potential)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#b9b1a2] font-bold">
                    <td className="py-4">Total</td><td className="py-4 text-right">{statement.theatres.reduce((sum, theatre) => sum + theatre.performances, 0)}</td><td className="py-4 text-right">{money(totalActual)}</td><td className="py-4 text-right">{money(statement.financialSummary.totalNet)}</td><td className="py-4 text-right">{signedMoney(totalWeeklyChange)}</td><td className="py-4 text-right">{money(totalPotential)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="border-b border-[#d9d3c8] pb-3 text-lg font-semibold text-[#1d3d2c]">Investor summary</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b border-[#d9d3c8] text-left text-[0.62rem] uppercase tracking-wider text-[#738077]">
                  <tr><th className="py-3">Symbol</th><th className="py-3 text-right">Units</th><th className="py-3 text-right">Original investment</th><th className="py-3 text-right">Price paid</th><th className="py-3 text-right">Today&apos;s price</th><th className="py-3 text-right">Current valuation</th><th className="py-3 text-right">Total gain</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e1dcd2]">
                    <td className="py-4 font-semibold text-[#274633]">TSWL</td>
                    <td className="py-4 text-right tabular-nums">{formatTswlUnits(originalInvestmentGBP)}</td>
                    <td className="py-4 text-right tabular-nums">{currencyMoney(originalInvestmentAmount, currency)}</td>
                    <td className="py-4 text-right tabular-nums">{currencyMoney(pricePaid, currency)}</td>
                    <td className="py-4 text-right font-semibold tabular-nums">{currencyMoney(todayPrice, currency)}</td>
                    <td className="py-4 text-right font-semibold tabular-nums">{currencyMoney(currentValuation, currency)}</td>
                    <td className="py-4 text-right font-semibold tabular-nums">{signedCurrencyMoney(totalGain, currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <dl className="mt-4">
              <div className="rounded-lg bg-[#193d2a] p-5 text-white">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/65">Current statement value</dt>
                <dd className="mt-2 text-3xl font-semibold tabular-nums">{currencyMoney(currentValuation, currency)}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-8 border-l-4 border-[#b7934d] bg-[#f5f1e8] p-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#806735]">Valuation basis</p>
            <p className="mt-2 text-sm text-[#4c5b52]">{statement.valuationBasis}</p>
            {currency === "USD" && (
              <div className="mt-3 text-xs leading-5 text-[#5f6b63]">
                <p>Production accounts and TSWL Units are maintained in GBP. Current USD values are converted using the exchange rate set by the Producer for investor reporting.</p>
                <p className="mt-1 font-semibold">Current reporting exchange rate: £1 = ${reportingExchangeRate.toFixed(2)}</p>
              </div>
            )}
          </section>
          <footer className="mt-10 border-t border-[#dcd6ca] pt-5 text-[0.65rem] leading-5 text-[#727b75]">
            “This statement is provided for informational purposes only. The investment is not publicly traded, and the stated value does not represent a guaranteed sale price, return or independently verified market valuation. Future production plans, box-office potential and financial projections are not guarantees of performance.”
          </footer>
        </article>
      </div>
    </div>
  );
}

function StatementLabel({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[0.62rem] font-bold uppercase tracking-wider text-[#778079]">{label}</dt><dd className="mt-1 font-semibold text-[#243f30]">{value}</dd></div>;
}
function SummaryBox({ label, value }: { label: string; value: string }) {
  return <div className="border border-[#ddd6ca] bg-[#faf7f0] p-4"><p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#748078]">{label}</p><p className="mt-2 text-xl font-semibold tabular-nums text-[#1f412e]">{value}</p></div>;
}
