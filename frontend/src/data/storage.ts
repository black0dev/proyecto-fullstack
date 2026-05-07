import type { User, Product, Sale } from '../types';

const PRODUCTS_KEY = 'nova_salud_products';
const SALES_KEY = 'nova_salud_sales';

export function loadProducts(): Product[] {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function loadSales(): Sale[] {
  const saved = localStorage.getItem(SALES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveSales(sales: Sale[]): void {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

export function saveUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function loadUser(): User | null {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
}

export function removeUser(): void {
  localStorage.removeItem('user');
}
