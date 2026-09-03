"use client";

import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ensureAuthPersistence,
  getFirebaseAuth,
  getPortalAccess,
} from "@/lib/portal/firebase-client";

const AdminAuthContext = createContext<User | null>(null);

export function useAdminAuth() {
  const user = useContext(AdminAuthContext);
  if (!user) {
    throw new Error("useAdminAuth must be used inside AdminAuthGuard.");
  }
  return user;
}

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    let active = true;

    void ensureAuthPersistence().then(() => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        const access = await getPortalAccess(user).catch(() => null);
        if (access !== "admin") {
          router.replace(access === "investor" ? "/statement" : "/login");
          return;
        }
        if (active) setAdminUser(user);
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  if (!adminUser) {
    return (
      <div className="portal-page flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-[#647168]" role="status">
          Checking administrator access…
        </p>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={adminUser}>
      {children}
    </AdminAuthContext.Provider>
  );
}
