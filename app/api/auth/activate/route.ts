import { getFirebaseAdminAuth } from "@/lib/portal/firebase-admin";
import {
  checkInvestorActivation,
  linkApprovedInvestor,
  normalizeInvestorEmail,
} from "@/lib/portal/investor-link";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const headers = { "Cache-Control": "private, no-store" };

function result(
  status: number,
  code:
    | "created"
    | "not-found"
    | "already-activated"
    | "existing-auth"
    | "invalid"
    | "error",
) {
  return Response.json({ code }, { status, headers });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;
  const email = normalizeInvestorEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || password.length < 6 || password.length > 128) {
    return result(400, "invalid");
  }

  const eligibility = await checkInvestorActivation(email).catch((error) => {
    console.error("Investor activation eligibility check failed.", { error });
    return null;
  });
  if (!eligibility) return result(500, "error");
  if (eligibility.status === "not-found") return result(404, "not-found");
  if (eligibility.status === "duplicate") return result(409, "error");
  if (eligibility.status === "already-linked") {
    return result(409, "already-activated");
  }

  const auth = getFirebaseAdminAuth();
  let existingUser;
  try {
    existingUser = await auth.getUserByEmail(email);
  } catch (error) {
    if ((error as { code?: string }).code !== "auth/user-not-found") {
      console.error("Investor activation Auth lookup failed.", { error });
      return result(500, "error");
    }
  }

  if (existingUser) {
    // The browser must still authenticate the existing password before the
    // session resolver links and grants access to the investor record.
    return result(409, "existing-auth");
  }

  let createdUser;
  try {
    createdUser = await auth.createUser({ email, password });
  } catch (error) {
    if ((error as { code?: string }).code === "auth/email-already-exists") {
      return result(409, "existing-auth");
    }
    console.error("Investor Authentication account creation failed.", { error });
    return result(500, "error");
  }

  try {
    const link = await linkApprovedInvestor(createdUser.uid, email);
    if (link.status === "linked") return result(201, "created");
    await auth.deleteUser(createdUser.uid).catch((error) => {
      console.error("Failed to roll back an unlinked Authentication user.", {
        uid: createdUser.uid,
        error,
      });
    });
    if (link.status === "not-found") return result(404, "not-found");
    if (link.status === "already-linked") {
      return result(409, "already-activated");
    }
    return result(409, "error");
  } catch (error) {
    // A Firestore migration may have committed its UID claim before a later
    // statement batch failed. Keep the Auth user so an administrator can safely
    // resume that idempotent migration instead of leaving a record linked to a
    // deleted UID.
    console.error("Investor activation linking failed.", { error });
    return result(500, "error");
  }
}
