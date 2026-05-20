import Image from "next/image";
import { Reveal } from "@/components/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  intro,
  imageSrc = "/assets/hero-backdrop.svg",
  imageAlt = "To Sir, With Love atmospheric placeholder artwork",
  children,
}: PageHeroProps) {
  return (
    <section className="section-shell grid min-h-[72svh] items-end gap-12 py-28 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
      <Reveal className="relative z-10">
        <p className="eyebrow mb-5 text-[var(--color-gold)]">
          {eyebrow}
        </p>
        <div className="mb-6 h-px w-32 gold-rule" />
        <h1 className="headline max-w-4xl text-5xl text-[var(--color-ivory)] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="body-copy mt-6 max-w-2xl text-[var(--color-mist)]">
          {intro}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </Reveal>
      <Reveal delay={0.12} className="relative">
        <div className="card-panel relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(15,23,18,0.4)] via-transparent to-[rgba(200,168,110,0.12)]" />
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1000}
            height={1200}
            className="h-full min-h-[380px] w-full object-cover"
            priority
          />
        </div>
      </Reveal>
    </section>
  );
}
