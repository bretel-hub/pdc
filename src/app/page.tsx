"use client";

import { useMemo, useState } from "react";
import { getMerchantCustomers, getMerchantTotals, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

export default function MerchantDashboard() {
  const customers = useMemo(() => getMerchantCustomers(), []);
  const totals = useMemo(() => getMerchantTotals(), []);
  const currentYear = new Date().getFullYear();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedId ? customers.find((c) => c.id === selectedId) : null;

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

      {/* Customer List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-72"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3 text-right">YTD Revenue</th>
                <th className="px-6 py-3 text-right">YTD Cash Rewards</th>
                <th className="px-6 py-3 text-right">Last Month</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedId === c.id
                      ? "bg-purple-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{c.company}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">{formatCurrency(c.ytdSpend)}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-purple-600">{formatCurrency(c.ytdCashback)}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-700">{formatCurrency(c.lastMonthSpend)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {c.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Customer Detail */}
      {selected && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
              <p className="text-gray-500">{selected.company} — {selected.email}</p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="YTD Revenue" value={formatCurrency(selected.ytdSpend)} />
            <StatCard label="YTD Cash Rewards Paid" value={formatCurrency(selected.ytdCashback)} />
            <StatCard label="Last Month Revenue" value={formatCurrency(selected.lastMonthSpend)} />
          </div>

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

          <TransactionTable records={[...selected.previousYearRecords, ...selected.currentYearRecords]} />
        </div>
      )}
    </div>
  );
}
