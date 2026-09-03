import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Firestore,
} from "firebase/firestore";
import {
  normalizeSettings,
  normalizeTheatreTerms,
  THEATRES,
} from "./constants";
import {
  createStatementSnapshot,
  entriesForCalculation,
  normalizeStatementSnapshot,
} from "./finance";
import type {
  AuditEntry,
  BoxOfficeEntry,
  Investor,
  PortalSettings,
  StatementSnapshot,
  Theatre,
  TheatreKey,
  TheatreTerms,
} from "./types";

function clean<T>(data: DocumentData): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value instanceof Timestamp ? value.toDate().toISOString() : value,
    ]),
  ) as T;
}

function cleanInvestor(id: string, data: DocumentData): Investor {
  const investor = clean<Investor>(data);
  const originalInvestment = Number(investor.originalInvestment || 0);
  const investmentCurrency =
    investor.investmentCurrency === "USD" ? "USD" : "GBP";
  const originalInvestmentGBP = Number(
    investor.originalInvestmentGBP ?? originalInvestment,
  );
  const originalInvestmentAmount = Number(
    investor.originalInvestmentAmount ?? originalInvestment,
  );
  return {
    uid: id,
    fullName: investor.fullName,
    address: investor.address,
    addressLine1: investor.addressLine1,
    addressLine2: investor.addressLine2,
    city: investor.city,
    region: investor.region,
    postalCode: investor.postalCode,
    country: investor.country,
    email: investor.email,
    authenticationUid: investor.authenticationUid,
    activatedAt: investor.activatedAt,
    loginStatus: investor.loginStatus,
    invitationSentAt: investor.invitationSentAt,
    telephone: investor.telephone,
    accountNumber: investor.accountNumber,
    investmentCurrency,
    originalInvestmentAmount,
    originalInvestmentGBP,
    investmentExchangeRate: Number(
      investor.investmentExchangeRate ??
        (investmentCurrency === "USD" && originalInvestmentGBP > 0
          ? originalInvestmentAmount / originalInvestmentGBP
          : 1),
    ),
    originalInvestment: originalInvestmentGBP,
    participationPercentage: investor.participationPercentage || 0,
    capitalRecouped: 0,
    recoveryPercentage: 0,
    capitalRemaining: originalInvestmentGBP,
    currentStatementValue:
      investor.currentStatementValue ?? originalInvestmentGBP,
    investorStatus: investor.investorStatus,
    valuationBasis: investor.valuationBasis,
    administrativeNote: investor.administrativeNote,
    isTest: investor.isTest,
    subscriptionDate: investor.subscriptionDate,
    lastLoginAt: investor.lastLoginAt,
    lastStatementSentAt: investor.lastStatementSentAt,
    lastStatementEmailStatus: investor.lastStatementEmailStatus,
    createdAt: investor.createdAt,
    updatedAt: investor.updatedAt,
  };
}

export async function getSettings(db: Firestore): Promise<PortalSettings> {
  const snapshot = await getDoc(doc(db, "production", "settings"));
  return normalizeSettings(snapshot.exists() ? clean(snapshot.data()) : {});
}

export async function getTheatres(db: Firestore): Promise<Theatre[]> {
  const snapshots = await Promise.all(
    THEATRES.map((theatre) => getDoc(doc(db, "theatres", theatre.id))),
  );
  return THEATRES.map((fallback, index) =>
    snapshots[index].exists()
      ? {
          ...fallback,
          ...clean<Theatre>(snapshots[index].data()),
          potential: fallback.potential,
        }
      : fallback,
  );
}

export async function getTheatreTerms(
  db: Firestore,
): Promise<Record<TheatreKey, TheatreTerms>> {
  const theatreIds: TheatreKey[] = ["leeds", "hull", "london"];
  const snapshots = await Promise.all(
    theatreIds.map((theatre) => getDoc(doc(db, "theatreTerms", theatre))),
  );
  return Object.fromEntries(
    theatreIds.map((theatre, index) => [
      theatre,
      normalizeTheatreTerms(
        theatre,
        snapshots[index].exists()
          ? clean<Partial<TheatreTerms>>(snapshots[index].data())
          : {},
      ),
    ]),
  ) as Record<TheatreKey, TheatreTerms>;
}

export async function getInvestors(db: Firestore): Promise<Investor[]> {
  const snapshot = await getDocs(
    query(collection(db, "investors"), orderBy("fullName")),
  );
  return snapshot.docs.map((item) => cleanInvestor(item.id, item.data()));
}

export async function getInvestor(
  db: Firestore,
  uid: string,
): Promise<Investor | null> {
  const snapshot = await getDoc(doc(db, "investors", uid));
  return snapshot.exists()
    ? cleanInvestor(snapshot.id, snapshot.data())
    : null;
}

export async function getEntries(db: Firestore): Promise<BoxOfficeEntry[]> {
  const snapshot = await getDocs(collection(db, "boxOfficeEntries"));
  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...clean<Omit<BoxOfficeEntry, "id">>(item.data()),
    }))
    .sort((first, second) =>
      String(first.performanceDate ?? "").localeCompare(
        String(second.performanceDate ?? ""),
      ),
    );
}

