"use client";

import { useState } from "react";

export function SetFlybyModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-[rgba(214,180,103,0.92)] bg-[radial-gradient(circle_at_32%_30%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_50%_50%,rgba(14,23,17,0.86),rgba(7,12,9,0.96))] shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
      >
        <span className="pointer-events-none absolute inset-[0.5rem] rounded-full border border-[rgba(232,222,203,0.12)]" />
        <span className="pointer-events-none absolute inset-[1.2rem] rounded-full border border-[rgba(200,168,110,0.16)]" />
        <span className="pointer-events-none absolute ml-1 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-[var(--color-gold)] transition duration-300 group-hover:scale-105" />
        <span className="sr-only">Play set fly by</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(6,10,8,0.8)] px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-0 top-[-2.75rem] text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]"
            >
              Close
            </button>

            <div className="rounded-[2rem] border border-[rgba(232,222,203,0.12)] bg-[linear-gradient(180deg,#141a17,#0c120e)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.42)] sm:p-5">
              <div className="rounded-[1.6rem] border border-[rgba(65,74,68,0.82)] bg-[linear-gradient(180deg,#1c241f,#101612)] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-4">
                <div className="mb-3 flex items-center gap-2 px-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(200,168,110,0.7)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(246,241,230,0.18)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(246,241,230,0.18)]" />
                </div>
                <div className="relative overflow-hidden rounded-[1.25rem] border border-[rgba(255,255,255,0.04)] bg-black">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.014)_0,rgba(255,255,255,0.014)_2px,transparent_2px,transparent_4px)] opacity-30" />
                  <video
                    src="/assets/setflyby.mp4"
                    controls
                    autoPlay
                    className="relative z-0 aspect-video w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
