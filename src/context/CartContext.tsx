'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { computeTotals, type CartItem, type CartTotals } from '@/lib/catalog';

const STORAGE_KEY = 'bionu-cart-v1';

type CartContextValue = CartTotals & {
  items: CartItem[];
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string, qty?: number, opts?: { open?: boolean }) => void;
  addMany: (ids: string[], opts?: { open?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (i): i is CartItem => typeof i?.id === 'string' && Number.isInteger(i?.qty) && i.qty > 0,
            ),
          );
        }
      }
    } catch {
      /* localStorage недоступен — работаем без сохранения */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const add = useCallback((id: string, qty = 1, opts?: { open?: boolean }) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
      return [...prev, { id, qty }];
    });
    if (opts?.open !== false) setIsOpen(true);
  }, []);

  const addMany = useCallback(
    (ids: string[], opts?: { open?: boolean }) => {
      ids.forEach((id) => add(id, 1, { open: false }));
      if (opts?.open !== false) setIsOpen(true);
    },
    [add],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)),
    );
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totals = computeTotals(items);
    return {
      ...totals,
      items,
      hydrated,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      addMany,
      setQty,
      remove,
      clear,
      qtyOf: (id: string) => items.find((i) => i.id === id)?.qty ?? 0,
    };
  }, [items, hydrated, isOpen, add, addMany, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
