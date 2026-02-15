"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MonthlyRecord, filterRecords, formatCurrency } from "@/lib/data";

interface SpendChartProps {
  records: MonthlyRecord[];
}

const RANGE_OPTIONS = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
];

export default function SpendChart({ records }: SpendChartProps) {
  const [range, setRange] = useState(12);
  const filtered = filterRecords(records, range);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spend & Cashback</h3>
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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={filtered} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="spend"
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="cashback"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [formatCurrency(value as number), name === "spend" ? "Spend" : "Cashback"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
          />
          <Legend />
          <Bar yAxisId="spend" dataKey="spend" name="Spend" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          <Bar yAxisId="cashback" dataKey="cashback" name="Cashback" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
