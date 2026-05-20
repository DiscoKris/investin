import Image from "next/image";
import { ContactForm } from "@/components/contact-form";

export default function ThankYouPage() {
  return (
    <section className="relative isolate min-h-[calc(100svh-5.5rem)] overflow-hidden">
      <Image
        src="/assets/kids2.jpg"
        alt="Students gathered together in a classroom moment from To Sir, With Love"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,14,10,0.88)_0%,rgba(7,14,10,0.68)_34%,rgba(7,14,10,0.36)_58%,rgba(7,14,10,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_32%,rgba(214,180,103,0.16),transparent_24%),linear-gradient(180deg,rgba(5,10,7,0.28),rgba(5,10,7,0.44))]" />

      <div className="section-shell relative z-10 flex min-h-[calc(100svh-5.5rem)] items-center py-8 sm:py-10 lg:py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-end lg:gap-10">
          <div className="justify-self-end rounded-[2rem] border border-[rgba(232,222,203,0.14)] bg-[rgba(10,17,12,0.42)] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-[10px] sm:p-8 lg:max-w-[34rem] lg:p-10">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-gold)]">
              Investor Presentation
            </p>
            <h1 className="mt-5 text-[3rem] font-bold uppercase leading-[0.9] tracking-[-0.05em] text-[var(--color-ivory)] sm:text-[4rem] lg:text-[5.25rem]">
              THANK <span className="text-[var(--color-gold)]">YOU</span>
            </h1>
            <div className="mt-6 max-w-[26rem] space-y-2 text-[1rem] leading-[1.75] text-[var(--color-cream)] sm:text-[1.08rem] lg:text-[1.14rem]">
              <p>For investment enquiries contact</p>
              <p className="font-semibold text-[var(--color-ivory)]">
                Greenslade Productions Ltd
              </p>
              <p>
                <a
                  href="mailto:dearsir@tosirwithlovemusical.com"
                  className="border-b border-[rgba(214,180,103,0.45)] text-[var(--color-ivory)] transition hover:border-[rgba(214,180,103,0.85)] hover:text-[var(--color-gold)]"
                >
                  dearsir@tosirwithlovemusical.com
                </a>
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-[33rem] lg:justify-self-end">
            <div className="rounded-[2rem] border border-[rgba(232,222,203,0.16)] bg-[rgba(9,16,11,0.68)] p-2 shadow-[0_24px_64px_rgba(0,0,0,0.28)] backdrop-blur-[14px]">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
