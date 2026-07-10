import { AdminDashboardHome } from "@/components/admin-dashboard-home";
import { getAdminDashboardData } from "@/lib/server-data";

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  return <AdminDashboardHome {...data} />;
}
