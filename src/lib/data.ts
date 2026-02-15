// Data layer for PDC MVP

export interface MonthlyRecord {
  month: string;
  monthKey: string;
  spend: number;
  cashback: number;
  cumulativeCashback: number;
  year: number;
}

export interface YearOverYearRecord {
  month: string;
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
  ytdSpend: number;
  ytdCashback: number;
  lastMonthSpend: number;
  lastMonthCashback: number;
  status: "active" | "inactive";
}

const CASHBACK_RATE = 0.03;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Simple seeded random for consistent data per customer
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateMonthlySpend(rand: () => number, baseMin: number, baseMax: number): number {
  return Math.round((baseMin + rand() * (baseMax - baseMin)) * 100) / 100;
}

function generateYearRecords(year: number, monthCount: number, rand: () => number, baseMin: number, baseMax: number): MonthlyRecord[] {
  const records: MonthlyRecord[] = [];
  let cumulativeCashback = 0;

  for (let m = 0; m < monthCount; m++) {
    const spend = generateMonthlySpend(rand, baseMin, baseMax);
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

function buildCustomer(id: string, name: string, company: string, email: string, seed: number, baseMin: number, baseMax: number, status: "active" | "inactive" = "active"): Customer {
  const rand = seededRandom(seed);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const previousYearRecords = generateYearRecords(currentYear - 1, 12, rand, baseMin, baseMax);
  const currentYearRecords = generateYearRecords(currentYear, currentMonth, rand, baseMin, baseMax);

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
  const lastRecord = currentYearRecords[currentYearRecords.length - 1];

  return {
    id,
    name,
    company,
    email,
    currentYearRecords,
    previousYearRecords,
    yearOverYear,
    totalSpend: allRecords.reduce((sum, r) => sum + r.spend, 0),
    totalCashback: allRecords.reduce((sum, r) => sum + r.cashback, 0),
    ytdSpend: currentYearRecords.reduce((sum, r) => sum + r.spend, 0),
    ytdCashback: currentYearRecords.reduce((sum, r) => sum + r.cashback, 0),
    lastMonthSpend: lastRecord ? lastRecord.spend : 0,
    lastMonthCashback: lastRecord ? lastRecord.cashback : 0,
    status,
  };
}

// === MERCHANT DATA (Apex Distributors sees all customers) ===

const MERCHANT_CUSTOMERS: Customer[] = [
  buildCustomer("cust-001", "Tim Reynolds", "Premier Partners", "tim@premierpartners.com", 42, 250000, 500000),
  buildCustomer("cust-002", "Jessica Chen", "Northgate Supply Co.", "jessica@northgatesupply.com", 87, 180000, 350000),
  buildCustomer("cust-003", "Marcus Williams", "Redline Industrial", "marcus@redlineindustrial.com", 153, 120000, 280000),
  buildCustomer("cust-004", "Amanda Foster", "Summit Logistics", "amanda@summitlogistics.com", 219, 300000, 550000),
  buildCustomer("cust-005", "David Park", "Coastal Freight Inc.", "david@coastalfreight.com", 311, 80000, 200000),
];

let _merchantCustomers: Customer[] | null = null;

export function getMerchantCustomers(): Customer[] {
  if (_merchantCustomers) return _merchantCustomers;
  _merchantCustomers = MERCHANT_CUSTOMERS;
  return _merchantCustomers;
}

export function getMerchantCustomerById(id: string): Customer | undefined {
  return getMerchantCustomers().find(c => c.id === id);
}

export function getMerchantTotals() {
  const customers = getMerchantCustomers();
  return {
    totalCustomers: customers.length,
    ytdRevenue: customers.reduce((sum, c) => sum + c.ytdSpend, 0),
    ytdCashbackPaid: customers.reduce((sum, c) => sum + c.ytdCashback, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpend, 0),
    totalCashbackPaid: customers.reduce((sum, c) => sum + c.totalCashback, 0),
  };
}

// === CUSTOMER DATA (Tim's view — his spend with Apex at ~10% of merchant volume) ===

let _customerView: Customer | null = null;

export function getCustomerData(): Customer {
  if (_customerView) return _customerView;
  _customerView = buildCustomer("cust-001", "Tim Reynolds", "Premier Partners", "tim@premierpartners.com", 777, 25000, 50000);
  return _customerView;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
