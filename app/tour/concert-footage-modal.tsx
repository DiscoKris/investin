"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function ConcertFootageModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mobile-action inline-flex items-center justify-center rounded-full border border-[rgba(210,178,116,0.46)] bg-[linear-gradient(180deg,rgba(248,241,229,0.96),rgba(229,216,191,0.92))] px-5 py-4 text-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#263224] shadow-[0_14px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,250,240,0.14)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,178,116,0.76)] hover:bg-[linear-gradient(180deg,rgba(250,244,234,0.98),rgba(235,223,199,0.94))] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24),0_0_0_1px_rgba(255,250,240,0.2)_inset] sm:min-w-[15rem] sm:px-11 sm:py-5 sm:text-[0.92rem] sm:tracking-[0.24em]"
        >
          Watch Concert Highlights
        </button>
      </div>

      {open ? (
        <div
          className="modal-backdrop bg-[rgba(6,10,8,0.82)] backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="London concert highlights"
            className="modal-surface relative max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute left-0 top-[-2.75rem]">
              <Link
                href="/producers"
                className="text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)] transition hover:opacity-80"
              >
                Skip
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="modal-close absolute right-0 top-[-3rem] inline-flex items-center justify-center text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]"
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
                <div className="relative aspect-video overflow-hidden rounded-[1.25rem] border border-[rgba(255,255,255,0.04)] bg-black">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.018)_0,rgba(255,255,255,0.018)_2px,transparent_2px,transparent_4px)] opacity-35" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-[linear-gradient(180deg,rgba(7,18,12,0.76),rgba(7,18,12,0.4),transparent)]" />
                  <iframe
                    src="https://player.vimeo.com/video/1153007249?h=46d6e7bcca&title=0&byline=0&portrait=0&badge=0&dnt=1&autoplay=1"
                    title="To Sir, With Love London concert footage"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 z-0 h-full w-full"
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
