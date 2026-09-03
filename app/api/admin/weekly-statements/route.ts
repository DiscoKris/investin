import {
  doc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { isAdmin, requireUserApi } from "@/lib/portal/auth";
import {
  archiveEmailedStatement,
  getAuditLog,
  getCurrentStatement,
  getInvestors,
} from "@/lib/portal/store";
import {
  sendStatementEmail,
  statementEmailConfigured,
} from "@/lib/portal/statement-email";
import type { Investor } from "@/lib/portal/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const LOCK_ID = "weekly-statements";
const LOCK_TTL_MS = 30 * 60 * 1000;

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function eligible(investor: Investor) {
  return (
    investor.investorStatus === "Active" &&
    investor.isTest !== true &&
    validEmail(investor.email)
  );
}

function datePart(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function adminContext(request: Request) {
  const context = await requireUserApi(request);
  if ("error" in context) return context;
  if (!(await isAdmin(context))) {
    return {
      error: Response.json({ error: "Administrator access is required." }, { status: 403 }),
    };
  }
  return context;
}

export async function GET(request: Request) {
  const context = await adminContext(request);
  if ("error" in context) return context.error;
  const investors = await getInvestors(context.db);
  const recipients = investors.filter(eligible);
  const skipped = investors.filter((item) => !eligible(item));
  const latest = (await getAuditLog(context.db).catch(() => [])).find(
    (entry) => entry.action === "weekly_statements_sent",
  );
  return Response.json({
    recipientCount: recipients.length,
    skippedCount: skipped.length,
    providerConfigured: statementEmailConfigured(),
    latest: latest
      ? {
          timestamp:
            typeof latest.timestamp === "string" ? latest.timestamp : null,
          successfulCount: Number((latest.newValue as Record<string, unknown>)?.successfulCount || 0),
          failedCount: Number((latest.newValue as Record<string, unknown>)?.failedCount || 0),
          skippedCount: Number((latest.newValue as Record<string, unknown>)?.skippedCount || 0),
        }
      : null,
  });
}

export async function POST(request: Request) {
  const context = await adminContext(request);
  if ("error" in context) return context.error;
  if (!statementEmailConfigured()) {
    return Response.json(
      {
        error:
          "Statement email is not configured. Add RESEND_API_KEY and STATEMENTS_FROM_EMAIL on the server.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    mode?: string;
    investorUid?: string;
    requestId?: string;
    privateNote?: string;
  };
  const testMode = body.mode === "test";
  const individualMode = body.mode === "individual";
  const bulkMode = !testMode && !individualMode;
  const investors = await getInvestors(context.db);
  const individualInvestor = individualMode
    ? investors.find((investor) => investor.uid === body.investorUid)
    : undefined;
  if (individualMode && !individualInvestor) {
    return Response.json({ error: "Investor not found." }, { status: 404 });
  }
  if (individualInvestor && !validEmail(individualInvestor.email)) {
    return Response.json(
      { error: "This investor does not have a valid email address." },
      { status: 400 },
    );
  }
  const recipients = individualInvestor
    ? [individualInvestor]
    : investors.filter(eligible);
  const skipped = individualMode
    ? []
    : investors.filter((item) => !eligible(item));
  if (recipients.length === 0) {
    return Response.json({ error: "There are no eligible active investors." }, { status: 400 });
  }
  if (testMode && !context.user.email) {
    return Response.json({ error: "Your administrator account has no email address." }, { status: 400 });
  }

  const distributionId = /^[0-9a-f-]{36}$/i.test(body.requestId || "")
    ? body.requestId!
    : crypto.randomUUID();
  const statementDate = datePart(new Date());
  if (bulkMode) {
    const lock = doc(context.db, "statementDistributionLocks", LOCK_ID);
    try {
      await runTransaction(context.db, async (transaction) => {
        const snapshot = await transaction.get(lock);
        const expiresAt = Number(snapshot.data()?.expiresAt || 0);
        if (snapshot.data()?.active === true && expiresAt > Date.now()) {
          throw new Error("A biweekly statement distribution is already running.");
        }
        transaction.set(lock, {
          active: true,
          distributionId,
          administratorUid: context.user.uid,
          startedAt: serverTimestamp(),
          expiresAt: Date.now() + LOCK_TTL_MS,
        });
      });
    } catch (error) {
      return Response.json({ error: (error as Error).message }, { status: 409 });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (value: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
      let successfulCount = 0;
      let failedCount = 0;
      const failures: Array<{ investor: string; accountNumber: string; reason: string }> = [];
      const targets = testMode ? recipients.slice(0, 1) : recipients;
      send({
        type: "start",
        total: targets.length,
        skipped: testMode ? 0 : skipped.length,
      });

      for (const [index, investor] of targets.entries()) {
        try {
          const statement = await getCurrentStatement(context.db, investor.uid);
          if (!statement || statement.investorUid !== investor.uid) {
            throw new Error("Personalized statement could not be verified.");
          }
          const pdfResponse = await fetch(
            new URL("/api/statement/pdf", request.url),
            {
              method: "POST",
              headers: {
                Authorization: request.headers.get("authorization") || "",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(statement),
            },
          );
          if (!pdfResponse.ok) throw new Error("PDF generation failed.");
          const pdf = new Uint8Array(await pdfResponse.arrayBuffer());
          if (pdf.byteLength === 0) throw new Error("PDF generation returned a blank file.");
          const filename = `TSWL-Investor-Statement-${investor.accountNumber}-${statementDate}.pdf`;
          const recipient = testMode ? context.user.email! : investor.email;
          const emailProviderMessageId = await sendStatementEmail({
            to: recipient,
            firstName: investor.fullName.trim().split(/\s+/)[0] || "Investor",
            pdf,
            filename,
            kind: testMode
              ? "test"
              : individualMode
                ? "individual"
                : "weekly",
            idempotencyKey: `weekly-${distributionId}-${investor.uid}-${testMode ? "test" : "live"}`,
          });
          if (!testMode) {
            const statementToArchive =
              individualMode && body.privateNote?.trim()
                ? {
                    ...statement,
                    privateNote: body.privateNote.trim().slice(0, 2_000),
                  }
                : statement;
            await archiveEmailedStatement(
              context.db,
              statementToArchive,
              recipient,
              context.user.uid,
              emailProviderMessageId,
              `${distributionId}-${investor.uid}`,
            );
            await updateDoc(doc(context.db, "investors", investor.uid), {
              lastStatementSentAt: serverTimestamp(),
              lastStatementEmailStatus: "sent",
            });
          }
          successfulCount += 1;
          send({ type: "progress", completed: index + 1, total: targets.length, successfulCount, failedCount });
        } catch (error) {
          failedCount += 1;
          const failure = {
            investor: investor.fullName,
            accountNumber: investor.accountNumber,
            reason: (error as Error).message || "Email delivery failed.",
          };
          failures.push(failure);
          if (!testMode) {
            await updateDoc(doc(context.db, "investors", investor.uid), {
              lastStatementEmailStatus: `failed: ${failure.reason}`,
            }).catch(() => undefined);
          }
          send({ type: "progress", completed: index + 1, total: targets.length, successfulCount, failedCount, failure });
        }
      }

      if (bulkMode) {
        await setDoc(doc(context.db, "adminAuditLog", distributionId), {
          administratorUid: context.user.uid,
          action: "weekly_statements_sent",
          timestamp: serverTimestamp(),
          recordAffected: "eligible_investors",
          previousValue: null,
          newValue: {
            eligibleInvestorCount: recipients.length,
            successfulCount,
            failedCount,
            skippedCount: skipped.length,
            statementDate,
            failures,
          },
        }).catch(() => undefined);
        await setDoc(
          doc(context.db, "statementDistributionLocks", LOCK_ID),
          { active: false, completedAt: serverTimestamp(), distributionId },
          { merge: true },
        ).catch(() => undefined);
      }
      send({ type: "complete", successfulCount, failedCount, skippedCount: testMode ? 0 : skipped.length, failures, testMode });
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
