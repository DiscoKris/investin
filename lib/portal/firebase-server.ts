import "server-only";

import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function getFirebaseServerContext(idToken: string) {
  const app = initializeServerApp(firebaseConfig, { authIdToken: idToken });
  const auth = getAuth(app);
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) return null;
  return {
    user,
    db: initializeFirestore(app, { ignoreUndefinedProperties: true }),
  };
}
