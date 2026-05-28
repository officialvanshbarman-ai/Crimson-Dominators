import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Crimson Dominators",
  description: "Crimson Dominators admin panel",
};

export default function AdminPage() {
  return <AdminPanel />;
}
