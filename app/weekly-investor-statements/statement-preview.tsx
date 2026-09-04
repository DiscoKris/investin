"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const imageWidth = 595;
const imageHeight = 841;
const imageAlt =
  "Example biweekly To Sir, With Love investor statement showing updated theatre box office assumptions and statement value.";

export function StatementPreview() {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const previewRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeViewer = useCallback(() => {
    setOpen(false);
    setZoom(1);
    window.setTimeout(() => previewRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const updateViewport = () =>
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
    };

    updateViewport();
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", updateViewport);
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeViewer, open]);

  const baseScale = Math.min(
    (viewport.width * 0.92) / imageWidth,
    (viewport.height * 0.86) / imageHeight,
  );
  const displayedWidth = imageWidth * baseScale * zoom;
  const displayedHeight = imageHeight * baseScale * zoom;

  return (
    <>
      <button
        ref={previewRef}
        type="button"
        aria-haspopup="dialog"
        aria-label="Open full biweekly investor statement"
        onClick={() => setOpen(true)}
        className="group relative block cursor-pointer border-0 bg-transparent p-0 text-left shadow-[0_24px_70px_rgba(0,0,0,0.34)] ring-1 ring-[rgba(232,222,203,0.18)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_30px_85px_rgba(0,0,0,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#102317]"
      >
        <Image
          src="/assets/statement-updated.svg"
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          sizes="(max-width: 1023px) 92vw, 70vw"
          className="h-auto max-h-[62svh] w-auto max-w-full object-contain sm:max-h-[66svh] lg:max-h-[calc(100svh-13.75rem)]"
          priority
        />
        <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(8,18,12,0.92))] px-3 pb-3 pt-10 text-center text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white opacity-90 transition group-hover:text-[var(--color-gold)] sm:text-[0.68rem]">
          Click to view full statement
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="statement-viewer-title"
          className="fixed inset-0 z-[100] bg-[rgba(2,7,4,0.94)] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <h2 id="statement-viewer-title" className="sr-only">
            Full biweekly investor statement
          </h2>

          <button
            ref={closeRef}
            type="button"
            aria-label="Close full statement"
            onClick={closeViewer}
            className="fixed right-4 top-4 z-[103] rounded-full border border-white/30 bg-black/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] sm:right-6 sm:top-6"
          >
            × Close
          </button>

          <div
            className="fixed bottom-4 left-1/2 z-[103] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-black/75 p-1.5 text-white sm:bottom-6 sm:gap-2"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Zoom out"
              disabled={zoom <= 1}
              onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-35 hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              Zoom Out
            </button>
            <button
              type="button"
              aria-label="Reset zoom"
              disabled={zoom === 1}
              onClick={() => setZoom(1)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-35 hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              Reset
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={zoom >= 2.5}
              onClick={() => setZoom((value) => Math.min(2.5, value + 0.5))}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-35 hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              Zoom In
            </button>
          </div>

          <div
            className={`h-full w-full overflow-auto px-4 pb-4 pt-16 sm:px-6 sm:pb-6 sm:pt-20 ${
              zoom === 1
                ? "flex items-center justify-center"
                : "flex items-start justify-start"
            }`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeViewer();
            }}
          >
            <div
              className="relative mx-auto shrink-0 shadow-[0_28px_90px_rgba(0,0,0,0.65)]"
              style={{
                width: displayedWidth,
                height: displayedHeight,
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Image
                src="/assets/statement-updated.svg"
                alt={imageAlt}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
