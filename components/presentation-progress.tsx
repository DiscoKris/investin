"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { getPresentationStep } from "@/lib/presentation-flow";

export function PresentationProgress() {
  const pathname = usePathname();
  const progress = getPresentationStep(pathname);

  if (!progress) {
    return (
      <p className="nav-type truncate text-[0.58rem] text-[var(--color-mist)] sm:text-[0.66rem]">
        <span className="hidden sm:inline">Investor Presentation</span>
        <span className="sm:hidden">Presentation</span>
      </p>
    );
  }

  return (
    <p className="nav-type flex items-center gap-1.5 truncate text-[0.58rem] text-[var(--color-mist)] sm:text-[0.66rem]">
      <span className="truncate">
        <span className="hidden sm:inline">Investor Presentation</span>
        <span className="sm:hidden">Presentation</span>
      </span>
      <span
        aria-hidden="true"
        className="text-[rgba(246,241,230,0.4)]"
      >
        ·
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={progress.route.href}
          initial={{ opacity: 0.45 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.45 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="truncate text-[rgba(246,241,230,0.88)]"
        >
          {progress.currentPage} / {progress.totalPages}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
