set timezone = 'UTC';

truncate table
  public.audit_logs,
  public.platform_revenue,
  public.support_tickets,
  public.beneficiaries,
  public.savings_goals,
  public.notifications,
  public.kyc_verifications,
  public.cards,
  public.transactions,
  public.investments,
  public.loans,
  public.accounts,
  public.profiles,
  public.exchange_rates
restart identity cascade;

select public.seed_exchange_rates();

create temporary table seed_users as
select
  gen_random_uuid() as id,
  'User ' || gs as full_name,
  'user' || gs || '@wtbetbank.com' as email,
  '+1-555-' || lpad(gs::text, 4, '0') as phone,
  case when gs = 1 then 'admin' else 'user' end as role,
  case when gs % 4 = 0 then 'Corporate' when gs % 5 = 0 then 'Investment Banking' else 'Retail' end as account_type,
  case when gs % 7 = 0 then 'pending' when gs % 11 = 0 then 'rejected' else 'verified' end as status
from generate_series(1, 36) gs;

insert into public.profiles (id, full_name, email, phone, avatar_url, role, account_type, status, created_at)
select id, full_name, email, phone, null, role, account_type, status, now() - make_interval(days => (random() * 120)::int)
from seed_users;

insert into public.accounts (id, user_id, type, account_number, balance, currency, created_at)
select
  gen_random_uuid(),
  u.id,
  acct.type,
  'ACC' || lpad((row_number() over (order by u.id) * 1017)::text, 10, '0'),
  round((500 + random() * 95000)::numeric, 2),
  'USD',
  now() - make_interval(days => (random() * 180)::int)
from seed_users u
cross join lateral (values ('checking'), ('savings'), ('investment')) as acct(type);

insert into public.cards (user_id, account_id, card_number_masked, card_network, type, expiry, status, created_at)
select
  a.user_id,
  a.id,
  '**** **** **** ' || lpad((floor(random() * 9000) + 1000)::int::text, 4, '0'),
  case when random() > 0.5 then 'visa' else 'mastercard' end,
  case when random() > 0.7 then 'credit' else 'debit' end,
  to_char((date '2029-01-01' + make_interval(months => (random() * 36)::int)), 'MM/YY'),
  case when random() > 0.92 then 'frozen' else 'active' end,
  now() - make_interval(days => (random() * 120)::int)
from public.accounts a
where a.type = 'checking';

insert into public.kyc_verifications (user_id, status, submitted_at, reviewed_at)
select
  id,
  status,
  now() - make_interval(days => (random() * 90)::int),
  case when status = 'pending' then null else now() - make_interval(days => (random() * 80)::int) end
from seed_users;

insert into public.notifications (user_id, title, body, read, created_at)
select
  u.id,
  case when gs % 2 = 0 then 'Transfer completed' else 'Security alert' end,
  'Demo notification for ' || u.full_name,
  gs % 3 = 0,
  now() - make_interval(days => (random() * 30)::int)
from seed_users u
cross join generate_series(1, 4) gs;

insert into public.savings_goals (user_id, name, target_amount, saved_amount, created_at)
select
  id,
  case when gs = 1 then 'Emergency Fund' when gs = 2 then 'Vacation' else 'Home Upgrade' end,
  case when gs = 1 then 10000 else case when gs = 2 then 4000 else 15000 end end,
  round((random() * 7500)::numeric, 2),
  now() - make_interval(days => (random() * 60)::int)
from seed_users
cross join generate_series(1, 2) gs;

insert into public.investments (user_id, type, amount, current_value, created_at)
select
  id,
  case when gs = 1 then 'Index Fund' when gs = 2 then 'Bond ETF' else 'Money Market' end,
  round((1000 + random() * 15000)::numeric, 2),
  round((1200 + random() * 18000)::numeric, 2),
  now() - make_interval(days => (random() * 180)::int)
from seed_users
cross join generate_series(1, 2) gs;

insert into public.loans (user_id, amount, status, interest_rate, term_months, created_at)
select
  id,
  round((2500 + random() * 40000)::numeric, 2),
  case when random() > 0.6 then 'approved' when random() > 0.3 then 'pending' else 'active' end,
  round((4 + random() * 12)::numeric, 2),
  case when random() > 0.5 then 12 else 24 end,
  now() - make_interval(days => (random() * 140)::int)
from seed_users
where role <> 'admin'
limit 24;

insert into public.beneficiaries (user_id, name, account_number, bank_name, created_at)
select
  id,
  'Beneficiary ' || gs,
  'BNK' || lpad((random() * 1000000)::int::text, 10, '0'),
  'W&T Pay',
  now() - make_interval(days => (random() * 80)::int)
from seed_users
cross join generate_series(1, 3) gs;

insert into public.platform_revenue (source, amount, created_at)
select
  case when gs % 2 = 0 then 'transfer_fee' else 'bill_payment_fee' end,
  round((random() * 500)::numeric, 2),
  now() - make_interval(days => (random() * 60)::int)
from generate_series(1, 120) gs;

insert into public.transactions (user_id, account_id, type, category, counterparty, amount, status, note, created_at)
select
  a.user_id,
  a.id,
  case when gs % 6 = 0 then 'deposit' when gs % 5 = 0 then 'bill_payment' when gs % 4 = 0 then 'card_payment' else 'transfer' end,
  case when gs % 6 = 0 then 'Income' when gs % 5 = 0 then 'Bills' when gs % 4 = 0 then 'Shopping' when gs % 3 = 0 then 'Food & Dining' else 'Transport' end,
  case when gs % 6 = 0 then 'Payroll' when gs % 5 = 0 then 'Utility Co.' when gs % 4 = 0 then 'Amazon' else 'Merchant ' || gs end,
  case when gs % 6 = 0 then round((500 + random() * 5000)::numeric, 2) else -round((20 + random() * 900)::numeric, 2) end,
  case when random() > 0.94 then 'failed' when random() > 0.84 then 'pending' else 'completed' end,
  null,
  now() - make_interval(days => (random() * 180)::int)
from public.accounts a
cross join generate_series(1, 6) gs;

insert into public.audit_logs(actor_id, action, entity, entity_id, metadata, created_at)
select
  (select id from seed_users where role = 'admin' limit 1),
  'seed',
  'system',
  gen_random_uuid(),
  jsonb_build_object('row', gs),
  now() - make_interval(days => (random() * 10)::int)
from generate_series(1, 18) gs;
