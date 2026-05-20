import Image from "next/image";
import Link from "next/link";
import { PresentationProgress } from "@/components/presentation-progress";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(232,222,203,0.08)] bg-[rgba(16,23,18,0.58)] backdrop-blur-sm">
      <div className="section-shell">
        <div className="flex min-h-14 items-center py-3 sm:min-h-16">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/tswllogo.png"
              alt="To Sir, With Love logo"
              width={220}
              height={116}
              className="h-9 w-auto sm:h-10"
              priority
            />
            <div className="min-w-0">
              <PresentationProgress />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
