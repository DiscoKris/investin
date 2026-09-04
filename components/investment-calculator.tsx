"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  capitalRequirement,
  calculateInvestorProjection,
  calculatorScenarios,
  formatGbp,
  productionBreakEvenPercentage,
} from "@/lib/commercial-model";
import { InvestmentThesis } from "@/components/investment-thesis";

const formatInputCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(value);

const parseInvestmentValue = (value: string) =>
  Number(value.replace(/[^\d.]/g, ""));

export function InvestmentCalculator() {
  const [investmentInput, setInvestmentInput] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const results = useMemo(() => {
    if (!submittedAmount || Number.isNaN(submittedAmount) || submittedAmount <= 0) {
      return [];
    }

    return calculatorScenarios.map((scenario) => {
      return {
        ...scenario,
        ...calculateInvestorProjection(submittedAmount, scenario),
      };
    });
  }, [submittedAmount]);

  const handleCalculate = () => {
    const parsedValue = parseInvestmentValue(investmentInput);

    if (!investmentInput.trim() || Number.isNaN(parsedValue) || parsedValue <= 0) {
      setSubmittedAmount(null);
      setError("Please enter a valid investment amount.");
      return;
    }

    setError("");
    setSubmittedAmount(parsedValue);
    setInvestmentInput(formatInputCurrency(parsedValue));
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <InvestmentThesis />
      <section className="card-panel rounded-[1.6rem] border border-[rgba(232,222,203,0.12)] px-5 py-7 sm:rounded-[2.2rem] sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="headline text-[clamp(2rem,11vw,2.4rem)] text-[var(--color-ivory)] sm:text-[3rem] lg:text-[3.6rem]">
            Explore your investment potential…
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <label
            htmlFor="investment-number"
            className="mb-3 block text-center text-[0.8rem] font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]"
          >
            Investment Amount
          </label>
          <input
            id="investment-number"
            type="text"
            inputMode="decimal"
            value={investmentInput}
            onChange={(event) => {
              setInvestmentInput(event.target.value);
              if (error) {
                setError("");
              }
            }}
            autoComplete="off"
            aria-describedby={error ? "investment-error" : "investment-note"}
            placeholder="e.g. £24,000"
            className="min-h-14 w-full rounded-[1.25rem] border border-[rgba(232,222,203,0.16)] bg-[rgba(246,241,230,0.06)] px-4 py-4 text-center text-[1.1rem] text-[var(--color-ivory)] outline-none placeholder:text-[rgba(246,241,230,0.45)] focus:border-[rgba(200,168,110,0.58)] sm:rounded-[1.6rem] sm:px-6 sm:py-5 sm:text-[1.2rem]"
          />
          {error ? (
            <p id="investment-error" className="mt-3 text-center text-sm text-[#f4c7a0]">{error}</p>
          ) : null}
          <p id="investment-note" className="mt-3 text-center text-sm leading-6 text-[var(--color-mist)]">
            Enter a GBP amount to compare five projected capacity scenarios,
            including a transparent 50% downside case.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleCalculate}
              className="mobile-action inline-flex items-center justify-center rounded-full border border-[rgba(200,168,110,0.44)] bg-[linear-gradient(180deg,rgba(244,236,222,0.9),rgba(223,209,183,0.88))] px-5 py-4 text-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#253124] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(200,168,110,0.72)] hover:bg-[linear-gradient(180deg,rgba(247,241,230,0.96),rgba(230,217,192,0.92))] sm:px-12 sm:py-5 sm:text-[0.95rem] sm:tracking-[0.2em]"
            >
              Calculate Projected Outcome
            </button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-10">
            <div aria-live="polite" className="mb-5 rounded-[1.4rem] border border-[rgba(200,168,110,0.34)] bg-[rgba(200,168,110,0.08)] p-5 text-center md:hidden">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                100% capacity projected total cash returned
              </p>
              <p className="mt-2 text-[2rem] font-semibold leading-none text-[var(--color-ivory)]">
                {formatGbp(results[0].projectedTotalReturn)}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-cream)]">
                Includes {formatGbp(results[0].capitalReturned)} capital
                returned and {formatGbp(results[0].projectedProfit)} potential
                profit ({formatPercent(results[0].percentReturn)}% profit on capital).
              </p>
            </div>

            <div className="grid gap-4 md:hidden">
              {results.map((result) => (
                <article
                  key={result.label}
                  className="rounded-[1.4rem] border border-[rgba(232,222,203,0.12)] bg-[rgba(8,14,10,0.24)] p-5"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[rgba(232,222,203,0.1)] pb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
                      Capacity
                    </h2>
                    <p className="text-xl font-semibold text-[var(--color-ivory)]">
                      {result.label}
                    </p>
                  </div>
                  <dl className="mt-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm leading-6 text-[var(--color-mist)]">Total cash returned</dt>
                      <dd className="text-right font-semibold text-[var(--color-ivory)]">{formatGbp(result.projectedTotalReturn)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm leading-6 text-[var(--color-mist)]">Capital returned</dt>
                      <dd className="text-right text-[var(--color-cream)]">{formatGbp(result.capitalReturned)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm leading-6 text-[var(--color-mist)]">Potential profit</dt>
                      <dd className={`text-right ${result.projectedProfit < 0 ? "font-semibold text-[#f0b48f]" : "text-[var(--color-cream)]"}`}>{formatGbp(result.projectedProfit)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(232,222,203,0.12)] bg-[rgba(8,14,10,0.2)]">
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(232,222,203,0.12)] bg-[rgba(246,241,230,0.04)]">
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Capacity
                      </th>
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Total Cash Returned
                      </th>
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Capital Returned
                      </th>
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Potential Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result.label}
                        className="border-b border-[rgba(232,222,203,0.08)] last:border-b-0"
                      >
                        <td className="px-4 py-5 text-[1rem] font-medium text-[var(--color-gold)] sm:px-6">
                          {result.label}
                        </td>
                        <td className="px-4 py-5 text-[1rem] text-[var(--color-cream)] sm:px-6">
                          {formatGbp(result.projectedTotalReturn)}
                        </td>
                        <td className="px-4 py-5 text-[1rem] text-[var(--color-mist)] sm:px-6">
                          {formatGbp(result.capitalReturned)}
                        </td>
                        <td className="px-4 py-5 text-[1rem] text-[var(--color-mist)] sm:px-6">
                          <span className={result.projectedProfit < 0 ? "font-semibold text-[#f0b48f]" : ""}>{formatGbp(result.projectedProfit)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[rgba(232,222,203,0.12)] px-5 py-5 sm:px-6">
                <p className="text-base leading-7 text-[var(--color-mist)]">
                  Calculations are illustrative and based on the current
                  {` ${formatGbp(capitalRequirement)} World Premiere model `}
                  across Leeds, Hull and London. Capital recoupment is allocated
                  among new investors by accepted new capital; post-recoupment
                  profit is allocated by Units across all Units then outstanding.
                  Calculator scenarios assume the £750,000 Offering is fully
                  subscribed, with 925 total Participation Units outstanding. The{" "}
                  modeled {productionBreakEvenPercentage} recoupment point includes
                  estimated UK Theatre Tax Relief, subject to qualifying
                  expenditure and a successful claim. Not financial advice.
                  Final returns depend on actual box office performance, costs,
                  Theatre Tax Relief, and formal investment documents.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-[1.8rem] border border-dashed border-[rgba(232,222,203,0.14)] px-5 py-10 text-center sm:px-6">
            <p className="text-base leading-7 text-[var(--color-mist)]">
              Enter an amount to calculate capital returned, potential profit
              or loss, and total cash returned across the modelled scenarios.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/story"
            className="mobile-action inline-flex items-center justify-center rounded-full border border-[rgba(210,178,116,0.46)] bg-[linear-gradient(180deg,rgba(248,241,229,0.96),rgba(229,216,191,0.92))] px-5 py-4 text-center text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#263224] shadow-[0_14px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,250,240,0.14)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,178,116,0.76)] hover:bg-[linear-gradient(180deg,rgba(250,244,234,0.98),rgba(235,223,199,0.94))] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24),0_0_0_1px_rgba(255,250,240,0.2)_inset] sm:min-w-[15rem] sm:px-11 sm:py-5 sm:text-[0.92rem] sm:tracking-[0.16em]"
          >
            I’M INTERESTED — TELL ME MORE
          </Link>
        </div>
      </section>
    </div>
  );
}
