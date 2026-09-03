import "server-only";

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function privateKey() {
  return process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim().replace(/\\n/g, "\n");
}

function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const key = privateKey();
  const suppliedServiceAccount = Boolean(clientEmail || key);

  if (suppliedServiceAccount && (!projectId || !clientEmail || !key)) {
    throw new Error("Firebase Admin credentials are incomplete.");
  }

  return initializeApp({
    credential: suppliedServiceAccount
      ? cert({ projectId: projectId!, clientEmail: clientEmail!, privateKey: key! })
      : applicationDefault(),
    projectId,
  });
}

export function getFirebaseAdminDb() {
  return getFirestore(getAdminApp());
}

export function getFirebaseAdminAuth() {
  return getAuth(getAdminApp());
}
