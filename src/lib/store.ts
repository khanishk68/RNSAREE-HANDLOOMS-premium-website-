import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./data";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "rn-cart" }
  )
);

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const has = get().ids.includes(productId);
        set({
          ids: has
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        });
      },
      has: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
    }),
    { name: "rn-wishlist" }
  )
);

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email) => {
        set({
          user: {
            id: "u1",
            name: email.split("@")[0],
            email,
          },
        });
        return true;
      },
      signup: (name, email) => {
        set({ user: { id: crypto.randomUUID(), name, email } });
        return true;
      },
      logout: () => set({ user: null }),
      updateProfile: (data) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...data } });
      },
    }),
    { name: "rn-auth" }
  )
);

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  phone: string;
  notes?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

type OrderState = {
  orders: Order[];
  placeOrder: (data: {
    items: CartItem[];
    total: number;
    address: string;
    phone: string;
    notes?: string;
  }) => Order;
  updateStatus: (id: string, status: Order["status"]) => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (data) => {
        const order: Order = {
          id: `RN${Date.now().toString().slice(-8)}`,
          ...data,
          status: "confirmed",
          createdAt: new Date().toISOString(),
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      updateStatus: (id, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        });
      },
    }),
    { name: "rn-orders" }
  )
);
