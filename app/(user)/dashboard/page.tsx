import { UserDashboardHome } from "@/components/user-dashboard-home";
import { getUserDashboardData } from "@/lib/server-data";

export default async function DashboardPage() {
  const data = await getUserDashboardData();
  return <UserDashboardHome profile={data.profile as any} accounts={data.accounts as any} transactions={data.transactions as any} spending={data.spending as any} />;
}

