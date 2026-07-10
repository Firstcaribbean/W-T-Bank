"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Menu,
  MoonStar,
  PanelLeftClose,
  Search,
  Shield,
  SunMedium,
  LogOut,
  Mail,
  Bell,
  ChevronRight,
  MessageSquareText
} from "lucide-react";
import { useTheme } from "next-themes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { adminNav, userNav } from "@/lib/navigation";
import { Avatar, Badge, Button, Card, CardContent, CardHeader, Separator } from "@/components/ui";
import { CommandPalette } from "@/components/command-palette";
import { cn, initials } from "@/lib/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <SunMedium className="h-4 w-4 dark:hidden" />
      <MoonStar className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}

export function AppShell({
  role,
  user,
  title,
  subtitle,
  children,
  notifications = 0,
  messages = 0,
  promo = true
}: {
  role: "user" | "admin";
  user: {
    full_name: string;
    email: string;
    avatar_url?: string | null;
  };
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  notifications?: number;
  messages?: number;
  promo?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = role === "admin" ? adminNav : userNav;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className={cn("min-h-screen bg-bg text-fg", role === "admin" && "dark") }>
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} role={role} />
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[290px] transform border-r border-border bg-[#07111f] text-slate-100 transition-transform duration-300 lg:translate-x-0",
            drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col p-4">
            <div className="mb-6 flex items-center justify-between">
              <Link href={role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide">W&T BET Bank</div>
                  <div className="text-xs text-slate-400">{role === "admin" ? "Admin Dashboard" : "Personal Banking"}</div>
                </div>
              </Link>
              <button className="rounded-xl p-2 text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setDrawerOpen(false)}>
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                      active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-300 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {promo ? (
              <div className="mt-4 space-y-3">
                <Card className="border-white/10 bg-white/5 text-white shadow-none">
                  <CardHeader className="pb-2">
                    <div className="text-sm font-semibold">Get your physical card</div>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm text-slate-300">
                    Enjoy cashless payments with a premium physical card.
                    <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600" onClick={() => router.push("/dashboard/cards")}>Order Now ?</Button>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5 text-white shadow-none">
                  <CardHeader className="pb-2">
                    <div className="text-sm font-semibold">Security Center</div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Account protection active</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </aside>

        {drawerOpen ? <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setDrawerOpen(false)} /> : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-[290px]">
          <header className={cn("sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur") }>
            <div className="flex items-center gap-3 px-4 py-4 lg:px-6">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>

              <div className="hidden flex-1 items-center gap-2 lg:flex">
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="flex h-11 min-w-[340px] items-center gap-3 rounded-2xl border border-border bg-card px-4 text-sm text-muted-fg"
                >
                  <Search className="h-4 w-4" />
                  <span>Search pages, actions, transactions...</span>
                  <kbd className="ml-auto rounded-lg border border-border bg-muted px-2 py-1 text-[11px] font-semibold text-muted-fg">?K</kbd>
                </button>
              </div>

              <div className="ml-auto flex items-center gap-1">
                {role === "admin" ? <ThemeToggle /> : null}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /> : null}
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Mail className="h-4 w-4" />
                  {messages ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" /> : null}
                </Button>
                <div className="ml-1 flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2">
                  <Avatar src={user.avatar_url} fallback={initials(user.full_name)} />
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold leading-tight">{user.full_name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-fg">
                      <span>{role === "admin" ? "Super Admin" : "Premium User"}</span>
                      <Badge tone="info" className="px-2 py-0.5">Active</Badge>
                    </div>
                  </div>
                  <button className="text-muted-fg hover:text-fg" onClick={() => router.push(role === "admin" ? "/admin/settings" : "/dashboard/settings") }>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-6">
            <div className="mx-auto w-full max-w-[1600px] space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                  {subtitle ? <p className="mt-1 text-sm text-muted-fg">{subtitle}</p> : null}
                </div>
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="flex h-11 items-center gap-3 rounded-2xl border border-border bg-card px-4 text-sm text-muted-fg lg:hidden"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
