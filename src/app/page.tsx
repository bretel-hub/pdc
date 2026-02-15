"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { getMerchantCustomers, getMerchantTotals, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

// Build aggregate YoY data from all customers
function buildAggregateYoY(customers: ReturnType<typeof getMerchantCustomers>) {
  const agg = customers[0].yearOverYear.map((_, i) => ({
    month: customers[0].yearOverYear[i].month,
    currentSpend: 0,
    previousSpend: 0,
    currentCashback: 0,
    previousCashback: 0,
    currentCumulativeCashback: 0,
    previousCumulativeCashback: 0,
  }));

  for (const c of customers) {
    for (let i = 0; i < c.yearOverYear.length; i++) {
      agg[i].currentSpend += c.yearOverYear[i].currentSpend;
      agg[i].previousSpend += c.yearOverYear[i].previousSpend;
      agg[i].currentCashback += c.yearOverYear[i].currentCashback;
      agg[i].previousCashback += c.yearOverYear[i].previousCashback;
    }
  }

  return agg;
}

export default function MerchantDashboard() {
  const customers = useMemo(() => getMerchantCustomers(), []);
  const totals = useMemo(() => getMerchantTotals(), []);
  const aggregateYoY = useMemo(() => buildAggregateYoY(customers), [customers]);
  const currentYear = new Date().getFullYear();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;
  const detailRef = useRef<HTMLTableRowElement>(null);

  const filtered = customers
    .filter(
      (c) =>
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortAsc ? a.ytdSpend - b.ytdSpend : b.ytdSpend - a.ytdSpend);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };

  const selected = selectedId ? customers.find((c) => c.id === selectedId) : null;

  // Scroll the inline detail into view when a customer is selected
  useEffect(() => {
    if (selectedId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apex Distributors</h1>
          <p className="text-gray-500 mt-1">Loyalty Program Dashboard</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-gray-900">Sarah Mitchell</p>
          <p className="text-sm text-gray-400">sarah@apexdistributors.com</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value={String(totals.totalCustomers)} />
        <StatCard label="YTD Revenue" value={formatCurrency(totals.ytdRevenue)} />
        <StatCard label="YTD Cash Rewards Paid" value={formatCurrency(totals.ytdCashbackPaid)} />
        <StatCard label="Cashback Rate" value="3%" sub="Flat rate on all spend" />
      </div>

      {/* Aggregate Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendChart
          data={aggregateYoY}
          currentYear={currentYear}
          title="Total Revenue"
          hoverLabel="Revenue"
        />
        <CashbackChart
          data={aggregateYoY}
          currentYear={currentYear}
          title="Total Cash Rewards Paid"
          hoverLabel="Cash Rewards"
        />
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-72"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSortAsc(!sortAsc); }}
                    className="inline-flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    YTD Revenue {sortAsc ? "↑" : "↓"}
                  </button>
                </th>
                <th className="px-6 py-3 text-right">YTD Cash Rewards</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((c) => {
                const isSelected = selectedId === c.id;
                return (
                  <>
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(isSelected ? null : c.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-purple-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-gray-400 text-xs inline-block transition-transform duration-200"
                            style={{ transform: isSelected ? "rotate(90deg)" : "rotate(0deg)" }}
                          >
                            ▶
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{c.company}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">{formatCurrency(c.ytdSpend)}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-purple-600">{formatCurrency(c.ytdCashback)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {c.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>

                    {/* Inline Customer Detail */}
                    {isSelected && selected && (
                      <tr key={`${c.id}-detail`} ref={detailRef}>
                        <td colSpan={4} className="p-0">
                          <div className="bg-gray-50 border-t border-b border-purple-200">
                            {/* Collapse bar */}
                            <div className="sticky top-0 z-10 bg-purple-600 px-6 py-3 flex items-center justify-between">
                              <div>
                                <span className="text-white font-semibold text-sm">{selected.company}</span>
                                <span className="text-purple-200 text-sm ml-3">{selected.name} — {selected.email}</span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                className="text-white hover:text-purple-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                ✕ Collapse
                              </button>
                            </div>

                            <div className="p-6 space-y-6">
                              {/* Stats */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard label="YTD Revenue" value={formatCurrency(selected.ytdSpend)} />
                                <StatCard label="YTD Cash Rewards Paid" value={formatCurrency(selected.ytdCashback)} />
                                <StatCard label="Last Month Revenue" value={formatCurrency(selected.lastMonthSpend)} />
                              </div>

                              {/* Charts */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SpendChart
                                  data={selected.yearOverYear}
                                  currentYear={currentYear}
                                  title="Revenue"
                                  hoverLabel="Revenue"
                                />
                                <CashbackChart
                                  data={selected.yearOverYear}
                                  currentYear={currentYear}
                                  title="Cash Rewards Paid"
                                  hoverLabel="Cash Rewards"
                                />
                              </div>

                              {/* Transaction History */}
                              <TransactionTable records={[...selected.previousYearRecords, ...selected.currentYearRecords]} />

                              {/* Bottom collapse button */}
                              <div className="flex justify-center pt-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                  className="px-6 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                                >
                                  ↑ Collapse Customer Detail
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} customers
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
