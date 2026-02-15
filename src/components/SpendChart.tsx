"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { YearOverYearRecord, formatCurrency } from "@/lib/data";

interface SpendChartProps {
  data: YearOverYearRecord[];
  currentYear: number;
}

export default function SpendChart({ data, currentYear }: SpendChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spend & Cash Distributed</h3>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [formatCurrency(value as number), name]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
          />
          <Legend />
          <Bar dataKey="previousSpend" name={`${currentYear - 1} Spend`} fill="#d1d5db" radius={[4, 4, 0, 0]} />
          <Bar dataKey="currentSpend" name={`${currentYear} Spend`} fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
