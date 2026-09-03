import "server-only";

import {
  FieldValue,
  type DocumentData,
  type DocumentSnapshot,
  type Firestore,
} from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "./firebase-admin";

export type InvestorLinkResult =
  | { status: "linked"; investorUid: string }
  | { status: "not-found" }
  | { status: "duplicate" }
  | { status: "already-linked" };

export type InvestorActivationCheck =
  | { status: "eligible" }
  | { status: "not-found" }
  | { status: "duplicate" }
  | { status: "already-linked" };

export function normalizeInvestorEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isApprovedInvestor(data: DocumentData | undefined) {
  return data?.investorStatus === "Active" && data?.isTest !== true;
}

function linkedAuthenticationUid(data: DocumentData | undefined) {
  return typeof data?.authenticationUid === "string"
    ? data.authenticationUid.trim()
    : "";
}

async function findApprovedInvestor(
  db: Firestore,
  email: string,
): Promise<
  | { status: "found"; investor: DocumentSnapshot }
  | { status: "not-found" | "duplicate" }
> {
  const activeInvestors = await db
    .collection("investors")
    .where("investorStatus", "==", "Active")
    .get();
  const matches = activeInvestors.docs.filter(
    (investor) =>
      investor.data().isTest !== true &&
      normalizeInvestorEmail(investor.data().email) === email,
  );

  if (matches.length === 0) return { status: "not-found" };
  if (matches.length > 1) {
    console.error("Investor activation blocked: duplicate approved email.", {
      investorDocumentIds: matches.map((match) => match.id),
    });
    return { status: "duplicate" };
  }
  return { status: "found", investor: matches[0] };
}

export async function checkInvestorActivation(
  emailValue: string,
): Promise<InvestorActivationCheck> {
  const email = normalizeInvestorEmail(emailValue);
  const match = await findApprovedInvestor(getFirebaseAdminDb(), email);
  if (match.status !== "found") return match;
  return linkedAuthenticationUid(match.investor.data())
    ? { status: "already-linked" }
    : { status: "eligible" };
}

export async function completeInvestorLink(
  db: Firestore,
  investorUid: string,
  authenticationUid: string,
) {
  const statements = await db
    .collection("statements")
    .where("investorUid", "==", investorUid)
    .get();
  for (let start = 0; start < statements.docs.length; start += 400) {
    const batch = db.batch();
    for (const statement of statements.docs.slice(start, start + 400)) {
      batch.update(statement.ref, {
        "investor.authenticationUid": authenticationUid,
      });
    }
    await batch.commit();
  }

  const draftReference = db.collection("statementDrafts").doc(investorUid);
  const draft = await draftReference.get();
  const finalBatch = db.batch();
  if (draft.exists) {
    finalBatch.update(draftReference, {
      "investor.authenticationUid": authenticationUid,
    });
  }
  finalBatch.update(db.collection("investors").doc(investorUid), {
    authenticationLinkComplete: true,
    updatedAt: FieldValue.serverTimestamp(),
  });
  finalBatch.set(db.collection("adminAuditLog").doc(), {
    administratorUid: authenticationUid,
    action: "Investor Authentication account linked",
    timestamp: FieldValue.serverTimestamp(),
    recordAffected: `investors/${investorUid}`,
    previousValue: { authenticationUid: null },
    newValue: { authenticationUid },
  });
  await finalBatch.commit();
}

export async function linkApprovedInvestor(
  authenticationUid: string,
  emailValue: string,
): Promise<InvestorLinkResult> {
  const db = getFirebaseAdminDb();
  const email = normalizeInvestorEmail(emailValue);
  const matchResult = await findApprovedInvestor(db, email);
  if (matchResult.status !== "found") return matchResult;

  const investorUid = matchResult.investor.id;
  const investorReference = db.collection("investors").doc(investorUid);
  const existingAuthenticationUid = linkedAuthenticationUid(
    matchResult.investor.data(),
  );
  if (
    existingAuthenticationUid &&
    existingAuthenticationUid !== authenticationUid
  ) {
    return { status: "already-linked" };
  }

  await db.runTransaction(async (transaction) => {
    const investor = await transaction.get(investorReference);
    if (!investor.exists) {
      throw new Error("The investor record changed while it was being linked.");
    }
    const data = investor.data()!;
    const currentAuthenticationUid = linkedAuthenticationUid(data);
    if (
      !isApprovedInvestor(data) ||
      normalizeInvestorEmail(data.email) !== email ||
      (currentAuthenticationUid &&
        currentAuthenticationUid !== authenticationUid)
    ) {
      throw new Error("The investor record is not eligible for linking.");
    }

    // Preserve the Admin-created investor document and its document ID. Only
    // add the authoritative Firebase Authentication link and activation time.
    transaction.update(investorReference, {
      authenticationUid,
      activatedAt: data.activatedAt ?? FieldValue.serverTimestamp(),
      authenticationLinkComplete:
        data.authenticationLinkComplete === true,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await completeInvestorLink(db, investorUid, authenticationUid);
  return { status: "linked", investorUid };
}
