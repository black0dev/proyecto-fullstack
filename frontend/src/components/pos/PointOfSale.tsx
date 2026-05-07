import { useState, useEffect } from 'react';
import { Search, Plus, ShoppingCart, Package, X, ChevronRight } from 'lucide-react';
import type { User, Product, CartItem, Sale } from '../../types';
import { loadProducts, saveProducts, loadSales, saveSales } from '../../data/storage';

interface PointOfSaleProps {
  user: User;
}

export default function PointOfSale({ user }: PointOfSaleProps) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(false);

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.categoria)))];

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) &&
      p.stock_actual > 0 &&
      (selectedCategory === 'Todos' || p.categoria === selectedCategory),
  );

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.cantidad >= product.stock_actual) return;
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        ),
      );
    } else {
      setCart((prev) => [...prev, { ...product, cantidad: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLoading(true);

    // TODO: Conectar con backend real:
    // const res = await fetch(`${API_URL}/sales`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
    //   body: JSON.stringify({ items: cart.map(i => ({ id: i.id, cantidad: i.cantidad })), total }),
    // });

    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((c) => c.id === p.id);
      return cartItem ? { ...p, stock_actual: p.stock_actual - cartItem.cantidad } : p;
    });
    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    const newSale: Sale = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      total,
      items: cart.map((i) => `${i.nombre} x${i.cantidad}`).join(', '),
      vendedor: user.usuario,
    };
    const sales = loadSales();
    sales.push(newSale);
    saveSales(sales);

    setCart([]);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="input-standard pl-10 pr-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors border whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => addToCart(product)} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              No se encontraron productos disponibles
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 sticky top-24">
        <CartSidebar
          cart={cart}
          total={total}
          loading={loading}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="standard-card p-4 hover:border-primary transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {product.categoria}
        </span>
        <Plus size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="font-bold text-gray-800 uppercase text-sm mb-1">{product.nombre}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-primary font-bold text-lg">${product.precio.toFixed(2)}</p>
        <p className="text-[10px] text-gray-400">Stock: {product.stock_actual}</p>
      </div>
    </div>
  );
}

function CartSidebar({
  cart,
  total,
  loading,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  total: number;
  loading: boolean;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="standard-card flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          <ShoppingCart size={18} /> Carrito
        </h3>
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {cart.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <Package size={32} className="mb-2 opacity-20" />
            <p className="text-sm">El carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-1">
            {cart.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded flex justify-between items-center group">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-gray-800 uppercase truncate">{item.nombre}</p>
                  <p className="text-[10px] text-gray-500">
                    ${item.precio.toFixed(2)} x {item.cantidad}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-xs text-primary">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50/50">
        <div className="flex justify-between items-end">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total a Pagar</p>
          <p className="text-3xl font-black text-primary">${total.toFixed(2)}</p>
        </div>
        <button
          disabled={cart.length === 0 || loading}
          onClick={onCheckout}
          className="w-full btn-primary py-4 disabled:opacity-50 disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : <><>Finalizar Compra <ChevronRight size={18} /></></>}
        </button>
      </div>
    </div>
  );
}
