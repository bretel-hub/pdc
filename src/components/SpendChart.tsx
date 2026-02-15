"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { YearOverYearRecord, formatCurrency, formatAxisValue } from "@/lib/data";

interface SpendChartProps {
  data: YearOverYearRecord[];
  currentYear: number;
  title?: string;
  currentLabel?: string;
  previousLabel?: string;
  hoverLabel?: string;
  dataKeyPrevious?: string;
  dataKeyCurrent?: string;
}

export default function SpendChart({
  data,
  currentYear,
  title = "Total Revenue",
  currentLabel,
  previousLabel,
  hoverLabel,
  dataKeyPrevious = "previousSpend",
  dataKeyCurrent = "currentSpend",
}: SpendChartProps) {
  const prevLabel = previousLabel || `${currentYear - 1}`;
  const currLabel = currentLabel || `${currentYear}`;
  const hover = hoverLabel || "Revenue";

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
              const label = name === prevLabel ? `${prevLabel} ${hover}` : `${currLabel} ${hover}`;
              return [formatCurrency(value as number), label];
            }}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
          />
          <Legend />
          <Bar dataKey={dataKeyPrevious} name={prevLabel} fill="#d1d5db" radius={[4, 4, 0, 0]} />
          <Bar dataKey={dataKeyCurrent} name={currLabel} fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
