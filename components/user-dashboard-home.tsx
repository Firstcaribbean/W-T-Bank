"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Banknote,
  BellRing,
  CreditCard,
  Headphones,
  MessageSquareMore,
  RefreshCw,
  Send,
  Smartphone,
  Wallet
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge, Button, Card, CardContent, CardHeader, Input, Label, Separator, Textarea } from "@/components/ui";
import { SpendingDonut } from "@/components/charts";
import { buyAirtime, createSupportTicket, payBill, transferFunds } from "@/app/actions";
import { formatCurrency, greetingForHour, maskAccountNumber } from "@/lib/utils";
import { demoCards, demoExchangeRates } from "@/lib/mock-bank";
import { toast } from "sonner";

type Account = { id: string; type: string; account_number: string; balance: number; currency: string };
type Transaction = { id: string; type: string; category: string; counterparty: string; amount: number; status: string; created_at: string };
type Profile = { full_name: string };

function StatCard({
  label,
  value,
  accountNumber,
  delta,
  accent = false,
  balanceHidden = false
}: {
  label: string;
  value: number;
  accountNumber: string;
  delta: number;
  accent?: boolean;
  balanceHidden?: boolean;
}) {
  return (
    <Card className={accent ? "border-blue-500 bg-[#0b1f3f] text-white" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={accent ? "text-sm text-blue-100" : "text-sm text-muted-fg"}>{label}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              {balanceHidden ? "••••••" : formatCurrency(value)}
            </h3>
            <p className={accent ? "mt-2 text-xs text-blue-100" : "mt-2 text-xs text-muted-fg"}>{maskAccountNumber(accountNumber)}</p>
          </div>
          <div className={accent ? "rounded-2xl bg-white/10 p-3" : "rounded-2xl bg-blue-500/10 p-3 text-blue-600"}>
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 text-sm font-medium text-emerald-500">+{delta.toFixed(1)}% from last month</div>
      </CardContent>
    </Card>
  );
}

function MoneyRow({ tx, hidden }: { tx: Transaction; hidden: boolean }) {
  const isCredit = tx.amount > 0;
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {tx.category.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{tx.counterparty}</div>
          <div className="text-xs text-muted-fg">{format(parseISO(tx.created_at), "MMM d, p")}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={isCredit ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
          {hidden ? "••••••" : formatCurrency(Math.abs(tx.amount))}
        </div>
        <Badge tone="neutral" className="mt-1">{tx.category}</Badge>
      </div>
    </div>
  );
}

export function UserDashboardHome({
  profile,
  accounts,
  transactions,
  spending
}: {
  profile: Profile;
  accounts: Account[];
  transactions: Transaction[];
  spending: { category: string; amount: number; color: string }[];
}) {
  const [hideBalance, setHideBalance] = useState(false);
  const [panel, setPanel] = useState<"transfer" | "bill" | "airtime" | "support" | "receive" | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const totalBalance = accounts.reduce((sum, item) => sum + item.balance, 0);
  const totalSpent = spending.reduce((sum, item) => sum + item.amount, 0);
  const currentCard = demoCards[cardIndex % demoCards.length];
  const greeting = useMemo(() => greetingForHour(), []);

  const spendingQuery = useQuery({
    queryKey: ["spending", spending],
    queryFn: async () => spending,
    initialData: spending
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm text-muted-fg">{greeting}, {profile.full_name.split(" ")[0]} ??</div>
          <p className="mt-2 max-w-2xl text-sm text-muted-fg">Track balances, move money, review spending, and manage your cards from a single secure view.</p>
        </div>
        <Button variant="outline" onClick={() => setHideBalance((value) => !value)}>
          <RefreshCw className="mr-2 h-4 w-4" /> {hideBalance ? "Show Balance" : "Hide Balance"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Total Balance" value={totalBalance} accountNumber={accounts[0]?.account_number ?? "0000"} delta={12.5} accent balanceHidden={hideBalance} />
        <StatCard label="Checking Account" value={accounts[0]?.balance ?? 0} accountNumber={accounts[0]?.account_number ?? ""} delta={7.8} balanceHidden={hideBalance} />
        <StatCard label="Savings Account" value={accounts[1]?.balance ?? 0} accountNumber={accounts[1]?.account_number ?? ""} delta={9.1} balanceHidden={hideBalance} />
        <StatCard label="Investment Account" value={accounts[2]?.balance ?? 0} accountNumber={accounts[2]?.account_number ?? ""} delta={15.4} balanceHidden={hideBalance} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Recent Transactions</div>
              <div className="text-sm text-muted-fg">Your latest activity updates in real time.</div>
            </div>
            <Link href="/dashboard/transfers" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
              View All Transactions <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <MoneyRow key={tx.id} tx={tx} hidden={hideBalance} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Spending Overview</div>
              <div className="text-sm text-muted-fg">This month across your spending categories.</div>
            </div>
            <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </CardHeader>
          <CardContent>
            <SpendingDonut data={spendingQuery.data ?? spending} total={totalSpent} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              {(spendingQuery.data ?? spending).map((item) => (
                <div key={item.category} className="rounded-2xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span>{item.category}</span>
                    <span className="font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Quick Actions</div>
              <div className="text-sm text-muted-fg">Start a transfer, pay a bill, top up airtime, or request help.</div>
            </div>
            <Button variant="outline" onClick={() => setPanel("transfer")}>Send Money</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <ActionButton icon={Send} label="Send Money" onClick={() => setPanel("transfer")} />
              <ActionButton icon={Banknote} label="Receive Money" onClick={() => setPanel("receive")} />
              <ActionButton icon={MessageSquareMore} label="Pay Bills" onClick={() => setPanel("bill")} />
              <ActionButton icon={Smartphone} label="Buy Airtime" onClick={() => setPanel("airtime")} />
              <ActionButton icon={CreditCard} label="Cards" href="/dashboard/cards" />
              <ActionButton icon={Headphones} label="More" onClick={() => setPanel("support")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">My Cards</div>
              <div className="text-sm text-muted-fg">A realistic card carousel with live metadata.</div>
            </div>
            <Link href="/dashboard/cards" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-[2rem] bg-bank-gradient p-6 text-white shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-white/70">{currentCard.card_network.toUpperCase()}</div>
                  <div className="mt-10 text-2xl tracking-[0.2em]">{currentCard.card_number_masked}</div>
                  <div className="mt-6 text-sm text-white/70">Expires {currentCard.expiry}</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                {demoCards.map((_, index) => (
                  <button key={index} className={index === cardIndex ? "h-2 w-8 rounded-full bg-white" : "h-2 w-2 rounded-full bg-white/40"} onClick={() => setCardIndex(index)} />
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCardIndex((value) => (value - 1 + demoCards.length) % demoCards.length)}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setCardIndex((value) => (value + 1) % demoCards.length)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Exchange Rates</div>
            <div className="text-sm text-muted-fg">Pulled from the exchange_rates table or demo cache.</div>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoExchangeRates.map((rate) => (
              <div key={rate.pair} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <div className="font-medium">{rate.pair}</div>
                  <div className="text-xs text-muted-fg">Daily change</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{rate.rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={rate.change_pct >= 0 ? "text-xs text-emerald-600" : "text-xs text-red-600"}>
                    {rate.change_pct >= 0 ? "+" : ""}{rate.change_pct}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Send money instantly</div>
            <div className="text-sm text-muted-fg">Transfer to bank accounts, wallets, and beneficiaries in seconds.</div>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-blue-500/10 text-blue-600">
              <Send className="h-10 w-10" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-fg">Use the transfer flow to move money securely and atomically.</p>
              <Button onClick={() => setPanel("transfer")}>Transfer Now ?</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Need Help?</div>
            <div className="text-sm text-muted-fg">Open a support ticket and our team will respond inside the app.</div>
          </div>
          <Button variant="outline" onClick={() => setPanel("support")}>Contact Support</Button>
        </CardHeader>
      </Card>

      {panel ? (
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold">
              {panel === "transfer" ? "Transfer Money" : panel === "bill" ? "Pay Bills" : panel === "airtime" ? "Buy Airtime" : panel === "receive" ? "Receive Money" : "Support Ticket"}
            </div>
            <Button variant="ghost" onClick={() => setPanel(null)}>Close</Button>
          </div>

          {panel === "transfer" ? (
            <form action={transferFunds} className="grid gap-4 md:grid-cols-2">
              <Field label="From account">
                <select name="fromAccountId" className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.type} {maskAccountNumber(account.account_number)}</option>)}
                </select>
              </Field>
              <Field label="Recipient account number"><Input name="toAccountNumber" placeholder="1234567890" /></Field>
              <Field label="Amount"><Input name="amount" type="number" step="0.01" placeholder="250.00" /></Field>
              <Field label="Note"><Input name="note" placeholder="Rent payment" /></Field>
              <div className="md:col-span-2"><Button type="submit">Send Money</Button></div>
            </form>
          ) : null}

          {panel === "bill" ? (
            <form action={payBill} className="grid gap-4 md:grid-cols-2">
              <Field label="Account">
                <select name="accountId" className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.type} {maskAccountNumber(account.account_number)}</option>)}
                </select>
              </Field>
              <Field label="Biller"><Input name="biller" placeholder="Electricity / Cable / Water" /></Field>
              <Field label="Amount"><Input name="amount" type="number" step="0.01" /></Field>
              <Field label="Reference"><Input name="reference" placeholder="Invoice #" /></Field>
              <div className="md:col-span-2"><Button type="submit">Pay Bill</Button></div>
            </form>
          ) : null}

          {panel === "airtime" ? (
            <form action={buyAirtime} className="grid gap-4 md:grid-cols-2">
              <Field label="Account">
                <select name="accountId" className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.type} {maskAccountNumber(account.account_number)}</option>)}
                </select>
              </Field>
              <Field label="Network"><Input name="network" placeholder="MTN / Airtel / Glo / Vodafone" /></Field>
              <Field label="Phone"><Input name="phone" placeholder="+1 555 123 4567" /></Field>
              <Field label="Amount"><Input name="amount" type="number" step="0.01" /></Field>
              <div className="md:col-span-2"><Button type="submit">Buy Airtime</Button></div>
            </form>
          ) : null}

          {panel === "receive" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-fg">Account details</div>
                  <div className="mt-2 font-semibold">{profile.full_name}</div>
                  <div className="text-sm text-muted-fg">{accounts[0]?.account_number}</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-fg">Shareable QR</div>
                  <div className="mt-4 grid h-36 place-items-center rounded-2xl border border-dashed border-border text-xs text-muted-fg">QR PLACEHOLDER</div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {panel === "support" ? (
            <form action={createSupportTicket} className="grid gap-4 md:grid-cols-2">
              <Field label="Subject"><Input name="subject" placeholder="Card not working" /></Field>
              <Field label="Priority">
                <select name="priority" className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </Field>
              <Field label="Message" className="md:col-span-2"><Textarea name="message" placeholder="Tell us what happened..." /></Field>
              <div className="md:col-span-2"><Button type="submit">Submit Ticket</Button></div>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={className}>
      <div className="mb-2 text-sm font-medium">{label}</div>
      {children}
    </label>
  );
}

function ActionButton({ icon: Icon, label, href, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; href?: string; onClick?: () => void }) {
  const content = (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:border-blue-500 hover:shadow-sm">
      <Icon className="h-5 w-5 text-blue-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return <button type="button" onClick={onClick} className="text-left">{content}</button>;
}

