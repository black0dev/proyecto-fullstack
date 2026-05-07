import { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, AlertTriangle, History } from 'lucide-react';
import { motion } from 'motion/react';
import StatsCard from './StatsCard';
import type { User, Product, Sale } from '../../types';
import { loadProducts, loadSales } from '../../data/storage';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Conectar con backend real:
    // const [prodRes, saleRes] = await Promise.all([
    //   fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${user.token}` } }),
    //   fetch(`${API_URL}/sales`,    { headers: { Authorization: `Bearer ${user.token}` } }),
    // ]);
    // setProducts(await prodRes.json());
    // setSales(await saleRes.json());

    setProducts(loadProducts());
    setSales(loadSales());
    setLoading(false);
  }, [user.token]);

  const today = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter((s) => s.fecha.startsWith(today));
  const revenueToday = salesToday.reduce((acc, s) => acc + s.total, 0);
  const lowStock = products.filter((p) => p.stock_actual <= p.stock_minimo);

  if (loading) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Ventas Hoy"
          val={salesToday.length}
          icon={<ShoppingCart className="text-blue-600" />}
          desc="Transacciones registradas"
        />
        <StatsCard
          label="Ingresos Hoy"
          val={`$${revenueToday.toFixed(2)}`}
          icon={<TrendingUp className="text-green-600" />}
          desc="Total recaudado"
        />
        <StatsCard
          label="Stock Bajo"
          val={lowStock.length}
          icon={<AlertTriangle className="text-red-500" />}
          desc="Alertas activas"
          danger={lowStock.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LowStockCard products={lowStock} />
        <RecentSalesCard sales={sales} />
      </div>
    </motion.div>
  );
}

function LowStockCard({ products }: { products: Product[] }) {
  return (
    <div className="standard-card">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-700">Stock Crítico</h3>
        <AlertTriangle size={16} className="text-red-500" />
      </div>
      <div className="p-2">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Sin alertas de stock</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm text-gray-800 uppercase">{p.nombre}</p>
                  <p className="text-xs text-gray-500">Stock actual: {p.stock_actual}</p>
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  Mínimo: {p.stock_minimo}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecentSalesCard({ sales }: { sales: Sale[] }) {
  return (
    <div className="standard-card">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-700">Últimas Ventas</h3>
        <History size={16} className="text-blue-500" />
      </div>
      <div className="p-2">
        {sales.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay ventas registradas</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sales.slice(-5).reverse().map((s) => (
              <div key={s.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm text-gray-800">TICKET #{s.id}</p>
                  <p className="text-xs text-gray-500 capitalize">{s.vendedor || 'Sistema'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">${s.total.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(s.fecha).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
