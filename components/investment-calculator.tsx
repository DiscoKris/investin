"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
const totalCapitalisation = 1000000;

const capacityScenarios = [
  { capacity: "100%", projectedProfitPool: 1422768 },
  { capacity: "90%", projectedProfitPool: 1018480 },
  { capacity: "80%", projectedProfitPool: 614208 },
  { capacity: "70%", projectedProfitPool: 10256 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
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

    return capacityScenarios.map((scenario) => {
      const investorShare = submittedAmount / totalCapitalisation;
      const projectedProfit = scenario.projectedProfitPool * investorShare;
      const projectedTotalReturn = submittedAmount + projectedProfit;
      const percentReturn = (projectedProfit / submittedAmount) * 100;

      return {
        ...scenario,
        projectedProfit,
        projectedTotalReturn,
        percentReturn,
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
    setInvestmentInput(formatCurrency(parsedValue));
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="card-panel rounded-[2.2rem] border border-[rgba(232,222,203,0.12)] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="headline text-[2.4rem] text-[var(--color-ivory)] sm:text-[3rem] lg:text-[3.6rem]">
            Explore your investment potential....
          </p>
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
            placeholder="Enter your investment number"
            className="w-full rounded-[1.6rem] border border-[rgba(232,222,203,0.16)] bg-[rgba(246,241,230,0.06)] px-6 py-5 text-center text-[1.2rem] text-[var(--color-ivory)] outline-none placeholder:text-[rgba(246,241,230,0.45)]"
          />
          {error ? (
            <p className="mt-3 text-center text-sm text-[#f4c7a0]">{error}</p>
          ) : null}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleCalculate}
              className="inline-flex items-center justify-center rounded-full border border-[rgba(200,168,110,0.44)] bg-[linear-gradient(180deg,rgba(244,236,222,0.9),rgba(223,209,183,0.88))] px-8 py-4 text-center text-[0.86rem] font-semibold uppercase tracking-[0.2em] text-[#253124] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(200,168,110,0.72)] hover:bg-[linear-gradient(180deg,rgba(247,241,230,0.96),rgba(230,217,192,0.92))] sm:px-12 sm:py-5 sm:text-[0.95rem]"
            >
              Calculate Projected Profit
            </button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-10">
            <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(232,222,203,0.12)] bg-[rgba(8,14,10,0.2)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(232,222,203,0.12)] bg-[rgba(246,241,230,0.04)]">
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Capacity
                      </th>
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Projected Total Return
                      </th>
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        Projected Profit
                      </th>
                      <th className="px-4 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:px-6">
                        % Return
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result.capacity}
                        className="border-b border-[rgba(232,222,203,0.08)] last:border-b-0"
                      >
                        <td className="px-4 py-5 text-[1rem] font-medium text-[var(--color-gold)] sm:px-6">
                          {result.capacity}
                        </td>
                        <td className="px-4 py-5 text-[1rem] text-[var(--color-cream)] sm:px-6">
                          {formatCurrency(result.projectedTotalReturn)}
                        </td>
                        <td className="px-4 py-5 text-[1rem] text-[var(--color-mist)] sm:px-6">
                          {formatCurrency(result.projectedProfit)}
                        </td>
                        <td className="px-4 py-5 text-[1rem] text-[var(--color-mist)] sm:px-6">
                          {formatPercent(result.percentReturn)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[rgba(232,222,203,0.12)] px-5 py-5 sm:px-6">
                <p className="text-sm leading-7 text-[var(--color-mist)]">
                  For illustrative purposes only. Not financial advice. Final
                  returns depend on actual box office performance, costs,
                  recoupment position and formal investment documents.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-[1.8rem] border border-dashed border-[rgba(232,222,203,0.14)] px-5 py-10 text-center sm:px-6">
            <p className="text-sm leading-7 text-[var(--color-mist)]">
              Enter an amount and calculate projected return and profit across
              various scenarios.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/story"
            className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-[rgba(210,178,116,0.46)] bg-[linear-gradient(180deg,rgba(248,241,229,0.96),rgba(229,216,191,0.92))] px-10 py-4 text-center text-[0.88rem] font-semibold uppercase tracking-[0.24em] text-[#263224] shadow-[0_14px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,250,240,0.14)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,178,116,0.76)] hover:bg-[linear-gradient(180deg,rgba(250,244,234,0.98),rgba(235,223,199,0.94))] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24),0_0_0_1px_rgba(255,250,240,0.2)_inset] sm:min-w-[15rem] sm:px-11 sm:py-5 sm:text-[0.92rem]"
          >
            Continue
          </Link>
        </div>
      </section>
    </div>
  );
}
