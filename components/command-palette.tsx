"use client";

import { Command } from "cmdk";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminNav, userNav } from "@/lib/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string; section: string };

export function CommandPalette({
  open,
  setOpen,
  role = "user"
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  role?: "user" | "admin";
}) {
  const router = useRouter();
  const items = useMemo<Item[]>(
    () =>
      (role === "admin" ? adminNav : userNav).map((item) => ({
        label: item.label,
        href: item.href,
        section: role === "admin" ? "Admin" : "Dashboard"
      })),
    [role]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close command palette"
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative mx-auto flex max-w-2xl items-start justify-center p-4 pt-24">
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <Command className="w-full">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-fg" />
              <Command.Input
                placeholder="Search navigation..."
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-fg"
              />
            </div>
            <Command.List className="max-h-[420px] overflow-y-auto p-2">
              <Command.Empty className="px-4 py-10 text-center text-sm text-muted-fg">
                No matches found.
              </Command.Empty>
              {items.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm outline-none data-[selected=true]:bg-muted"
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-muted-fg">{item.section}</span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </div>
      </div>
    </div>
  );
}
