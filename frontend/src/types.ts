export interface User {
  id: number;
  usuario: string;
  token: string;
  rol: 'admin' | 'vendedor';
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  categoria: string;
}

export interface Sale {
  id: number;
  fecha: string;
  total: number;
  items: string;
  vendedor: string;
}

export interface CartItem extends Product {
  cantidad: number;
}
