import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  val: string | number;
  icon: ReactNode;
  desc: string;
  danger?: boolean;
}

export default function StatsCard({ label, val, icon, desc, danger }: StatsCardProps) {
  return (
    <div
      className={`standard-card p-6 bg-white flex items-start gap-4 ${
        danger ? 'border-red-200 bg-red-50/10' : ''
      }`}
    >
      <div
        className={`p-3 rounded-lg ${
          danger ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-primary'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${danger ? 'text-red-600' : 'text-gray-900'}`}>
          {val}
        </p>
        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{desc}</p>
      </div>
    </div>
  );
}
