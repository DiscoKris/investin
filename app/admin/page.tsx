import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/portal/admin-auth-guard";
import { AdminDashboard } from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Investor Administration",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  );
}
