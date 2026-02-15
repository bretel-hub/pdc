"use client";

import { useMemo } from "react";
import { getCustomerData, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

export default function CustomerDashboard() {
  const data = useMemo(() => getCustomerData(), []);
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data.name.split(" ")[0]}</h1>
          <p className="text-gray-500 mt-1">{data.company} — Your rewards with Apex Distributors</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-400">{data.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="YTD Spend with Apex" value={formatCurrency(data.ytdSpend)} />
        <StatCard label="YTD Cash Rewards Earned" value={formatCurrency(data.ytdCashback)} accent />
        <StatCard label="Cashback Rate" value="3%" sub="On all purchases" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendChart
          data={data.yearOverYear}
          currentYear={currentYear}
          title="Total Spend with Apex"
          hoverLabel="Spend"
        />
        <CashbackChart
          data={data.yearOverYear}
          currentYear={currentYear}
          title="Total Cash Rewards Earned"
          hoverLabel="Cash Rewards"
        />
      </div>

      {/* Table */}
      <TransactionTable records={[...data.previousYearRecords, ...data.currentYearRecords]} />
    </div>
  );
}
