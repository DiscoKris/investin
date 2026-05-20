"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function SizzleAutoAdvance() {
  const router = useRouter();
  const hasNavigated = useRef(false);

  const handleAdvance = () => {
    if (hasNavigated.current) {
      return;
    }

    hasNavigated.current = true;
    router.push("/legacy");
  };

  return (
    <div className="relative min-h-[calc(100svh-8rem)] overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(8,12,10,0.52)] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(3,7,5,0.2),rgba(3,7,5,0.42))]" />

      <div className="relative aspect-video min-h-[calc(100svh-8rem)] w-full">
        <video
          src="/assets/trailer.mp4"
          autoPlay
          muted
          playsInline
          controls
          onEnded={handleAdvance}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <Link
          href="/legacy"
          className="text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-gold)] transition duration-200 hover:opacity-80"
        >
          Skip
        </Link>
      </div>
    </div>
  );
}
