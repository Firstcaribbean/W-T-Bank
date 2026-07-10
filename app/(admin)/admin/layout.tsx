import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth";
import { demoAdminProfile, demoNotifications } from "@/lib/mock-bank";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = (await requireAdmin()) ?? demoAdminProfile;
  return (
    <AppShell
      role="admin"
      user={{
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url
      }}
      title="Admin Dashboard"
      subtitle="Monitor platform health, users, accounts, and compliance workflows."
      notifications={demoNotifications.filter((item) => !item.read).length}
      messages={2}
      promo={false}
    >
      {children}
    </AppShell>
  );
}

