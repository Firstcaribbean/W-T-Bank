import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { demoNotifications, demoProfile } from "@/lib/mock-bank";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = (await requireUser()) ?? demoProfile;
  return (
    <AppShell
      role="user"
      user={{
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url
      }}
      title="Dashboard"
      subtitle="Your money, accounts, cards, and insights in one secure place."
      notifications={demoNotifications.filter((item) => !item.read).length}
      messages={1}
    >
      {children}
    </AppShell>
  );
}
