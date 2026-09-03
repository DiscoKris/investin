"use client";

import { useState } from "react";
import { getFirebaseAuth } from "@/lib/portal/firebase-client";

export function StatementActions({ pdfHref }: { pdfHref: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    try {
      const auth = getFirebaseAuth();
      await auth.authStateReady();
      const user = auth.currentUser;
      if (!user) throw new Error("Please sign in again.");
      const response = await fetch(pdfHref, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      if (!response.ok) throw new Error("Unable to download the statement.");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "TSWL-investor-statement.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="portal-button portal-button-secondary"
      >
        Print / Save PDF
      </button>
      <button
        className="portal-button flex items-center justify-center"
        disabled={busy}
        onClick={download}
        type="button"
      >
        {busy ? "Preparing…" : "Download PDF"}
      </button>
      {error && <p className="w-full text-xs text-[#872f26]" role="alert">{error}</p>}
    </div>
  );
}
