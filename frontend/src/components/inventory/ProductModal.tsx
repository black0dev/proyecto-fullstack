import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../../types';

const CATEGORIES = [
  'Analgesia', 'Antibióticos', 'Dermatol.', 'Vitaminas',
  'Insulinas', 'Gastro', 'Respirat.', 'Otros',
];

interface ProductForm {
  nombre: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  categoria: string;
}

const EMPTY_FORM: ProductForm = {
  nombre: '',
  precio: 0,
  stock_actual: 0,
  stock_minimo: 5,
  categoria: 'Analgesia',
};

function productToForm(p: Product): ProductForm {
  return {
    nombre: p.nombre,
    precio: p.precio,
    stock_actual: p.stock_actual,
    stock_minimo: p.stock_minimo,
    categoria: p.categoria || 'Analgesia',
  };
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  products,
  setProducts,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductForm>(EMPTY_FORM);

  useEffect(() => {
    setFormData(product ? productToForm(product) : EMPTY_FORM);
  }, [product, isOpen]);

  const updateField = <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // TODO: Conectar con backend real:
    // const method = product ? 'PUT' : 'POST';
    // const url = product ? `${API_URL}/products/${product.id}` : `${API_URL}/products`;
    // const res = await fetch(url, {
    //   method,
    //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
    //   body: JSON.stringify(formData),
    // });
    // if (res.ok) { onClose(); }

    if (product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...formData } : p)),
      );
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { id: newId, ...formData }]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-800">
            {product ? 'Editar' : 'Nuevo'} Producto
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
            <input
              required
              type="text"
              className="input-standard px-3"
              value={formData.nombre}
              onChange={(e) => updateField('nombre', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className="input-standard px-3 font-mono"
                value={formData.precio}
                onChange={(e) => updateField('precio', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Inicial</label>
              <input
                required
                type="number"
                className="input-standard px-3 font-mono"
                value={formData.stock_actual}
                onChange={(e) => updateField('stock_actual', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mínimo</label>
              <input
                required
                type="number"
                className="input-standard px-3 font-mono"
                value={formData.stock_minimo}
                onChange={(e) => updateField('stock_minimo', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
              <select
                className="input-standard px-3"
                value={formData.categoria}
                onChange={(e) => updateField('categoria', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button className="btn-primary w-full py-3">
              {product ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
