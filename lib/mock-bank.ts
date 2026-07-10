import type { Account, Notification, Profile, Transaction } from "@/lib/types";

export const demoProfile: Profile = {
  id: "demo-user",
  full_name: "Amina Yusuf",
  email: "amina@example.com",
  phone: "+1 (555) 230-9182",
  avatar_url: null,
  role: "user",
  account_type: "Retail",
  status: "verified",
  created_at: new Date().toISOString()
};

export const demoAdminProfile: Profile = {
  ...demoProfile,
  id: "demo-admin",
  full_name: "Sofia Mensah",
  email: "admin@wtbetbank.com",
  role: "admin"
};

export const demoAccounts: Account[] = [
  {
    id: "acc-1",
    user_id: demoProfile.id,
    type: "checking",
    account_number: "2345678910",
    balance: 12842.78,
    currency: "USD",
    created_at: new Date().toISOString()
  },
  {
    id: "acc-2",
    user_id: demoProfile.id,
    type: "savings",
    account_number: "9988776655",
    balance: 43210.5,
    currency: "USD",
    created_at: new Date().toISOString()
  },
  {
    id: "acc-3",
    user_id: demoProfile.id,
    type: "investment",
    account_number: "1122334455",
    balance: 76420.11,
    currency: "USD",
    created_at: new Date().toISOString()
  }
];

const categories = ["Shopping", "Housing", "Food & Dining", "Transport", "Entertainment", "Others"];
const merchants = ["Amazon", "Rent", "Uber", "Spotify", "Groceries", "Airline", "Shell", "Netflix", "Electricity"];

export const demoTransactions: Transaction[] = Array.from({ length: 18 }).map((_, index) => {
  const type = index % 3 === 0 ? "deposit" : index % 2 === 0 ? "card_payment" : "transfer";
  const amount = [120, 87, 245, 310, 54, 990, 72, 180, 430][index % 9];
  return {
    id: `txn-${index}`,
    user_id: demoProfile.id,
    account_id: demoAccounts[index % demoAccounts.length].id,
    type,
    category: categories[index % categories.length],
    counterparty: merchants[index % merchants.length],
    amount: type === "deposit" ? amount : -amount,
    status: "completed",
    created_at: new Date(Date.now() - index * 86400000).toISOString()
  };
});

export const demoNotifications: Notification[] = [
  { id: "n1", user_id: demoProfile.id, title: "Transfer completed", body: "Your transfer to K. Mensah was successful.", read: false, created_at: new Date().toISOString() },
  { id: "n2", user_id: demoProfile.id, title: "Card payment", body: "Your card ending in 4455 was charged.", read: true, created_at: new Date().toISOString() }
];

export const demoExchangeRates = [
  { pair: "USD/NGN", rate: 1520.22, change_pct: 0.62 },
  { pair: "EUR/NGN", rate: 1654.13, change_pct: -0.31 },
  { pair: "GBP/NGN", rate: 1942.55, change_pct: 0.15 },
  { pair: "BTC/USD", rate: 62340.11, change_pct: 1.24 }
];

export const demoCards = [
  { id: "card-1", user_id: demoProfile.id, account_id: "acc-1", card_number_masked: "**** **** **** 4455", card_network: "visa", type: "debit", expiry: "09/29", status: "active" },
  { id: "card-2", user_id: demoProfile.id, account_id: "acc-2", card_number_masked: "**** **** **** 9811", card_network: "mastercard", type: "credit", expiry: "01/30", status: "active" }
];

export function spendingByCategory() {
  return categories.map((category, index) => ({
    category,
    amount: [1240, 940, 760, 510, 340, 220][index],
    color: ["#3b82f6", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#64748b"][index]
  }));
}

export function adminKpiSnapshot() {
  return {
    totalUsers: 2486,
    totalAccounts: 3620,
    totalTransactions: 18241,
    totalBalance: 134204840.93,
    totalProfit: 284210.2
  };
}

export function userSummary() {
  return {
    totalBalance: demoAccounts.reduce((sum, account) => sum + account.balance, 0),
    checking: demoAccounts[0],
    savings: demoAccounts[1],
    investment: demoAccounts[2],
    change: 12.5
  };
}
