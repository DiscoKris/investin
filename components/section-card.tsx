type SectionCardProps = {
  eyebrow?: string;
  title: string;
  body: string;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  body,
  className = "",
}: SectionCardProps) {
  return (
    <article className={`card-panel rounded-[2rem] p-6 sm:p-8 ${className}`}>
      {eyebrow ? (
        <p className="eyebrow mb-3 text-[var(--color-gold)]">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="headline mb-4 text-[1.9rem] text-[var(--color-ivory)]">
        {title}
      </h3>
      <p className="body-copy max-w-xl text-[var(--color-mist)]">{body}</p>
    </article>
  );
}
