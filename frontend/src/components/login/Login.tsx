import { useState } from 'react';
import type { FormEvent } from 'react';
import { Package, ShoppingCart, Plus } from 'lucide-react';
import type { User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const ROLES = [
  { label: 'Administrador', user: 'admin', pass: 'admin123', icon: <Package size={20} /> },
  { label: 'Vendedor', user: 'vendedor', pass: 'vend123', icon: <ShoppingCart size={20} /> },
];

export default function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: Conectar con backend real:
    // const res = await fetch(`${API_URL}/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ usuario, password }),
    // });
    // const data = await res.json();
    // if (res.ok) onLogin(data);
    // else setError(data.error || 'Credenciales incorrectas');

    const validUser = ROLES.find((r) => r.user === usuario && r.pass === password);
    if (validUser) {
      onLogin({
        id: validUser.user === 'admin' ? 1 : 2,
        usuario: validUser.user,
        token: 'mock-token-' + Date.now(),
        rol: validUser.user === 'admin' ? 'admin' : 'vendedor',
      });
    } else {
      setError('Credenciales incorrectas');
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <div className="p-8 bg-primary text-white text-center">
          <Plus size={40} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Nova Salud</h1>
          <p className="text-blue-100 text-sm mt-1">Gestión de Inventario y Ventas</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold text-center text-gray-400 uppercase tracking-wider mb-4">
              Seleccione su rol para ingresar
            </p>
            <div className="grid grid-cols-2 gap-4">
              {ROLES.map((r) => (
                <button
                  key={r.user}
                  onClick={() => { setUsuario(r.user); setPassword(r.pass); setError(''); }}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                    usuario === r.user
                      ? 'border-primary bg-blue-50 text-primary'
                      : 'border-gray-200 hover:border-primary/50 text-gray-500'
                  }`}
                >
                  {r.icon}
                  <span className="text-xs font-bold uppercase">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="input-standard px-3 bg-gray-50"
                placeholder="Nombre de usuario"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-standard px-3 bg-gray-50"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center bg-red-50 py-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 active:scale-[0.98]"
            >
              {loading ? 'Cargando...' : 'Entrar al Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
