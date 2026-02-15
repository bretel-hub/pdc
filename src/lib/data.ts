// Fake data generator for MVP demo

export interface MonthlyRecord {
  month: string; // "Jan"
  monthKey: string; // "2025-01"
  spend: number;
  cashback: number;
  cumulativeCashback: number;
  year: number;
}

export interface YearOverYearRecord {
  month: string; // "Jan", "Feb", etc.
  currentSpend: number;
  previousSpend: number;
  currentCashback: number;
  previousCashback: number;
  currentCumulativeCashback: number;
  previousCumulativeCashback: number;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  currentYearRecords: MonthlyRecord[];
  previousYearRecords: MonthlyRecord[];
  yearOverYear: YearOverYearRecord[];
  totalSpend: number;
  totalCashback: number;
}

const CASHBACK_RATE = 0.03;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function generateMonthlySpend(): number {
  // Random between $250,000 and $500,000 (5x previous range)
  return Math.round((250000 + Math.random() * 250000) * 100) / 100;
}

function generateYearRecords(year: number, monthCount: number): MonthlyRecord[] {
  const records: MonthlyRecord[] = [];
  let cumulativeCashback = 0;

  for (let m = 0; m < monthCount; m++) {
    const spend = generateMonthlySpend();
    const cashback = Math.round(spend * CASHBACK_RATE * 100) / 100;
    cumulativeCashback += cashback;

    records.push({
      month: MONTH_NAMES[m],
      monthKey: `${year}-${String(m + 1).padStart(2, "0")}`,
      spend,
      cashback,
      cumulativeCashback: Math.round(cumulativeCashback * 100) / 100,
      year,
    });
  }

  return records;
}

let _customer: Customer | null = null;

export function getCustomer(): Customer {
  if (_customer) return _customer;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // Full 12 months for previous year, up to current month for current year
  const previousYearRecords = generateYearRecords(currentYear - 1, 12);
  const currentYearRecords = generateYearRecords(currentYear, currentMonth);

  // Build year-over-year comparison (only months that exist in current year)
  const yearOverYear: YearOverYearRecord[] = [];
  let cumCurrent = 0;
  let cumPrevious = 0;

  for (let m = 0; m < 12; m++) {
    const prev = previousYearRecords[m];
    const curr = m < currentMonth ? currentYearRecords[m] : null;

    cumPrevious += prev.cashback;
    if (curr) cumCurrent += curr.cashback;

    yearOverYear.push({
      month: MONTH_NAMES[m],
      currentSpend: curr ? curr.spend : 0,
      previousSpend: prev.spend,
      currentCashback: curr ? curr.cashback : 0,
      previousCashback: prev.cashback,
      currentCumulativeCashback: curr ? Math.round(cumCurrent * 100) / 100 : 0,
      previousCumulativeCashback: Math.round(cumPrevious * 100) / 100,
    });
  }

  const allRecords = [...previousYearRecords, ...currentYearRecords];

  _customer = {
    id: "cust-001",
    name: "Sarah Mitchell",
    company: "Premier Partners",
    email: "sarah@apexdist.com",
    currentYearRecords,
    previousYearRecords,
    yearOverYear,
    totalSpend: allRecords.reduce((sum, r) => sum + r.spend, 0),
    totalCashback: allRecords.reduce((sum, r) => sum + r.cashback, 0),
  };
  return _customer;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