export async function getCurrentStatement(db: Firestore, uid: string) {
  const [investor, entries, settings, theatres, theatreTerms] =
    await Promise.all([
      getInvestor(db, uid),
      getEntries(db),
      getSettings(db),
      getTheatres(db),
      getTheatreTerms(db),
    ]);
  if (!investor) return null;
  const calculationEntries = entriesForCalculation(
    entries,
    theatres,
    theatreTerms,
  );
  const snapshot = createStatementSnapshot(
    investor,
    calculationEntries,
    settings,
    theatreTerms,
  );
  snapshot.theatres = snapshot.theatres.map((item) => ({
    ...item,
    performances:
      theatres.find((theatre) => theatre.id === item.id)?.performances ??
      item.performances,
    cumulativeGross: theatres.find((theatre) => theatre.id === item.id)
      ?.cumulativeGross,
    previousGross: theatres.find((theatre) => theatre.id === item.id)
      ?.previousGross,
    weeklyChange: theatres.find((theatre) => theatre.id === item.id)
      ?.weeklyChange,
    actual:
      theatres.find((theatre) => theatre.id === item.id)?.cumulativeGross ??
      item.actual,
  }));
  return snapshot;
}

export async function getIssuedStatement(db: Firestore, uid: string) {
  const snapshot = await getDocs(
    query(
      collection(db, "statements"),
      where("investor.authenticationUid", "==", uid),
      where("issued", "==", true),
    ),
  );
  const statements = snapshot.docs
    .map((item) =>
      normalizeStatementSnapshot({
        id: item.id,
        ...clean<Omit<StatementSnapshot, "id">>(item.data()),
      }),
    )
    .sort(
      (first, second) =>
        new Date(second.statementDate).getTime() -
        new Date(first.statementDate).getTime(),
    );
  return statements[0] ?? null;
}

export async function issueStatement(
  db: Firestore,
  uid: string,
  issued: boolean,
  note?: string,
) {
  const statement = await getCurrentStatement(db, uid);
  if (!statement) throw new Error("Investor not found");
  const reference = doc(collection(db, "statements"));
  const record: StatementSnapshot = {
    ...statement,
    id: reference.id,
    issued,
    privateNote: note,
  };
  await setDoc(reference, {
    ...record,
    statementDate: Timestamp.fromDate(new Date(record.statementDate)),
  });
  return record;
}

export async function archiveEmailedStatement(
  db: Firestore,
  statement: StatementSnapshot,
  recipientEmail: string,
  administratorUid: string,
  emailProviderMessageId: string,
  deliveryId?: string,
) {
  const statementReference = deliveryId
    ? doc(db, "statements", deliveryId)
    : doc(collection(db, "statements"));
  const auditReference = deliveryId
    ? doc(db, "adminAuditLog", `statement-email-${deliveryId}`)
    : doc(collection(db, "adminAuditLog"));
  await runTransaction(db, async (transaction) => {
    if (deliveryId && (await transaction.get(statementReference)).exists()) {
      return;
    }
    transaction.set(statementReference, {
      ...statement,
      id: statementReference.id,
      issued: true,
      statementDate: Timestamp.fromDate(new Date(statement.statementDate)),
      recipientEmail,
      emailDeliveryStatus: "sent",
      emailedAt: serverTimestamp(),
      emailProviderMessageId,
    });
    transaction.set(auditReference, {
      administratorUid,
      action: "Statement emailed",
      timestamp: serverTimestamp(),
      recordAffected: statementReference.path,
      previousValue: null,
      newValue: {
        investorUid: statement.investorUid,
        recipientEmail,
        statementDate: statement.statementDate,
        emailDeliveryStatus: "sent",
        emailProviderMessageId,
      },
    });
  });
  return statementReference.id;
}

export async function getStatementHistory(
  db: Firestore,
): Promise<StatementSnapshot[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "statements"),
      orderBy("statementDate", "desc"),
      limit(250),
    ),
  );
  return snapshot.docs.map((item) =>
    normalizeStatementSnapshot({
      id: item.id,
      ...clean<Omit<StatementSnapshot, "id">>(item.data()),
    }),
  );
}

export async function getAuditLog(db: Firestore): Promise<AuditEntry[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "adminAuditLog"),
      orderBy("timestamp", "desc"),
      limit(250),
    ),
  );
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...clean<Omit<AuditEntry, "id">>(item.data()),
  }));
}

export async function regenerateDraftStatements(db: Firestore) {
  const investors = await getInvestors(db);
  const batch = writeBatch(db);
  for (const investor of investors) {
    const statement = await getCurrentStatement(db, investor.uid);
    if (statement) {
      batch.set(doc(db, "statementDrafts", investor.uid), statement);
    }
  }
  await batch.commit();
}

export async function addAudit(
  db: Firestore,
  adminUid: string,
  action: string,
  recordAffected: string,
  previousValue: unknown,
  newValue: unknown,
) {
  await addDoc(collection(db, "adminAuditLog"), {
    administratorUid: adminUid,
    action,
    timestamp: serverTimestamp(),
    recordAffected,
    previousValue: previousValue ?? null,
    newValue: newValue ?? null,
  });
}

export async function nextAccountNumber(db: Firestore) {
  return runTransaction(db, async (transaction) => {
    const reference = doc(db, "accountCounters", "investors");
    const current = await transaction.get(reference);
    const next = Number(current.data()?.value || 0) + 1;
    transaction.set(reference, { value: next }, { merge: true });
    return `TSWL-2027-${String(next).padStart(6, "0")}`;
  });
}

export async function writeInvestor(
  db: Firestore,
  uid: string,
  data: DocumentData,
  createOnly = false,
) {
  const reference = doc(db, "investors", uid);
  if (createOnly && (await getDoc(reference)).exists()) {
    throw new Error("Investor already exists");
  }
  await setDoc(reference, data, { merge: !createOnly });
}

export async function updateInvestor(
  db: Firestore,
  uid: string,
  data: DocumentData,
) {
  await updateDoc(doc(db, "investors", uid), data);
}
