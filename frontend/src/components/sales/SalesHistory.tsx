import { useState, useEffect } from 'react';
import { FileText, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import StatsCard from '../dashboard/StatsCard';
import type { User, Sale } from '../../types';
import { loadSales } from '../../data/storage';

interface SalesHistoryProps {
  user: User;
}

export default function SalesHistory({ user }: SalesHistoryProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Conectar con backend real:
    // const res = await fetch(`${API_URL}/sales`, {
    //   headers: { Authorization: `Bearer ${user.token}` },
    // });
    // setSales(await res.json());

    setSales(loadSales());
    setLoading(false);
  }, [user.token]);

  const totalAccumulated = sales.reduce((acc, s) => acc + s.total, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Operaciones"
          val={sales.length}
          icon={<FileText className="text-primary" />}
          desc="Ventas del sistema"
        />
        <StatsCard
          label="Total"
          val={`$${totalAccumulated.toFixed(2)}`}
          icon={<TrendingUp className="text-primary" />}
          desc="Cierre acumulado"
        />
      </div>

      <div className="standard-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="col-header">ID Ticket</th>
              <th className="col-header">Vendedor</th>
              <th className="col-header">Fecha / Hora</th>
              <th className="col-header">Productos</th>
              <th className="col-header text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map((sale) => (
              <tr key={sale.id} className="data-row">
                <td className="px-4 py-4 font-mono text-xs text-gray-400">
                  TK-{sale.id.toString().padStart(6, '0')}
                </td>
                <td className="px-4 py-4 text-xs font-bold text-gray-700 uppercase">
                  {sale.vendedor || 'SISTEMA'}
                </td>
                <td className="px-4 py-4 text-xs text-gray-500">
                  {new Date(sale.fecha).toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <p className="text-[10px] text-gray-500 uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                    {sale.items}
                  </p>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-bold text-primary font-mono">
                    ${sale.total.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
            {sales.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 italic text-sm">
                  No se encontraron ventas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
