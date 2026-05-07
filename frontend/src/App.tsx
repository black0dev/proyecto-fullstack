import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Login from './components/login/Login';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Inventory from './components/inventory/Inventory';
import PointOfSale from './components/pos/PointOfSale';
import SalesHistory from './components/sales/SalesHistory';
import { loadUser, saveUser, removeUser } from './data/storage';
import type { User } from './types';

type Tab = 'dashboard' | 'inventory' | 'pos' | 'history';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(loadUser());
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    saveUser(u);
  };

  const handleLogout = () => {
    setUser(null);
    removeUser();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-mono text-gray-400">
        CARGANDO...
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="flex-1 h-screen overflow-auto">
        <Header activeTab={activeTab} />
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dash" user={user} />}
            {activeTab === 'pos' && <PointOfSale key="pos" user={user} />}
            {activeTab === 'inventory' && <Inventory key="inv" user={user} />}
            {activeTab === 'history' && <SalesHistory key="his" user={user} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
