import {
  Banknote,
  Bell,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  CreditCard,
  FileText,
  HandCoins,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  LogOut,
  MessageSquareText,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Settings,
  Users,
  Wallet
} from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const userNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Building2 },
  { href: "/dashboard/transfers", label: "Transfers", icon: Banknote },
  { href: "/dashboard/cards", label: "Cards", icon: CreditCard },
  { href: "/dashboard/payments", label: "Payments", icon: Receipt },
  { href: "/dashboard/savings", label: "Savings", icon: PiggyBank },
  { href: "/dashboard/investments", label: "Investments", icon: LineChart },
  { href: "/dashboard/loans", label: "Loans", icon: HandCoins },
  { href: "/dashboard/rewards", label: "Rewards", icon: CircleDollarSign },
  { href: "/dashboard/crypto", label: "Crypto", icon: Wallet },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/accounts", label: "Accounts", icon: Building2 },
  { href: "/admin/transactions", label: "Transactions", icon: FileText },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/loans", label: "Loans", icon: HandCoins },
  { href: "/admin/investments", label: "Investments", icon: LineChart },
  { href: "/admin/kyc-verification", label: "KYC Verification", icon: ShieldCheck },
  { href: "/admin/reports", label: "Reports", icon: BriefcaseBusiness },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/security", label: "Security", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/logs", label: "Logs", icon: MessageSquareText }
];


