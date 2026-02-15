"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { YearOverYearRecord, formatCurrency, formatAxisValue } from "@/lib/data";

interface CashbackChartProps {
  data: YearOverYearRecord[];
  currentYear: number;
  title?: string;
  hoverLabel?: string;
}

export default function CashbackChart({
  data,
  currentYear,
  title = "Total Cash Rewards Distributed",
  hoverLabel = "Cash Rewards",
}: CashbackChartProps) {
  const prevLabel = `${currentYear - 1}`;
  const currLabel = `${currentYear}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => formatAxisValue(v)}
          />
          <Tooltip
            formatter={(value, name) => {
              const label = name === prevLabel ? `${prevLabel} ${hoverLabel}` : `${currLabel} ${hoverLabel}`;
              return [formatCurrency(value as number), label];
            }}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
            cursor={false}
          />
          <Legend />
          <Bar dataKey="previousCashback" name={prevLabel} fill="#d1d5db" radius={[4, 4, 0, 0]} />
          <Bar dataKey="currentCashback" name={currLabel} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
