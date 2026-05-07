import { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import ProductModal from './ProductModal';
import type { User, Product } from '../../types';
import { loadProducts, saveProducts } from '../../data/storage';

interface InventoryProps {
  user: User;
}

export default function Inventory({ user }: InventoryProps) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    if (!confirm('¿Desea eliminar este producto?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar medicamento..."
            className="input-standard pl-10 pr-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="standard-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="col-header">ID</th>
              <th className="col-header">Nombre</th>
              <th className="col-header">Categoría</th>
              <th className="col-header text-right">Precio</th>
              <th className="col-header text-center">Stock</th>
              <th className="col-header text-center">Estado</th>
              <th className="col-header text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="data-row">
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">#{product.id}</td>
                <td className="px-4 py-3 font-semibold text-gray-800 uppercase text-sm">
                  {product.nombre}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.categoria || 'General'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  ${product.precio.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center font-bold text-sm">{product.stock_actual}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded ${
                      product.stock_actual <= product.stock_minimo
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {product.stock_actual <= product.stock_minimo ? 'BAJO STOCK' : 'OK'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 text-gray-400">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        products={products}
        setProducts={setProducts}
      />
    </motion.div>
  );
}
