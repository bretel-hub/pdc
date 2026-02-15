interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-6 ${accent ? "bg-emerald-600 text-white" : "bg-white border border-gray-200"}`}>
      <p className={`text-sm font-medium ${accent ? "text-emerald-100" : "text-gray-500"}`}>{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
      {sub && <p className={`text-sm mt-1 ${accent ? "text-emerald-200" : "text-gray-400"}`}>{sub}</p>}
    </div>
  );
}
