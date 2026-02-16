"use client";

import { useState } from "react";
import { MonthlyRecord, formatCurrency } from "@/lib/data";

interface TransactionTableProps {
  records: MonthlyRecord[];
}

export default function TransactionTable({ records }: TransactionTableProps) {
  const reversed = [...records].reverse();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Sales History</h3>
        <p className="text-sm text-gray-400 mt-1">Click a month to view purchase details</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-3 w-8"></th>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3 text-right">Spend</th>
              <th className="px-6 py-3 text-right">Cash Distributed (3%)</th>
              <th className="px-6 py-3 text-right">Cumulative Cash Distributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reversed.map((r) => {
              const isOpen = expanded.has(r.monthKey);
              return (
                <> 
                  <tr
                    key={r.monthKey}
                    onClick={() => toggle(r.monthKey)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer select-none"
                  >
                    <td className="pl-6 py-4 text-sm text-gray-400">
                      <span
                        className="inline-block transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                      >
                        ▶
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {r.month} {r.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      {formatCurrency(r.spend)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-purple-600 font-medium">
                      {formatCurrency(r.cashback)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      {formatCurrency(r.cumulativeCashback)}
                    </td>
                  </tr>

                  {isOpen && (
                    <tr key={`${r.monthKey}-detail`}>
                      <td colSpan={5} className="px-0 py-0">
                        <div className="bg-gray-50 border-t border-gray-100">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                <th className="pl-16 pr-4 py-2">Part #</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2 text-right">Unit Qty</th>
                                <th className="px-4 py-2 text-right">Unit Price</th>
                                <th className="px-6 py-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {r.lineItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-100/50 transition-colors">
                                  <td className="pl-16 pr-4 py-2.5 text-xs font-mono text-purple-600">
                                    {item.partNumber}
                                  </td>
                                  <td className="px-4 py-2.5 text-sm text-gray-700">
                                    {item.description}
                                  </td>
                                  <td className="px-4 py-2.5 text-sm text-right text-gray-600">
                                    {item.unitQty}
                                  </td>
                                  <td className="px-4 py-2.5 text-sm text-right text-gray-600">
                                    {formatCurrency(item.unitPrice)}
                                  </td>
                                  <td className="px-6 py-2.5 text-sm text-right font-medium text-gray-800">
                                    {formatCurrency(item.total)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
