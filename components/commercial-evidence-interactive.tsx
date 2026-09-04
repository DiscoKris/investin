"use client";

import Image from "next/image";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type PressArticle = {
  publication: string;
  headline: string;
  date: string;
  summary: string;
  url: string;
};

const pressArticles: PressArticle[] = [
  {
    publication: "Deadline",
    headline:
      "Wayne Brady And Lulu To Perform London Concerts Of New ‘To Sir, With Love’ Stage Musical",
    date: "September 3, 2025",
    summary:
      "Deadline reported that Wayne Brady and Lulu would lead two West End concert stagings at the Gillian Lynne Theatre. The coverage highlighted Brady’s West End debut, Lulu’s connection to the original film and title song, and the new musical’s adaptation of E.R. Braithwaite’s memoir with a score by John Farrar and Kara DioGuardi.",
    url: "https://deadline.com/2025/09/wayne-brady-lulu-to-sir-with-love-london-1236505740/",
  },
  {
    publication: "WhatsOnStage",
    headline: "Wayne Brady to star in To Sir, With Love musical with Lulu",
    date: "September 3, 2025",
    summary:
      "WhatsOnStage announced Wayne Brady as Rick Braithwaite opposite Lulu for two concert performances at the Gillian Lynne Theatre. Its coverage connected the musical to E.R. Braithwaite’s story and noted the score by John Farrar and Kara DioGuardi, alongside the wider creative team.",
    url: "https://www.whatsonstage.com/news/wayne-brady-to-star-in-to-sir-with-love-musical-with-lulu_1692997/",
  },
  {
    publication: "Playbill",
    headline: "Wayne Brady Will Star in To Sir, With Love London Concerts",
    date: "September 3, 2025",
    summary:
      "Playbill covered Wayne Brady’s casting as Rick Braithwaite for two London concert performances, joined by Lulu. The report noted the Gillian Lynne Theatre engagement, Sheldon Epps’ direction, and the newly reimagined stage adaptation featuring music and lyrics by John Farrar and Kara DioGuardi.",
    url: "https://playbill.com/article/wayne-brady-will-star-in-to-sir-with-love-london-concerts",
  },
];

type ModalShellProps = {
  children: ReactNode;
  labelId: string;
  onClose: () => void;
  surfaceClassName: string;
};

function ModalShell({
  children,
  labelId,
  onClose,
  surfaceClassName,
}: ModalShellProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !surfaceRef.current) return;

      const focusable = Array.from(
        surfaceRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        surfaceRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => previouslyFocused?.focus());
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-[rgba(2,7,4,0.9)] p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={surfaceClassName}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(232,222,203,0.28)] bg-[rgba(3,9,5,0.84)] text-2xl leading-none text-[var(--color-ivory)] shadow-lg transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] sm:right-4 sm:top-4"
        >
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

function SettlementLightbox({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      labelId="settlement-lightbox-title"
      onClose={onClose}
      surfaceClassName="relative flex h-[min(90dvh,64rem)] w-[min(90vw,78rem)] items-center justify-center overflow-auto rounded-[1.25rem] border border-[rgba(200,168,110,0.46)] bg-[rgba(7,13,9,0.98)] p-3 pt-16 shadow-[0_30px_100px_rgba(0,0,0,0.72)] sm:p-6 sm:pt-16"
    >
      <h2 id="settlement-lightbox-title" className="sr-only">
        Box Office Statement — London Concert
      </h2>
      <Image
        src="/assets/settlement.jpg"
        alt="Enlarged To Sir, With Love London concert box office settlement statement"
        width={612}
        height={792}
        sizes="90vw"
        className="h-auto max-h-full w-auto max-w-full object-contain shadow-[0_18px_65px_rgba(0,0,0,0.46)]"
        priority
      />
    </ModalShell>
  );
}

type PressArticleModalProps = {
  article: PressArticle;
  onClose: () => void;
};

function PressArticleModal({ article, onClose }: PressArticleModalProps) {
  const titleId = useId();

  return (
    <ModalShell
      labelId={titleId}
      onClose={onClose}
      surfaceClassName="relative max-h-[90dvh] w-[min(90vw,52rem)] overflow-y-auto overscroll-contain rounded-[1.5rem] border border-[rgba(200,168,110,0.42)] bg-[linear-gradient(145deg,rgba(31,49,39,0.99),rgba(8,15,10,0.99))] px-6 pb-7 pt-16 shadow-[0_30px_100px_rgba(0,0,0,0.72)] sm:rounded-[2rem] sm:px-10 sm:pb-10 sm:pt-20"
    >
      <article data-source-url={article.url}>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
          {article.publication}
        </p>
        <h2
          id={titleId}
          className="mt-4 max-w-3xl text-[clamp(1.8rem,5vw,3.2rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[var(--color-ivory)]"
        >
          {article.headline}
        </h2>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mist)]">
          {article.date}
        </p>
        <div className="my-7 h-px bg-[linear-gradient(90deg,var(--color-gold),rgba(200,168,110,0.08))]" />
        <p className="text-base leading-8 text-[var(--color-cream)] sm:text-lg">
          {article.summary}
        </p>
        <p className="mt-8 border-t border-[rgba(232,222,203,0.12)] pt-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
          Source: {article.publication}
        </p>
      </article>
    </ModalShell>
  );
}

export function CommercialEvidenceInteractive() {
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<PressArticle | null>(null);
  const closeSettlement = useCallback(() => setSettlementOpen(false), []);
  const closeArticle = useCallback(() => setActiveArticle(null), []);

  return (
    <>
      <div className="mx-auto w-full max-w-[38rem] overflow-hidden rounded-[1.5rem] border border-[rgba(200,168,110,0.48)] bg-[rgba(0,0,0,0.18)] p-4">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label="Enlarge the London concert box office statement"
          onClick={() => setSettlementOpen(true)}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[1rem] border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#102317]"
        >
          <Image
            src="/assets/settlement.jpg"
            alt="To Sir, With Love London concert box office settlement statement"
            width={612}
            height={792}
            sizes="(max-width: 1023px) 90vw, 38rem"
            className="h-auto w-full object-contain transition duration-300 group-hover:scale-[1.015]"
            priority
          />
          <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(4,10,6,0.94))] px-3 pb-3 pt-12 text-center text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--color-ivory)] transition group-hover:text-[var(--color-gold)]">
            Click to enlarge
          </span>
        </button>
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Box Office Statement — London Concert
        </p>
      </div>

      <div className="mt-9 border-t border-[rgba(232,222,203,0.12)] pt-7 lg:col-span-2">
        <h3 className="text-xl font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)]">
          Press &amp; Media
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {pressArticles.map((article) => (
            <button
              key={article.publication}
              type="button"
              aria-haspopup="dialog"
              onClick={() => setActiveArticle(article)}
              className="group flex min-h-56 flex-col rounded-[1.15rem] border border-[rgba(200,168,110,0.24)] bg-[linear-gradient(145deg,rgba(246,241,230,0.055),rgba(5,11,7,0.18))] px-5 py-5 text-left shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(200,168,110,0.58)] hover:shadow-[0_20px_42px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                {article.publication}
              </span>
              <span className="mt-4 text-[1.05rem] font-semibold leading-6 text-[var(--color-ivory)]">
                {article.headline}
              </span>
              <span className="mt-auto pt-6 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-mist)] transition group-hover:text-[var(--color-gold)]">
                View article <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {settlementOpen && <SettlementLightbox onClose={closeSettlement} />}
      {activeArticle && (
        <PressArticleModal article={activeArticle} onClose={closeArticle} />
      )}
    </>
  );
}
