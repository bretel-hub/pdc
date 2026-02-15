"use client";

import { useMemo } from "react";
import { getCustomer, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

export default function CustomerDashboard() {
  const customer = useMemo(() => getCustomer(), []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {customer.name.split(" ")[0]}</h1>
        <p className="text-gray-500 mt-1">{customer.company} — Your cashback rewards at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Spend (12M)" value={formatCurrency(customer.totalSpend)} />
        <StatCard label="Cash Rewards Earned" value={formatCurrency(customer.totalCashback)} accent />
        <StatCard label="Cashback Rate" value="3%" sub="On all purchases" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendChart records={customer.records} />
        <CashbackChart records={customer.records} />
      </div>

      {/* Table */}
      <TransactionTable records={customer.records} />
    </div>
  );
}
