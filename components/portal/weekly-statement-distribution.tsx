"use client";

import { useEffect, useRef, useState } from "react";
import { authenticatedAdminFetch } from "@/lib/portal/admin-auth-client";

type Failure = {
  investor: string;
  accountNumber: string;
  reason: string;
};

type Summary = {
  successfulCount: number;
  failedCount: number;
  skippedCount: number;
  failures: Failure[];
  testMode: boolean;
};

type Overview = {
  recipientCount: number;
  skippedCount: number;
  providerConfigured: boolean;
  latest: null | {
    timestamp: string | null;
    successfulCount: number;
    failedCount: number;
    skippedCount: number;
  };
};

const EMPTY_OVERVIEW: Overview = {
  recipientCount: 0,
  skippedCount: 0,
  providerConfigured: false,
  latest: null,
};

async function readError(response: Response) {
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  return data.error || "Unable to distribute biweekly statements.";
}

export function WeeklyStatementDistribution({
  disabled = false,
  onComplete,
}: {
  disabled?: boolean;
  onComplete?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [overview, setOverview] = useState(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);

  const openConfirmation = async () => {
    setOpen(true);
    setLoading(true);
    setError("");
    setSummary(null);
    try {
      const response = await authenticatedAdminFetch(
        "/api/admin/weekly-statements",
      );
      if (!response.ok) throw new Error(await readError(response));
      setOverview((await response.json()) as Overview);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const distribute = async (mode: "live" | "test") => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setCompleted(0);
    setTotal(mode === "test" ? 1 : overview.recipientCount);
    setError("");
    setSummary(null);
    try {
      const response = await authenticatedAdminFetch(
        "/api/admin/weekly-statements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode }),
        },
      );
      if (!response.ok) throw new Error(await readError(response));
      if (!response.body) throw new Error("No distribution response was received.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            type: string;
            total?: number;
            completed?: number;
            successfulCount?: number;
            failedCount?: number;
            skippedCount?: number;
            failures?: Failure[];
            testMode?: boolean;
          };
          if (event.total !== undefined) setTotal(event.total);
          if (event.completed !== undefined) setCompleted(event.completed);
          if (event.type === "complete") {
            setSummary({
              successfulCount: event.successfulCount || 0,
              failedCount: event.failedCount || 0,
              skippedCount: event.skippedCount || 0,
              failures: event.failures || [],
              testMode: Boolean(event.testMode),
            });
          }
        }
        if (done) break;
      }
      await onComplete?.();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="portal-button"
        disabled={disabled || sending}
        onClick={() => void openConfirmation()}
      >
        {sending ? "Sending…" : "Send biweekly statements"}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !sending) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="weekly-statements-title"
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <p className="portal-kicker">Investor distribution</p>
            <h2 id="weekly-statements-title" className="mt-1 text-xl font-semibold text-[#183627]">
              {summary && !summary.testMode
                ? "Biweekly statements sent"
                : summary?.testMode
                  ? "Test statement sent"
                  : "Send biweekly statements?"}
            </h2>

            {loading ? (
              <p className="mt-5 text-sm text-[#647168]" role="status">
                Checking eligible investors…
              </p>
            ) : summary ? (
              <div className="mt-5 space-y-4 text-sm text-[#4d5d53]">
                <div className="grid grid-cols-3 gap-3">
                  <Result label="Sent" value={summary.successfulCount} />
                  <Result label="Skipped" value={summary.skippedCount} />
                  <Result label="Failed" value={summary.failedCount} />
                </div>
                {summary.failures.length > 0 && (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-[#e1c3bd] bg-[#fff5f3] p-3">
                    <p className="font-semibold text-[#7f342c]">Delivery failures</p>
                    <ul className="mt-2 space-y-2">
                      {summary.failures.map((failure) => (
                        <li key={`${failure.accountNumber}-${failure.reason}`}>
                          {failure.investor} — {failure.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 text-sm leading-6 text-[#4d5d53]">
                <p>
                  This will email the latest personalized investor statement to all active investors.
                </p>
                <p className="mt-4 font-semibold text-[#183627]">
                  Recipients: {overview.recipientCount}
                </p>
                <p className="mt-3">The following are excluded:</p>
                <ul className="ml-5 mt-1 list-disc">
                  <li>Test investors</li>
                  <li>Inactive investors</li>
                  <li>Investors without a valid email address</li>
                </ul>
                {!overview.providerConfigured && !error && (
                  <p className="mt-4 rounded-lg border border-[#dfc88e] bg-[#fff8e6] p-3 text-[#765b20]">
                    Email delivery needs server configuration before statements can be sent.
                  </p>
                )}
              </div>
            )}

            {sending && (
              <div className="mt-5" role="status" aria-live="polite">
                <div className="h-2 overflow-hidden rounded-full bg-[#e4e7e2]">
                  <div
                    className="h-full bg-[#315d43] transition-[width]"
                    style={{ width: `${total ? (completed / total) * 100 : 5}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-[#315d43]">
                  {completed === 0 ? "Preparing statements…" : `${completed} of ${total} sent`}
                </p>
              </div>
            )}
            {error && (
              <p className="mt-5 rounded-lg border border-[#d5aaa3] bg-[#fff1ee] p-3 text-sm text-[#872f26]" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {summary ? (
                <button type="button" className="portal-button sm:col-span-2" onClick={() => setOpen(false)}>
                  Close
                </button>
              ) : (
                <>
                  <button type="button" className="portal-button portal-button-secondary" disabled={sending} onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                  <button type="button" className="portal-button" disabled={loading || sending || !overview.providerConfigured || overview.recipientCount === 0} onClick={() => void distribute("live")}>
                    {sending ? "Sending…" : "Send statements"}
                  </button>
                  <button type="button" className="portal-button portal-button-secondary sm:col-span-2" disabled={loading || sending || !overview.providerConfigured || overview.recipientCount === 0} onClick={() => void distribute("test")}>
                    Send test to me
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Result({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#f4f2ec] p-3 text-center">
      <strong className="block text-xl text-[#183627]">{value}</strong>
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function LatestWeeklyDistribution() {
  const [overview, setOverview] = useState<Overview | null>(null);
  useEffect(() => {
    let active = true;
    authenticatedAdminFetch("/api/admin/weekly-statements")
      .then(async (response) => {
        if (response.ok && active) {
          const value = (await response.json()) as Overview;
          if (active) setOverview(value);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  if (!overview?.latest) return null;
  return (
    <section className="portal-card p-5 sm:p-6">
      <p className="portal-kicker">Last biweekly distribution</p>
      <h2 className="mt-1 text-lg font-semibold text-[#183627]">
        {overview.latest.timestamp
          ? new Date(overview.latest.timestamp).toLocaleString("en-GB", {
              dateStyle: "long",
              timeStyle: "short",
            })
          : "Recently completed"}
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Result label="Sent" value={overview.latest.successfulCount} />
        <Result label="Skipped" value={overview.latest.skippedCount} />
        <Result label="Failed" value={overview.latest.failedCount} />
      </div>
    </section>
  );
}
