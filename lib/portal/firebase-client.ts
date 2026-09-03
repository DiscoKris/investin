"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseAuth() {
  const firebaseApp =
    getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(firebaseApp);
}

let firestore: Firestore | null = null;

export function getFirebaseDb() {
  const auth = getFirebaseAuth();
  if (firestore) return firestore;
  try {
    firestore = initializeFirestore(auth.app, {
      ignoreUndefinedProperties: true,
    });
  } catch {
    firestore = getFirestore(auth.app);
  }
  return firestore;
}

let persistencePromise: Promise<void> | null = null;

export function ensureAuthPersistence() {
  persistencePromise ??= setPersistence(
    getFirebaseAuth(),
    browserLocalPersistence,
  );
  return persistencePromise;
}

export async function getPortalAccess(user: User) {
  const response = await fetch("/api/auth/resolve", {
    method: "POST",
    cache: "no-store",
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
  });
  const result = (await response.json().catch(() => ({}))) as {
    access?: "admin" | "investor" | null;
    error?: string;
  };
  if (!response.ok) {
    throw new Error(result.error || "Unable to verify account access.");
  }
  return result.access ?? null;
}
