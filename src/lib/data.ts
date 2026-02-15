// Data layer for PDC MVP

export interface LineItem {
  partNumber: string;
  description: string;
  unitQty: number;
  unitPrice: number;
  total: number;
}

export interface MonthlyRecord {
  month: string;
  monthKey: string;
  spend: number;
  cashback: number;
  cumulativeCashback: number;
  year: number;
  lineItems: LineItem[];
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

// Generic product catalog — works across industries
const PRODUCT_CATALOG = [
  { partNumber: "PRD-1001", description: "Standard Service Agreement", priceMin: 800, priceMax: 2000 },
  { partNumber: "PRD-1042", description: "Premium Maintenance Package", priceMin: 1200, priceMax: 2500 },
  { partNumber: "SUP-2205", description: "Bulk Supply Kit — Type A", priceMin: 150, priceMax: 400 },
  { partNumber: "SUP-2210", description: "Bulk Supply Kit — Type B", priceMin: 200, priceMax: 500 },
  { partNumber: "EQP-3010", description: "Replacement Module — Series 3", priceMin: 50, priceMax: 180 },
  { partNumber: "EQP-3044", description: "Upgrade Component — Pro", priceMin: 1500, priceMax: 3500 },
  { partNumber: "EQP-3078", description: "Calibration Assembly", priceMin: 75, priceMax: 250 },
  { partNumber: "SVC-4001", description: "On-Site Support — Half Day", priceMin: 600, priceMax: 1200 },
  { partNumber: "SVC-4015", description: "Remote Monitoring (Monthly)", priceMin: 300, priceMax: 900 },
  { partNumber: "MAT-5003", description: "Consumable Refill Pack", priceMin: 50, priceMax: 120 },
  { partNumber: "MAT-5021", description: "Safety Compliance Kit", priceMin: 80, priceMax: 200 },
  { partNumber: "MAT-5040", description: "Filter Cartridge — Heavy Duty", priceMin: 35, priceMax: 95 },
  { partNumber: "LOG-6002", description: "Express Shipping Surcharge", priceMin: 75, priceMax: 250 },
  { partNumber: "LOG-6010", description: "Warehousing Fee (Monthly)", priceMin: 400, priceMax: 1000 },
  { partNumber: "LIC-7001", description: "Software License — Annual", priceMin: 1800, priceMax: 4000 },
  { partNumber: "TRN-8005", description: "Training Session — Virtual", priceMin: 250, priceMax: 600 },
];

function generateLineItems(rand: () => number, targetSpend: number): LineItem[] {
  const items: LineItem[] = [];
  let remaining = targetSpend;
  
  // Pick 4-10 line items per month
  const itemCount = Math.floor(rand() * 7) + 4;
  
  for (let i = 0; i < itemCount - 1; i++) {
    if (remaining <= 0) break;
    
    const product = PRODUCT_CATALOG[Math.floor(rand() * PRODUCT_CATALOG.length)];
    const unitPrice = Math.round((product.priceMin + rand() * (product.priceMax - product.priceMin)) * 100) / 100;
    
    // Vary qty: cheap items get more units, expensive items get fewer
    let maxQty = unitPrice < 200 ? 25 : unitPrice < 800 ? 8 : 3;
    const unitQty = Math.max(1, Math.floor(rand() * maxQty) + 1);
    const total = Math.round(unitPrice * unitQty * 100) / 100;
    
    // Don't overshoot
    if (total > remaining * 0.8 && i < itemCount - 2) continue;
    
    items.push({ partNumber: product.partNumber, description: product.description, unitQty, unitPrice, total });
    remaining -= total;
  }
  
  // Last item absorbs the remainder so totals match exactly
  if (remaining > 0) {
    const product = PRODUCT_CATALOG[Math.floor(rand() * PRODUCT_CATALOG.length)];
    const unitQty = Math.max(1, Math.floor(rand() * 3) + 1);
    const unitPrice = Math.round((remaining / unitQty) * 100) / 100;
    const total = Math.round(unitPrice * unitQty * 100) / 100;
    // Adjust last item to hit exact target
    const diff = Math.round((remaining - total) * 100) / 100;
    items.push({ 
      partNumber: product.partNumber, 
      description: product.description, 
      unitQty, 
      unitPrice: Math.round((unitPrice + diff / unitQty) * 100) / 100, 
      total: Math.round(remaining * 100) / 100 
    });
  }
  
  return items;
}

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

    const lineItems = generateLineItems(rand, spend);
    
    records.push({
      month: MONTH_NAMES[m],
      monthKey: `${year}-${String(m + 1).padStart(2, "0")}`,
      spend,
      cashback,
      cumulativeCashback: Math.round(cumulativeCashback * 100) / 100,
      year,
      lineItems,
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
