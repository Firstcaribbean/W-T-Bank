create extension if not exists "pgcrypto";

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user')),
  account_type text,
  status text not null default 'pending' check (status in ('verified', 'pending', 'rejected', 'suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('checking', 'savings', 'investment', 'current', 'fixed_deposit')),
  account_number text not null unique,
  balance numeric(14,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  type text not null check (type in ('deposit', 'withdrawal', 'transfer', 'bill_payment', 'card_payment', 'airtime')),
  category text not null,
  counterparty text not null,
  amount numeric(14,2) not null,
  status text not null default 'completed' check (status in ('completed', 'pending', 'failed')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  card_number_masked text not null,
  card_network text not null check (card_network in ('visa', 'mastercard')),
  type text not null check (type in ('debit', 'credit')),
  expiry text not null,
  status text not null default 'active' check (status in ('active', 'frozen', 'revoked')),
  created_at timestamptz not null default now()
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'active', 'closed')),
  interest_rate numeric(5,2) not null,
  term_months integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  amount numeric(14,2) not null,
  current_value numeric(14,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.kyc_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('verified', 'pending', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  pair text not null unique,
  rate numeric(14,4) not null,
  change_pct numeric(8,2) not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  priority text not null default 'normal',
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.beneficiaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  account_number text not null,
  bank_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  target_amount numeric(14,2) not null,
  saved_amount numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_revenue (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  amount numeric(14,2) not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.can_access_row(row_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() = row_user_id or public.is_admin();
$$;

create or replace function public.log_audit(p_action text, p_entity text, p_entity_id uuid, p_metadata jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs(actor_id, action, entity, entity_id, metadata)
  values (auth.uid(), p_action, p_entity, p_entity_id, p_metadata);
end;
$$;

create or replace function public.transfer_funds(
  p_from_account_id uuid,
  p_to_account_number text,
  p_amount numeric,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from_account public.accounts;
  v_to_account public.accounts;
  v_amount numeric(14,2) := round(p_amount::numeric, 2);
  v_transaction_id uuid;
begin
  if v_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  select * into v_from_account from public.accounts where id = p_from_account_id for update;
  if not found then
    raise exception 'Source account not found';
  end if;

  if not public.can_access_row(v_from_account.user_id) then
    raise exception 'Unauthorized';
  end if;

  select * into v_to_account from public.accounts where account_number = p_to_account_number for update;
  if not found then
    raise exception 'Recipient account not found';
  end if;

  if v_from_account.balance < v_amount then
    raise exception 'Insufficient funds';
  end if;

  update public.accounts set balance = balance - v_amount where id = v_from_account.id;
  update public.accounts set balance = balance + v_amount where id = v_to_account.id;

  insert into public.transactions(user_id, account_id, type, category, counterparty, amount, status, note)
  values (v_from_account.user_id, v_from_account.id, 'transfer', 'Transfer', v_to_account.account_number, -v_amount, 'completed', p_note)
  returning id into v_transaction_id;

  insert into public.transactions(user_id, account_id, type, category, counterparty, amount, status, note)
  values (v_to_account.user_id, v_to_account.id, 'deposit', 'Transfer', v_from_account.account_number, v_amount, 'completed', p_note);

  perform public.log_audit('transfer_funds', 'transactions', v_transaction_id, jsonb_build_object('amount', v_amount));
  return jsonb_build_object('ok', true, 'transaction_id', v_transaction_id);
end;
$$;

create or replace function public.pay_bill(
  p_account_id uuid,
  p_biller text,
  p_amount numeric,
  p_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.accounts;
  v_amount numeric(14,2) := round(p_amount::numeric, 2);
  v_transaction_id uuid;
begin
  select * into v_account from public.accounts where id = p_account_id for update;
  if not found then raise exception 'Account not found'; end if;
  if not public.can_access_row(v_account.user_id) then raise exception 'Unauthorized'; end if;
  if v_account.balance < v_amount then raise exception 'Insufficient funds'; end if;

  update public.accounts set balance = balance - v_amount where id = v_account.id;

  insert into public.transactions(user_id, account_id, type, category, counterparty, amount, status, note)
  values (v_account.user_id, v_account.id, 'bill_payment', 'Bills', p_biller, -v_amount, 'completed', p_reference)
  returning id into v_transaction_id;

  insert into public.platform_revenue(source, amount) values ('bill_payment_fee', round(v_amount * 0.01, 2));
  perform public.log_audit('pay_bill', 'transactions', v_transaction_id, jsonb_build_object('biller', p_biller, 'amount', v_amount));
  return jsonb_build_object('ok', true, 'transaction_id', v_transaction_id);
end;
$$;

create or replace function public.buy_airtime(
  p_account_id uuid,
  p_network text,
  p_phone text,
  p_amount numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.accounts;
  v_amount numeric(14,2) := round(p_amount::numeric, 2);
  v_transaction_id uuid;
begin
  select * into v_account from public.accounts where id = p_account_id for update;
  if not found then raise exception 'Account not found'; end if;
  if not public.can_access_row(v_account.user_id) then raise exception 'Unauthorized'; end if;
  if v_account.balance < v_amount then raise exception 'Insufficient funds'; end if;

  update public.accounts set balance = balance - v_amount where id = v_account.id;
  insert into public.transactions(user_id, account_id, type, category, counterparty, amount, status, note)
  values (v_account.user_id, v_account.id, 'airtime', 'Mobile', p_network || ' ' || p_phone, -v_amount, 'completed', null)
  returning id into v_transaction_id;

  perform public.log_audit('buy_airtime', 'transactions', v_transaction_id, jsonb_build_object('network', p_network, 'phone', p_phone));
  return jsonb_build_object('ok', true, 'transaction_id', v_transaction_id);
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, full_name, email, phone, avatar_url, role, account_type, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::text, 'user'),
    coalesce(new.raw_user_meta_data->>'account_type', 'Retail'),
    'pending'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.cards enable row level security;
alter table public.loans enable row level security;
alter table public.investments enable row level security;
alter table public.kyc_verifications enable row level security;
alter table public.notifications enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.support_tickets enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.savings_goals enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_revenue enable row level security;

create policy "profiles self or admin" on public.profiles
for all using (public.can_access_row(id)) with check (public.can_access_row(id));
create policy "accounts self or admin" on public.accounts
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "transactions self or admin" on public.transactions
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "cards self or admin" on public.cards
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "loans self or admin" on public.loans
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "investments self or admin" on public.investments
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "kyc self or admin" on public.kyc_verifications
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "notifications self or admin" on public.notifications
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "support self or admin" on public.support_tickets
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "beneficiaries self or admin" on public.beneficiaries
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "savings self or admin" on public.savings_goals
for all using (public.can_access_row(user_id)) with check (public.can_access_row(user_id));
create policy "audit admin only" on public.audit_logs
for all using (public.is_admin()) with check (public.is_admin());
create policy "revenue admin only" on public.platform_revenue
for all using (public.is_admin()) with check (public.is_admin());
create policy "exchange rates public read" on public.exchange_rates
for select using (true);

create or replace function public.seed_exchange_rates()
returns void language plpgsql as $$
begin
  insert into public.exchange_rates(pair, rate, change_pct, updated_at)
  values
    ('USD/NGN', 1520.22, 0.62, now()),
    ('EUR/NGN', 1654.13, -0.31, now()),
    ('GBP/NGN', 1942.55, 0.15, now()),
    ('BTC/USD', 62340.11, 1.24, now())
  on conflict (pair) do update set rate = excluded.rate, change_pct = excluded.change_pct, updated_at = now();
end;
$$;

