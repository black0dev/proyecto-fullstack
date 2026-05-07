type Tab = 'dashboard' | 'inventory' | 'pos' | 'history';

const HEADER_TITLES: Record<Tab, string> = {
  dashboard: 'Resumen General',
  pos: 'Caja Registradora',
  inventory: 'Inventario Médico',
  history: 'Historial',
};

interface HeaderProps {
  activeTab: Tab;
}

export default function Header({ activeTab }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-lg font-bold text-gray-800">{HEADER_TITLES[activeTab]}</h2>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 font-medium">
          {new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>
    </header>
  );
}
