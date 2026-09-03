import type { Metadata } from "next";
import { Suspense } from "react";
import { StatementView } from "./statement-view";

export const metadata: Metadata = {
  title: "Investor Statement",
  robots: { index: false, follow: false },
};

export default function StatementPage() {
  return (
    <Suspense
      fallback={
        <div className="portal-page flex min-h-screen items-center justify-center p-6">
          <p className="text-sm text-[#647168]" role="status">
            Checking statement access…
          </p>
        </div>
      }
    >
      <StatementView />
    </Suspense>
  );
}
