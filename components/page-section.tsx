import { Reveal } from "@/components/reveal";

type PageSectionProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
};

export function PageSection({
  eyebrow,
  title,
  copy,
  children,
}: PageSectionProps) {
  return (
    <section className="section-shell py-12 sm:py-16">
      <Reveal>
        {eyebrow ? (
          <p className="eyebrow mb-3 text-[var(--color-gold)]">
            {eyebrow}
          </p>
        ) : null}
        <div className="mb-6 h-px w-24 gold-rule" />
        <div className="mb-10 flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="headline max-w-3xl text-4xl text-[var(--color-ivory)] sm:text-5xl">
            {title}
          </h2>
          {copy ? (
            <p className="body-copy max-w-2xl text-[var(--color-mist)]">
              {copy}
            </p>
          ) : null}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
