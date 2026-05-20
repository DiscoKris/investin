const ENQUIRY_TO = "dearsir@tosirwithlovemusical.com";
const ENQUIRY_CC = "krislythgoe@me.com";
const ENQUIRY_SUBJECT = "TSWL Investor Enquiry";

type InvestorEnquiryPayload = {
  name?: string;
  email?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail =
    process.env.RESEND_FROM_EMAIL ?? "TSWL Investor Site <onboarding@resend.dev>";

  if (!resendApiKey) {
    return Response.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let payload: InvestorEnquiryPayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const text = [
    "New TSWL investor enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div>
      <p>New TSWL investor enquiry</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
    </div>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [ENQUIRY_TO],
      cc: [ENQUIRY_CC],
      reply_to: email,
      subject: ENQUIRY_SUBJECT,
      text,
      html,
    }),
  });

  if (!resendResponse.ok) {
    return Response.json(
      { error: "Failed to send enquiry email." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
