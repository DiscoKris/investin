"use client";

import { useRef, useState } from "react";
import { authenticatedAdminFetch } from "@/lib/portal/admin-auth-client";
import type { Investor } from "@/lib/portal/types";

export function EmailStatement({
  investor,
  privateNote,
  disabled = false,
  onSent,
}: {
  investor: Investor;
  privateNote: string;
  disabled?: boolean;
  onSent?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const sendingRef = useRef(false);
  const requestIdRef = useRef(crypto.randomUUID());

  async function send() {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setMessage("");
    setError("");
    try {
      const response = await authenticatedAdminFetch(
        "/api/admin/weekly-statements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "individual",
            investorUid: investor.uid,
            requestId: requestIdRef.current,
            privateNote,
          }),
        },
      );
      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(result.error || "Unable to email the statement.");
      }
      if (!response.body) throw new Error("No email response was received.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sent = false;
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            type?: string;
            successfulCount?: number;
            failures?: Array<{ reason?: string }>;
          };
          if (event.type === "complete") {
            sent = event.successfulCount === 1;
            if (!sent) {
              throw new Error(
                event.failures?.[0]?.reason || "Email delivery failed.",
              );
            }
          }
        }
        if (done) break;
      }
      if (!sent) throw new Error("Email delivery was not confirmed.");
      setMessage(`Statement emailed successfully to ${investor.email}`);
      requestIdRef.current = crypto.randomUUID();
      try {
        await onSent?.();
      } catch {
        // Delivery succeeded even if refreshing the history view did not.
      }
    } catch (caught) {
      setError((caught as Error).message || "Unable to email the statement.");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="portal-button"
        disabled={disabled || sending || !investor.email}
        onClick={() => {
          requestIdRef.current = crypto.randomUUID();
          setMessage("");
          setError("");
          setOpen(true);
        }}
      >
        {sending ? "Sending…" : "Send email"}
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
            aria-labelledby="email-statement-title"
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <p className="portal-kicker">Email investor statement</p>
            <h2 id="email-statement-title" className="mt-1 text-xl font-semibold text-[#183627]">
              Email investor statement
            </h2>
            <p className="mt-4 text-sm text-[#4d5d53]">Send the current statement to:</p>
            <p className="mt-2 text-base font-semibold text-[#183627]">
              {investor.fullName}
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-[#31533e]">
              {investor.email}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#4d5d53]">
              A PDF copy of the current investor statement will be attached.
            </p>
            {message && (
              <p className="mt-5 rounded-lg border border-[#bad0bf] bg-[#edf8ef] p-3 text-sm text-[#285e36]" role="status">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-5 rounded-lg border border-[#d5aaa3] bg-[#fff1ee] p-3 text-sm text-[#872f26]" role="alert">
                {error}
              </p>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" className="portal-button portal-button-secondary" disabled={sending} onClick={() => setOpen(false)}>
                {message ? "Close" : "Cancel"}
              </button>
              {!message && (
                <button type="button" className="portal-button" disabled={sending} onClick={() => void send()}>
                  {sending ? "Sending…" : "Send email"}
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
