// Fake data generator for MVP demo

export interface MonthlyRecord {
  month: string; // "Jan 2025"
  monthKey: string; // "2025-01"
  spend: number;
  cashback: number;
  cumulativeCashback: number;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  records: MonthlyRecord[];
  totalSpend: number;
  totalCashback: number;
}

const CASHBACK_RATE = 0.03;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function generateMonthlySpend(): number {
  // Random between $50,000 and $100,000
  return Math.round((50000 + Math.random() * 50000) * 100) / 100;
}

function generateRecords(): MonthlyRecord[] {
  const records: MonthlyRecord[] = [];
  let cumulativeCashback = 0;

  // Generate 12 months of data ending at current month
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const spend = generateMonthlySpend();
    const cashback = Math.round(spend * CASHBACK_RATE * 100) / 100;
    cumulativeCashback += cashback;

    records.push({
      month: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      spend,
      cashback,
      cumulativeCashback: Math.round(cumulativeCashback * 100) / 100,
    });
  }

  return records;
}

// Seeded so it's consistent across renders (regenerate on refresh)
let _customer: Customer | null = null;

export function getCustomer(): Customer {
  if (_customer) return _customer;
  const records = generateRecords();
  _customer = {
    id: "cust-001",
    name: "Sarah Mitchell",
    company: "Apex Distribution Co.",
    email: "sarah@apexdist.com",
    records,
    totalSpend: records.reduce((sum, r) => sum + r.spend, 0),
    totalCashback: records.reduce((sum, r) => sum + r.cashback, 0),
  };
  return _customer;
}

export function filterRecords(records: MonthlyRecord[], months: number): MonthlyRecord[] {
  return records.slice(-months);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
