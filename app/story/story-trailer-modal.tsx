"use client";

import { useState } from "react";

export function StoryTrailerModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-[rgba(200,168,110,0.44)] bg-[linear-gradient(180deg,rgba(244,236,222,0.9),rgba(223,209,183,0.88))] px-8 py-4 text-center text-[0.86rem] font-semibold uppercase tracking-[0.2em] text-[#253124] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(200,168,110,0.72)] hover:bg-[linear-gradient(180deg,rgba(247,241,230,0.96),rgba(230,217,192,0.92))] sm:px-10 sm:py-5 sm:text-[0.92rem]"
      >
        Watch Trailer
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(6,10,8,0.78)] px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-0 top-[-2.75rem] text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]"
            >
              Close
            </button>

            <div className="rounded-[2rem] border border-[rgba(232,222,203,0.12)] bg-[linear-gradient(180deg,#121916,#0b110d)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:p-5">
              <div className="rounded-[1.6rem] border border-[rgba(65,74,68,0.82)] bg-[linear-gradient(180deg,#212824,#111714)] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-4">
                <div className="mb-3 flex items-center gap-2 px-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(200,168,110,0.7)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(246,241,230,0.18)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(246,241,230,0.18)]" />
                </div>
                <div className="relative overflow-hidden rounded-[1.25rem] border border-[rgba(255,255,255,0.04)] bg-black">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_2px,transparent_2px,transparent_4px)] opacity-35" />
                  <video
                    src="/assets/trailer.mp4"
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
