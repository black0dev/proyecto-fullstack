import {
  TrendingUp,
  ShoppingCart,
  Package,
  History,
  LogOut,
  Plus,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import type { User } from '../../types';

type Tab = 'dashboard' | 'inventory' | 'pos' | 'history';

interface SidebarProps {
  user: User;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

export default function Sidebar({ user, activeTab, onTabChange, onLogout }: SidebarProps) {
  const isAdmin = user.rol === 'admin';
  const isVendedor = user.rol === 'vendedor';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-primary">
          <Plus size={24} />
          <h1 className="text-xl font-bold tracking-tight">Nova Salud</h1>
        </div>
        <p className="text-[10px] text-gray-400 uppercase font-medium mt-1">Gestión de Inventario</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <SidebarItem
          icon={<TrendingUp size={18} />}
          label="Tablero"
          active={activeTab === 'dashboard'}
          onClick={() => onTabChange('dashboard')}
        />
        {isVendedor && (
          <SidebarItem
            icon={<ShoppingCart size={18} />}
            label="Ventas"
            active={activeTab === 'pos'}
            onClick={() => onTabChange('pos')}
          />
        )}
        {isAdmin && (
          <>
            <SidebarItem
              icon={<Package size={18} />}
              label="Productos"
              active={activeTab === 'inventory'}
              onClick={() => onTabChange('inventory')}
            />
            <SidebarItem
              icon={<History size={18} />}
              label="Historial"
              active={activeTab === 'history'}
              onClick={() => onTabChange('history')}
            />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold text-sm">
            {user.usuario[0].toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-gray-900 uppercase">{user.usuario}</p>
            <p className="text-[10px] text-gray-500 uppercase">{user.rol}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors uppercase font-bold tracking-wider"
        >
          <LogOut size={14} /> Salir
        </button>
      </div>
    </aside>
  );
}
