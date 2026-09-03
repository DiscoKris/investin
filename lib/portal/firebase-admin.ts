import "server-only";

import { getVercelOidcToken } from "@vercel/oidc";
import {
  applicationDefault,
  getApps,
  initializeApp,
  type Credential,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ExternalAccountClient } from "google-auth-library";

const FIREBASE_ADMIN_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/identitytoolkit",
  "https://www.googleapis.com/auth/userinfo.email",
];

const GOOGLE_WIF_AUDIENCE =
  /^https:\/\/iam\.googleapis\.com\/projects\/\d+\/locations\/global\/workloadIdentityPools\/[a-zA-Z0-9_-]+\/providers\/[a-zA-Z0-9_-]+$/;

function workloadIdentityCredential(
  audience: string,
  clientEmail: string,
): Credential {
  if (!GOOGLE_WIF_AUDIENCE.test(audience)) {
    throw new Error("Firebase Admin workload identity audience is invalid.");
  }

  const authClient = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${clientEmail}:generateAccessToken`,
    scopes: FIREBASE_ADMIN_SCOPES,
    subject_token_supplier: {
      getSubjectToken: () => getVercelOidcToken({ audience }),
    },
  });

  if (!authClient) {
    throw new Error("Firebase Admin workload identity could not be initialized.");
  }

  return {
    async getAccessToken() {
      const response = await authClient.getAccessToken();
      if (!response.token) {
        throw new Error("Google Cloud did not return an access token.");
      }

      const expiryDate = authClient.credentials.expiry_date;
      return {
        access_token: response.token,
        expires_in: expiryDate
          ? Math.max(1, Math.floor((expiryDate - Date.now()) / 1000))
          : 3600,
      };
    },
  };
}

function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const workloadIdentityAudience =
    process.env.FIREBASE_ADMIN_WIF_AUDIENCE?.trim();

  if (!projectId) {
    throw new Error("Firebase Admin project ID is missing.");
  }
  if (workloadIdentityAudience && !clientEmail) {
    throw new Error("Firebase Admin service account email is missing.");
  }
  if (process.env.VERCEL && !workloadIdentityAudience) {
    throw new Error("Firebase Admin workload identity audience is missing.");
  }

  return initializeApp({
    credential: workloadIdentityAudience
      ? workloadIdentityCredential(workloadIdentityAudience, clientEmail!)
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
