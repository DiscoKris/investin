"use client";

import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/portal/firebase-client";

export function LogoutButton({ className = "" }: { className?: string }) {
  async function logout() {
    await signOut(getFirebaseAuth());
    window.location.replace("/login");
  }
  return (
    <button type="button" onClick={logout} className={className}>
      Log out
    </button>
  );
}
