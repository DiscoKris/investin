"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LEEDS_ANNOUNCEMENT_URL =
  "https://leedsheritagetheatres.com/whats-on/to-sir-with-love-2027/";

export function LeedsAnnouncementModal() {
  const [open, setOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const fallbackTimer = window.setTimeout(() => {
      setShowFallback((current) => current || !iframeLoaded);
    }, 3200);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(fallbackTimer);
    };
  }, [iframeLoaded, open]);

  function openModal() {
    setIframeLoaded(false);
    setShowFallback(false);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center justify-center rounded-full border border-[rgba(210,178,116,0.42)] bg-[linear-gradient(180deg,rgba(247,240,227,0.96),rgba(228,214,187,0.9))] px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#233126] shadow-[0_10px_22px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,250,240,0.14)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,178,116,0.7)] hover:bg-[linear-gradient(180deg,rgba(250,244,234,0.98),rgba(235,223,199,0.94))] hover:shadow-[0_14px_28px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,250,240,0.18)_inset] sm:px-3.5 sm:text-[0.64rem]"
      >
        See Announcement
      </button>

      {typeof document !== "undefined" && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(6,10,8,0.84)] px-4 py-8 backdrop-blur-md"
              onClick={closeModal}
            >
              <div
                className="relative z-[10000] w-full max-w-5xl"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-0 top-[-2.75rem] text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)] transition hover:text-[var(--color-gold)]"
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

                    <div className="mb-4 px-2">
                      <p className="text-[1.35rem] font-semibold leading-tight text-[var(--color-ivory)] sm:text-[1.6rem]">
                        Leeds Grand Theatre Announcement
                      </p>
                      <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)] sm:text-[0.76rem]">
                        Stay in the investor deck unless you choose to open the
                        external page
                      </p>
                    </div>

                    {!showFallback ? (
                      <div className="relative min-h-[24rem] overflow-hidden rounded-[1.25rem] border border-[rgba(255,255,255,0.04)] bg-black sm:min-h-[32rem]">
                        <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.018)_0,rgba(255,255,255,0.018)_2px,transparent_2px,transparent_4px)] opacity-35" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-[linear-gradient(180deg,rgba(7,18,12,0.76),rgba(7,18,12,0.4),transparent)]" />
                        {!iframeLoaded ? (
                          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(8,13,10,0.72)] px-6 text-center">
                            <p className="max-w-md text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]">
                              Loading Leeds announcement
                            </p>
                          </div>
                        ) : null}
                        <iframe
                          src={LEEDS_ANNOUNCEMENT_URL}
                          title="Leeds Grand Theatre announcement for To Sir, With Love"
                          className="absolute inset-0 z-0 h-full w-full"
                          onLoad={() => setIframeLoaded(true)}
                        />
                      </div>
                    ) : (
                      <div className="rounded-[1.25rem] border border-[rgba(232,222,203,0.1)] bg-[linear-gradient(180deg,rgba(35,48,39,0.82),rgba(17,24,19,0.9))] px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-8 sm:py-10">
                        <p className="text-[1.1rem] font-semibold leading-[1.45] text-[var(--color-ivory)] sm:text-[1.2rem]">
                          To Sir, With Love is announced at Leeds Grand Theatre
                          and on sale.
                        </p>
                        <a
                          href={LEEDS_ANNOUNCEMENT_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center justify-center rounded-full border border-[rgba(210,178,116,0.48)] bg-[linear-gradient(180deg,rgba(248,241,229,0.96),rgba(229,216,191,0.92))] px-6 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#263224] shadow-[0_14px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,250,240,0.14)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,178,116,0.76)] hover:bg-[linear-gradient(180deg,rgba(250,244,234,0.98),rgba(235,223,199,0.94))]"
                        >
                          Open Leeds Announcement
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
