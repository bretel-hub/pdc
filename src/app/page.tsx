"use client";

import { useMemo } from "react";
import { getMerchantData, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

export default function MerchantDashboard() {
  const customer = useMemo(() => getMerchantData(), []);
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Header with customer info */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your customers and track rewards</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
          <p className="text-sm text-gray-400">{customer.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value="1" sub="MVP demo" />
        <StatCard label="YTD Revenue" value={formatCurrency(customer.ytdSpend)} />
        <StatCard label="Total Cash Rewards" value={formatCurrency(customer.ytdCashback)} />
        <StatCard label="Cashback Rate" value="3%" sub="Flat rate on all spend" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendChart
          data={customer.yearOverYear}
          currentYear={currentYear}
          title="Total Revenue"
          hoverLabel="Revenue"
        />
        <CashbackChart
          data={customer.yearOverYear}
          currentYear={currentYear}
          title="Total Cash Rewards Distributed"
          hoverLabel="Cash Rewards"
        />
      </div>

      {/* Table */}
      <TransactionTable records={[...customer.previousYearRecords, ...customer.currentYearRecords]} />
    </div>
  );
}
