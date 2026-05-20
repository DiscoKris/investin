"use client";

import { useState } from "react";

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
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/investor-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to send enquiry");
      }

      form.reset();
      setSubmissionState("success");
      setStatusMessage("Your enquiry has been sent.");
    } catch {
      setSubmissionState("error");
      setStatusMessage(
        "We could not send your enquiry right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="card-panel rounded-[2rem] p-6 sm:p-8" onSubmit={handleSubmit}>
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
            className="w-full rounded-2xl border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ivory)] outline-none"
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
            className="w-full rounded-2xl border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ivory)] outline-none"
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
          className="w-full rounded-[1.5rem] border border-[rgba(232,222,203,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ivory)] outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex rounded-full bg-[var(--color-gold)] px-6 py-3 text-xs font-semibold tracking-[0.28em] uppercase text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-80"
      >
        Send Inquiry
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
