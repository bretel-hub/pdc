"use client";

import { MonthlyRecord, formatCurrency } from "@/lib/data";

interface TransactionTableProps {
  records: MonthlyRecord[];
}

export default function TransactionTable({ records }: TransactionTableProps) {
  const reversed = [...records].reverse();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Monthly History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3 text-right">Spend</th>
              <th className="px-6 py-3 text-right">Cash Distributed (3%)</th>
              <th className="px-6 py-3 text-right">Cumulative Cash Distributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reversed.map((r) => (
              <tr key={r.monthKey} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.month} {r.year}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-700">{formatCurrency(r.spend)}</td>
                <td className="px-6 py-4 text-sm text-right text-purple-600 font-medium">{formatCurrency(r.cashback)}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-700">{formatCurrency(r.cumulativeCashback)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
