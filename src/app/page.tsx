"use client";

import { useMemo } from "react";
import { getMerchantData, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

export default function MerchantDashboard() {
  const data = useMemo(() => getMerchantData(), []);
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.company}</h1>
          <p className="text-gray-500 mt-1">Loyalty Program Dashboard</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-400">{data.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value="1" sub="MVP demo" />
        <StatCard label="YTD Revenue" value={formatCurrency(data.ytdSpend)} />
        <StatCard label="YTD Cash Rewards Paid" value={formatCurrency(data.ytdCashback)} />
        <StatCard label="Cashback Rate" value="3%" sub="Flat rate on all spend" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendChart
          data={data.yearOverYear}
          currentYear={currentYear}
          title="Total Revenue"
          hoverLabel="Revenue"
        />
        <CashbackChart
          data={data.yearOverYear}
          currentYear={currentYear}
          title="Total Cash Rewards Paid"
          hoverLabel="Cash Rewards"
        />
      </div>

      {/* Table */}
      <TransactionTable records={[...data.previousYearRecords, ...data.currentYearRecords]} />
    </div>
  );
}
