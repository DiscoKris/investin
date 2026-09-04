"use client";

import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzdqrnwe";
const SUCCESS_MESSAGE = "Thank you. Your enquiry has been sent successfully.";
const ERROR_MESSAGE =
  "We could not send your enquiry right now. Please try again.";

type SubmissionState = "idle" | "success" | "error";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionState("idle");
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("name", String(formData.get("name") ?? "").trim());
    formData.set("email", String(formData.get("email") ?? "").trim());
    formData.set("message", String(formData.get("message") ?? "").trim());

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as
        | { errors?: Array<{ message?: string }>; ok?: boolean }
        | null;

      if (!response.ok || result?.ok === false) {
        console.error("Contact form submission failed.", {
          status: response.status,
          errors: result?.errors,
        });
        throw new Error("Unable to send enquiry");
      }

      form.reset();
      setSubmissionState("success");
      setStatusMessage(SUCCESS_MESSAGE);
    } catch (error) {
      console.error("Contact form submission errored.", { error });
      setSubmissionState("error");
      setStatusMessage(ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      action={FORMSPREE_ENDPOINT}
      method="POST"
      className="card-panel mobile-panel rounded-[1.5rem] sm:rounded-[2rem]"
      onSubmit={handleSubmit}
    >
      <input
        type="hidden"
        name="_subject"
        value="New To Sir, With Love Investor Enquiry"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold tracking-[0.24em] text-[var(--color-gold)] uppercase">
            Name
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder="Your name"
            className="min-h-12 w-full rounded-2xl border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-base text-[var(--color-ivory)] outline-none focus:border-[rgba(200,168,110,0.58)]"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold tracking-[0.24em] text-[var(--color-gold)] uppercase">
            Email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="investor@example.com"
            className="min-h-12 w-full rounded-2xl border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-base text-[var(--color-ivory)] outline-none focus:border-[rgba(200,168,110,0.58)]"
          />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-[10px] font-semibold tracking-[0.24em] text-[var(--color-gold)] uppercase">
          Message
        </span>
        <textarea
          rows={6}
          name="message"
          required
          placeholder="Please send me the investor presentation and next-step details."
          className="w-full rounded-[1.5rem] border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-base text-[var(--color-ivory)] outline-none focus:border-[rgba(200,168,110,0.58)]"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        className="mobile-action mt-6 inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-80 sm:tracking-[0.28em]"
      >
        {isSubmitting ? "Sending..." : "Send Enquiry"}
      </button>
      <p
        aria-live="polite"
        className={`mt-4 text-sm ${
          submissionState === "error"
            ? "text-[#f4c7a0]"
            : "text-[var(--color-cream)]"
        }`}
      >
        {statusMessage}
      </p>
    </form>
  );
}
