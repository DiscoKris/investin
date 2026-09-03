import "server-only";

type StatementEmail = {
  to: string;
  firstName: string;
  pdf: Uint8Array;
  filename: string;
  idempotencyKey: string;
  kind?: "weekly" | "individual" | "test";
};

export function statementEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.STATEMENTS_FROM_EMAIL?.trim(),
  );
}

export async function sendStatementEmail({
  to,
  firstName,
  pdf,
  filename,
  idempotencyKey,
  kind = "weekly",
}: StatementEmail) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.STATEMENTS_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    throw new Error(
      "Statement email is not configured. Add RESEND_API_KEY and STATEMENTS_FROM_EMAIL on the server.",
    );
  }
  if (pdf.byteLength === 0) throw new Error("The generated PDF was blank.");

  const subject =
    kind === "test"
      ? "TEST — To Sir, With Love Investor Statement"
      : kind === "individual"
        ? "To Sir, With Love — Investor Statement"
        : "To Sir, With Love — Biweekly Investor Statement";
  const text = `Dear ${firstName},

Please find attached your latest investor statement for To Sir, With Love — The Musical.

The statement includes the latest production update, box office information and current value of your investment.

You can also access your investor account online at any time through the secure investor portal.

Thank you for being part of To Sir, With Love.

Best,

The To Sir, With Love Production Team`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      attachments: [
        {
          filename,
          content: Buffer.from(pdf).toString("base64"),
        },
      ],
    }),
  });
  const result = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    error?: { message?: string };
  };
  if (!response.ok || !result.id) {
    throw new Error(
      result.message || result.error?.message || "Email delivery failed.",
    );
  }
  return result.id;
}
