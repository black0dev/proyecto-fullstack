import type { ReactNode } from 'react';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
        active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className={active ? 'text-white' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
      {active && <div className="w-1 h-4 bg-white/40 rounded-full ml-auto" />}
    </button>
  );
}
