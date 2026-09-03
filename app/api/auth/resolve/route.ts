import { FieldValue } from "firebase-admin/firestore";
import { isAdmin, requireUserApi } from "@/lib/portal/auth";
import { getFirebaseAdminDb } from "@/lib/portal/firebase-admin";
import {
  completeInvestorLink,
  linkApprovedInvestor,
} from "@/lib/portal/investor-link";

export const dynamic = "force-dynamic";

const UNLINKED_MESSAGE =
  "Your account is not currently linked to an investor record. Please contact the production office.";

function isActiveInvestor(data: FirebaseFirestore.DocumentData | undefined) {
  return data?.investorStatus === "Active" && data?.isTest !== true;
}

function response(access: "admin" | "investor" | null, message?: string) {
  return Response.json(
    { access, ...(message ? { message } : {}) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

async function investorResponse(
  db: FirebaseFirestore.Firestore,
  investorUid: string,
) {
  await db
    .collection("investors")
    .doc(investorUid)
    .update({
      loginStatus: "Active",
      lastLoginAt: FieldValue.serverTimestamp(),
    })
    .catch((error) => {
      console.error("Unable to record investor login.", {
        investorUid,
        error,
      });
    });
  return response("investor");
}

export async function POST(request: Request) {
  const context = await requireUserApi(request);
  if ("error" in context) return context.error;

  if (await isAdmin(context)) return response("admin");

  const db = getFirebaseAdminDb();
  const linkedInvestors = await db
    .collection("investors")
    .where("authenticationUid", "==", context.user.uid)
    .limit(2)
    .get();
  if (linkedInvestors.size > 1) {
    console.error("Investor access blocked: duplicate Authentication UID.", {
      authenticationUid: context.user.uid,
      investorDocumentIds: linkedInvestors.docs.map((item) => item.id),
    });
    return response(null, UNLINKED_MESSAGE);
  }

  const linkedInvestor = linkedInvestors.docs[0];
  if (linkedInvestor && isActiveInvestor(linkedInvestor.data())) {
    if (linkedInvestor.data().authenticationLinkComplete !== true) {
      await completeInvestorLink(db, linkedInvestor.id, context.user.uid);
    }
    return investorResponse(db, linkedInvestor.id);
  }

  if (!context.user.email) return response(null, UNLINKED_MESSAGE);
  const link = await linkApprovedInvestor(
    context.user.uid,
    context.user.email,
  ).catch((error) => {
    console.error("Authenticated investor linking failed.", { error });
    return null;
  });
  return link?.status === "linked"
    ? investorResponse(db, link.investorUid)
    : response(null, UNLINKED_MESSAGE);
}
