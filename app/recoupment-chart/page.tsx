import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";

const capacities = [
  { label: "100%", accent: "text-[var(--color-gold)]" },
  { label: "90%", accent: "text-[var(--color-gold)]" },
  { label: "80%", accent: "text-[var(--color-gold)]" },
  { label: "65%", accent: "text-[#b6e269]" },
];

const recoupmentRows = [
  {
    label: "Gross Box Office",
    values: ["£ 480,000", "£ 432,000", "£ 384,000", "£312,000"],
    emphasis: false,
  },
  {
    label: "VAT and credit card fees",
    values: ["£ 104,000", "£ 93,600", "£ 83,200", "£67,600"],
    emphasis: false,
  },
  {
    label: "Net Box Office",
    values: ["£ 376,000", "£ 338,400", "£ 300,800", "£244,400"],
    emphasis: true,
  },
  {
    label: "Royalties (16% of Net)",
    values: ["£ 60,160", "£ 54,144", "£ 48,128", "£38,912"],
    emphasis: false,
  },
  {
    label: "Venue Fee (split 80/20)",
    values: ["£ 63,168", "£ 56,851", "£ 50,534", "£41,098"],
    emphasis: false,
  },
  {
    label: "Weekly Surplus",
    values: ["£ 252,672", "£ 227,405", "£ 202,138", "£164,391"],
    emphasis: true,
  },
  {
    label: "Weekly Operating Costs",
    values: ["£ 130,000", "£ 130,000", "£ 130,000", "£130,000"],
    emphasis: false,
  },
  {
    label: "Weekly Profit* (Plus £10k Merch)",
    values: ["£ 132,672", "£ 107,405", "£ 82,138", "£44,391"],
    emphasis: true,
  },
  {
    label: "Total Profit (16 Weeks)",
    values: ["£ 2,122,768", "£ 1,718,480", "£ 1,314,208", "£710,256"],
    emphasis: false,
  },
  {
    label: "Post Recoupment Profit (£1m)",
    values: ["£ 1,122,768", "£ 718,480", "£ 314,208", "-£289,744"],
    emphasis: true,
  },
  {
    label: "Theatre Tax Relief (on 800k)",
    values: ["£ 300,000", "£ 300,000", "£ 300,000", "£300,000"],
    emphasis: false,
  },
  {
    label: "Projected Profit",
    values: ["£ 1,422,768", "£ 1,018,480", "£ 614,208", "£10,256"],
    emphasis: true,
  },
];

const summaryRows = [
  {
    label: "Weekly Box Office Potential",
    qualifier: "@ 100%",
    value: "£ 480,000",
  },
  {
    label: "Total Weekly Operating Costs",
    qualifier: "",
    value: "£ 130,000",
  },
  {
    label: "Total Capitalisation:",
    qualifier: "",
    value: "£1,000,000",
    accent: true,
  },
];

export default function RecoupmentChartPage() {
  return (
    <section className="section-shell py-6 sm:py-8 lg:py-10">
      <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[92rem] items-center">
        <Reveal className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-8 lg:rounded-[2.4rem] lg:px-10 lg:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(255,233,188,0.04),transparent_18%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex flex-col gap-5">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.25rem] sm:w-[8rem]"
              />

              <div className="text-center">
                <h1 className="text-[2.2rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.85rem] lg:text-[4rem]">
                  Recoupment <span className="text-[var(--color-gold)]">Chart</span>
                </h1>
                <p className="mt-3 text-[0.98rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold)] sm:text-[1.05rem] lg:text-[1.1rem]">
                  Assumptions: £50 a ticket, 8 shows a week, 1200 Seat
                  Capacity
                </p>
              </div>
            </div>

            <div className="mx-auto mt-6 w-full max-w-[34rem] rounded-[1.6rem] border border-[rgba(214,180,103,0.62)] bg-[rgba(12,14,13,0.72)] px-6 py-4 shadow-[0_18px_42px_rgba(0,0,0,0.26)] sm:px-8">
              <div className="space-y-2.5">
                {summaryRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-[1rem] leading-[1.2] sm:text-[1.05rem]"
                  >
                    <p
                      className={`${
                        row.accent
                          ? "font-semibold text-[var(--color-gold)]"
                          : "text-[var(--color-ivory)]"
                      }`}
                    >
                      {row.label}
                    </p>
                    <p className="text-[var(--color-cream)]">{row.qualifier}</p>
                    <p
                      className={`text-right font-semibold ${
                        row.accent
                          ? "text-[var(--color-gold)]"
                          : "text-[var(--color-ivory)]"
                      }`}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[1.9rem] border border-[rgba(214,180,103,0.72)] bg-[linear-gradient(90deg,rgba(2,3,3,0.88),rgba(44,44,44,0.72))] px-5 py-6 shadow-[0_20px_46px_rgba(0,0,0,0.3)] sm:px-7 lg:mt-8 lg:px-8 lg:py-7">
              <div className="grid grid-cols-[1.55fr_repeat(4,minmax(0,1fr))] items-end gap-x-6 border-b border-[rgba(232,222,203,0.12)] pb-3">
                <div>
                  <p className="text-[1.06rem] font-semibold uppercase tracking-[0.04em] text-[var(--color-gold)] sm:text-[1.1rem]">
                    Percentage Capacity
                  </p>
                </div>
                {capacities.map((capacity) => (
                  <div key={capacity.label} className="text-center">
                    <p
                      className={`text-[1.18rem] font-bold leading-none sm:text-[1.28rem] ${capacity.accent}`}
                    >
                      {capacity.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1.5">
                {recoupmentRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1.55fr_repeat(4,minmax(0,1fr))] items-center gap-x-6 border-b border-[rgba(232,222,203,0.06)] py-2.5 last:border-b-0"
                  >
                    <p
                      className={`text-[0.98rem] leading-[1.2] sm:text-[1.02rem] ${
                        row.emphasis
                          ? "font-semibold text-[var(--color-gold)]"
                          : "text-[var(--color-cream)]"
                      }`}
                    >
                      {row.label}
                    </p>

                    {row.values.map((value, index) => {
                      const is65 = capacities[index]?.label === "65%";
                      const isNegative = value.startsWith("-");

                      return (
                        <p
                          key={`${row.label}-${capacities[index]?.label}`}
                          className={`text-center text-[0.98rem] leading-[1.2] sm:text-[1.04rem] ${
                            row.emphasis
                              ? "font-semibold"
                              : "font-medium text-[var(--color-cream)]"
                          } ${
                            is65
                              ? isNegative
                                ? "text-[#c9df8d]"
                                : "text-[#b6e269]"
                              : row.emphasis
                                ? "text-[var(--color-gold)]"
                                : "text-[var(--color-cream)]"
                          }`}
                        >
                          {value}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-[rgba(214,180,103,0.22)] bg-[linear-gradient(180deg,rgba(255,244,214,0.05),rgba(8,13,10,0.14))] px-5 py-4 shadow-[0_14px_34px_rgba(0,0,0,0.18)] sm:px-6">
              <p className="text-center text-[0.94rem] leading-[1.65] text-[var(--color-cream)] sm:text-[0.98rem]">
                Investors can elect to roll over both{" "}
                <span className="font-medium text-[var(--color-ivory)]">
                  investment and profits
                </span>{" "}
                into future West End and Broadway productions, subject to
                applicable offering terms and availability.
              </p>
            </div>

            <ContinueButton href="/example-investment" className="lg:mt-8" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
