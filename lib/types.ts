export type Role = "admin" | "user";
export type Status = "verified" | "pending" | "rejected" | "suspended";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
  account_type: string | null;
  status: Status;
  created_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  type: string;
  account_number: string;
  balance: number;
  currency: string;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  type: string;
  category: string;
  counterparty: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

