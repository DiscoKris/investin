"use client";

import { getFirebaseAuth, getPortalAccess } from "./firebase-client";

export async function requireActiveAdminUser() {
  const auth = getFirebaseAuth();
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if ((await getPortalAccess(user)) !== "admin") {
    throw new Error("Administrator access is required.");
  }
  return user;
}

export async function authenticatedAdminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const user = await requireActiveAdminUser();
  const token = await user.getIdToken();
  return fetch(input, {
    ...init,
    cache: init.cache ?? "no-store",
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}
