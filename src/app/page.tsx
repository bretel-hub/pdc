"use client";

import { useMemo } from "react";
import { getCustomer, formatCurrency } from "@/lib/data";
import StatCard from "@/components/StatCard";
import SpendChart from "@/components/SpendChart";
import CashbackChart from "@/components/CashbackChart";
import TransactionTable from "@/components/TransactionTable";

export default function MerchantDashboard() {
  const customer = useMemo(() => getCustomer(), []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your customers and track rewards</p>
      </div>

      {/* Customer card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
            <p className="text-gray-500">{customer.company}</p>
            <p className="text-sm text-gray-400">{customer.email}</p>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Spend</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(customer.totalSpend)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Cash Rewards Distributed</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(customer.totalCashback)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value="1" sub="MVP demo" />
        <StatCard label="Total Spend (12M)" value={formatCurrency(customer.totalSpend)} />
        <StatCard label="Cash Rewards Distributed" value={formatCurrency(customer.totalCashback)} />
        <StatCard label="Cashback Rate" value="3%" sub="Flat rate on all spend" />
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
