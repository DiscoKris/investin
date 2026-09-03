import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isAdmin, requireUserApi } from "@/lib/portal/auth";
import { getCurrentStatement, getIssuedStatement } from "@/lib/portal/store";
import {
  currencyMoney,
  formatTswlUnits,
  investorCurrency,
  investorGbpBasis,
  investorOriginalAmount,
  investorReportingValue,
  investorValuation,
  maskAccountNumber,
  money,
  signedCurrencyMoney,
  signedMoney,
} from "@/lib/portal/finance";
import { getInvestorAddress } from "@/lib/portal/address";
import {
  CURRENT_TSWL_UNIT_PRICE,
  OPERATIONAL_COST_PER_WEEK,
  TSWL_UNIT_SIZE,
} from "@/lib/portal/constants";
import type { StatementSnapshot } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const context = await requireUserApi(request);
  if ("error" in context) return context.error;
  const admin = await isAdmin(context);
  const requested = new URL(request.url).searchParams.get("investor");
  if (requested && !admin)
    return Response.json({ error: "Forbidden" }, { status: 403 });
  const uid = admin ? requested : context.user.uid;
  if (!uid) return Response.json({ error: "Investor is required." }, { status: 400 });
  const statement = admin
    ? await getCurrentStatement(context.db, uid)
    : await getIssuedStatement(context.db, uid);
  if (!statement) return Response.json({ error: "Statement not found." }, { status: 404 });

  return statementPdfResponse(statement, request.url);
}

