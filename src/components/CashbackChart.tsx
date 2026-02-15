"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { MonthlyRecord, filterRecords, formatCurrency } from "@/lib/data";

interface CashbackChartProps {
  records: MonthlyRecord[];
}

const RANGE_OPTIONS = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
];

export default function CashbackChart({ records }: CashbackChartProps) {
  const [range, setRange] = useState(12);
  const filtered = filterRecords(records, range);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cumulative Cashback</h3>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.months}
              onClick={() => setRange(opt.months)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                range === opt.months
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filtered}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), "Cumulative Cashback"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
          />
          <Area
            type="monotone"
            dataKey="cumulativeCashback"
            stroke="#10b981"
            fill="#d1fae5"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
