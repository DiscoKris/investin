import { z } from "zod";
import type { DashboardSheetResponse } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

const responseSchema = z
  .object({
    totalInvested: z.number().finite(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export async function GET() {
  const endpoint = process.env.GOOGLE_SHEETS_DASHBOARD_URL;
  if (!endpoint) {
    console.error(
      "Dashboard unavailable: GOOGLE_SHEETS_DASHBOARD_URL is not configured.",
    );
    return Response.json(
      { error: "GOOGLE_SHEETS_DASHBOARD_URL is not configured." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/json" },
    });
    const responseText = await response.text();
    console.info("Google dashboard endpoint response.", {
      status: response.status,
      body: responseText,
    });
    if (!response.ok) {
      console.error("Google dashboard endpoint returned an HTTP error.", {
        status: response.status,
        contentType: response.headers.get("content-type"),
        body: responseText,
      });
      return Response.json(
        {
          error: `Google dashboard endpoint returned HTTP ${response.status}.`,
          upstreamStatus: response.status,
        },
        {
          status: response.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    let responseBody: unknown;
    try {
      responseBody = JSON.parse(responseText);
    } catch (error) {
      console.error("Google dashboard endpoint returned invalid JSON.", {
        contentType: response.headers.get("content-type"),
        body: responseText,
        error,
      });
      return Response.json(
        { error: "Google dashboard endpoint returned invalid JSON." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const parsed = responseSchema.safeParse(responseBody);
    if (!parsed.success) {
      const received =
        responseBody !== null && typeof responseBody === "object"
          ? {
              keys: Object.keys(responseBody),
              totalInvestedType: typeof Reflect.get(
                responseBody,
                "totalInvested",
              ),
              updatedAtType: typeof Reflect.get(responseBody, "updatedAt"),
            }
          : { valueType: typeof responseBody };
      console.error("Google dashboard endpoint returned an unexpected shape.", {
        received,
        validationIssues: parsed.error.issues,
        body: responseText,
      });
      return Response.json(
        {
          error:
            "Google dashboard endpoint did not return totalInvested and updatedAt.",
          validationIssues: parsed.error.issues,
        },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const result: DashboardSheetResponse = {
      totalInvested: Math.max(0, parsed.data.totalInvested),
      updatedAt: parsed.data.updatedAt,
    };
    return Response.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : null,
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