export async function POST(request: Request) {
  const context = await requireUserApi(request);
  if ("error" in context) return context.error;
  if (!(await isAdmin(context))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const statement = (await request.json().catch(() => null)) as StatementSnapshot | null;
  if (!statement?.investorUid || !statement.investor?.accountNumber) {
    return Response.json({ error: "A valid statement is required." }, { status: 400 });
  }

  return statementPdfResponse(statement, request.url);
}

async function statementPdfResponse(statement: StatementSnapshot, requestUrl: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logoResponse = await fetch(
    new URL("/assets/tswllogo.png", requestUrl),
  );
  if (!logoResponse.ok) {
    return Response.json({ error: "Statement logo could not be loaded." }, { status: 500 });
  }
  const logo = await pdf.embedPng(await logoResponse.arrayBuffer());
  const green = rgb(0.09, 0.23, 0.16);
  const grey = rgb(0.34, 0.4, 0.36);
  const gold = rgb(0.65, 0.51, 0.27);
  let y = 790;
  const draw = (text: string, x: number, size = 10, font = regular, color = grey) => {
    page.drawText(text, { x, y, size, font, color });
  };
  const drawRight = (
    text: string,
    right: number,
    size = 10,
    font = regular,
    color = grey,
  ) => {
    draw(text, right - font.widthOfTextAtSize(text, size), size, font, color);
  };
  page.drawRectangle({ x: 215, y: 760, width: 165, height: 68, color: green });
  page.drawImage(logo, { x: 245, y: 762, width: 105, height: 64.7 });
  const statementHeading = "INVESTOR STATEMENT";
  page.drawText(statementHeading, {
    x: (595.28 - bold.widthOfTextAtSize(statementHeading, 18)) / 2,
    y: 734,
    size: 18,
    font: bold,
    color: green,
  });
  y = 714; page.drawLine({ start: { x: 45, y }, end: { x: 550, y }, thickness: 1.5, color: green });
  y -= 28;
  draw(statement.investor.fullName, 45, 11, bold, green);
  draw(`Statement date: ${new Date(statement.statementDate).toLocaleDateString("en-GB")}`, 350, 9, bold);
  y -= 16;
  draw(`Account: ${maskAccountNumber(statement.investor.accountNumber)}`, 350, 9);
  y -= 16;
  draw(`Status: ${statement.investor.investorStatus}`, 350, 9);
  y += 16;
  for (const line of getInvestorAddress(statement.investor).split("\n")) {
    if (line) draw(line, 45);
    y -= 14;
  }
  draw(statement.investor.email, 45);
  y -= 14;
  draw(
    `Last login: ${statement.investor.lastLoginAt ? new Date(statement.investor.lastLoginAt).toLocaleString("en-GB") : "First access"}`,
    45,
    8,
  );
  const executiveUpdate = statement.settings.executiveUpdate?.trim();
  if (executiveUpdate) {
    y -= 30;
    draw("EXECUTIVE UPDATE", 45, 8, bold, gold);
    y -= 17;
    const lines: string[] = [];
    let remaining = executiveUpdate;
    while (remaining) {
      let end = remaining.length;
      while (
        end > 1 &&
        regular.widthOfTextAtSize(remaining.slice(0, end), 9) > 505
      ) {
        end -= 1;
      }
      if (end < remaining.length) {
        const wordBoundary = remaining.lastIndexOf(" ", end);
        if (wordBoundary > 0) end = wordBoundary;
      }
      lines.push(remaining.slice(0, end).trim());
      remaining = remaining.slice(end).trimStart();
    }
    for (const line of lines) {
      draw(line, 45, 9);
      y -= 13;
    }
  }
  y -= 34; draw("PRODUCTION SUMMARY", 45, 8, bold, gold);
  y -= 21; draw(`Total Capitalization: ${money(statement.settings.totalCapitalization)}`, 45, 10, bold, green);
  draw(`Operational Cost Per Week (6): ${money(OPERATIONAL_COST_PER_WEEK)}`, 300, 10, bold, green);
  y -= 34; draw("THEATRE BOX OFFICE", 45, 8, bold, gold);
  const weeklyChanges = statement.theatres.map((theatre) => theatre.weeklyChange);
  const totalWeeklyChange = weeklyChanges.every(
    (value): value is number => typeof value === "number",
  )
    ? weeklyChanges.reduce((sum, value) => sum + (value ?? 0), 0)
    : null;
  const totalGross = statement.theatres.reduce(
    (sum, theatre) => sum + theatre.actual,
    0,
  );
  const totalGoal = statement.theatres.reduce(
    (sum, theatre) => sum + theatre.potential,
    0,
  );
  y -= 19;
  draw("THEATRE", 45, 5.5, bold);
  drawRight("PERFORMANCES", 155, 5.5, bold);
  drawRight("CURRENT GROSS", 250, 5.5, bold);
  drawRight("CURRENT NET", 340, 5.5, bold);
  drawRight("CHANGE SINCE PRIOR", 430, 5.5, bold);
  drawRight("GOAL", 550, 5.5, bold);
  for (const theatre of statement.theatres) {
    y -= 18;
    draw(theatre.name.toUpperCase(), 45, 8, bold, green);
    drawRight(String(theatre.performances), 155, 8);
    drawRight(money(theatre.actual), 250, 8, bold, green);
    drawRight(money(theatre.net), 340, 8, bold, green);
    drawRight(signedMoney(theatre.weeklyChange), 430, 8);
    drawRight(money(theatre.potential), 550, 8);
  }
  y -= 7; page.drawLine({ start: { x: 45, y }, end: { x: 550, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.76) });
  y -= 16;
  draw("TOTAL", 45, 8, bold, green);
  drawRight(
    String(statement.theatres.reduce((sum, theatre) => sum + theatre.performances, 0)),
    155,
    8,
    bold,
  );
  drawRight(money(totalGross), 250, 8, bold, green);
  drawRight(money(statement.financialSummary.totalNet), 340, 8, bold, green);
  drawRight(signedMoney(totalWeeklyChange), 430, 8, bold);
  drawRight(money(totalGoal), 550, 8, bold);
  y -= 28; draw("INVESTOR SUMMARY", 45, 8, bold, gold);
  const currentUnitPrice =
    statement.settings.currentUnitPrice ?? CURRENT_TSWL_UNIT_PRICE;
  const currency = investorCurrency(statement.investor);
  const originalInvestmentGBP = investorGbpBasis(statement.investor);
  const originalInvestmentAmount = investorOriginalAmount(statement.investor);
  const reportingExchangeRate = statement.settings.gbpUsdExchangeRate;
  const currentValuationGBP = investorValuation(
    originalInvestmentGBP,
    currentUnitPrice,
  );
  const currentValuation = investorReportingValue(
    currentValuationGBP,
    statement.investor,
    reportingExchangeRate,
  );
  const pricePaid =
    currency === "USD"
      ? TSWL_UNIT_SIZE *
        (statement.investor.investmentExchangeRate || reportingExchangeRate)
      : TSWL_UNIT_SIZE;
  const todayPrice = investorReportingValue(
    currentUnitPrice,
    statement.investor,
    reportingExchangeRate,
  );
  const totalGain = currentValuation - originalInvestmentAmount;
  y -= 19;
  draw("SYMBOL", 45, 5.2, bold);
  drawRight("UNITS", 110, 5.2, bold);
  drawRight("ORIGINAL INVESTMENT", 205, 5.2, bold);
  drawRight("PRICE PAID", 280, 5.2, bold);
  drawRight("TODAY'S PRICE", 355, 5.2, bold);
  drawRight("CURRENT VALUATION", 460, 5.2, bold);
  drawRight("TOTAL GAIN", 550, 5.2, bold);
  y -= 20;
  draw("TSWL", 45, 8, bold, green);
  drawRight(
    formatTswlUnits(originalInvestmentGBP),
    110,
    8,
  );
  drawRight(
    currencyMoney(originalInvestmentAmount, currency),
    205,
    8,
  );
  drawRight(currencyMoney(pricePaid, currency), 280, 8);
  drawRight(currencyMoney(todayPrice, currency), 355, 8, bold, green);
  drawRight(currencyMoney(currentValuation, currency), 460, 8, bold, green);
  drawRight(signedCurrencyMoney(totalGain, currency), 550, 8, bold, green);
  y -= 18;
  page.drawRectangle({
    x: 45,
    y: y - 34,
    width: 505,
    height: 42,
    color: green,
  });
  page.drawText("CURRENT STATEMENT VALUE", {
    x: 58,
    y: y - 4,
    size: 6,
    font: bold,
    color: rgb(0.75, 0.82, 0.78),
  });
  page.drawText(currencyMoney(currentValuation, currency), {
    x: 58,
    y: y - 25,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  y -= 54;
  y -= 38; draw("VALUATION BASIS", 45, 8, bold, gold);
  y -= 17; draw(statement.valuationBasis, 45, 9);
  if (currency === "USD") {
    y -= 16;
    draw(
      "Production accounts and TSWL Units are maintained in GBP. Current USD values are converted using the exchange rate",
      45,
      7,
    );
    y -= 11;
    draw("set by the Producer for investor reporting.", 45, 7);
    y -= 11;
    draw(
      `Current reporting exchange rate: £1 = $${reportingExchangeRate.toFixed(2)}`,
      45,
      7,
      bold,
    );
  }
  y -= 48;
  const disclaimer = "This statement is provided for informational purposes only. The investment is not publicly traded, and the stated value does not represent a guaranteed sale price, return or independently verified market valuation. Future production plans, box-office potential and financial projections are not guarantees of performance.";
  draw(disclaimer.slice(0, 100), 45, 7);
  y -= 11; draw(disclaimer.slice(100, 205), 45, 7);
  y -= 11; draw(disclaimer.slice(205), 45, 7);
  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="TSWL-statement-${statement.investor.accountNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
