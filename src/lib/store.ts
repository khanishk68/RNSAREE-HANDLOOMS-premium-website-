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

type StoredAccount = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthState = {
  user: User | null;
  accounts: StoredAccount[];
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => AuthResult;
};

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`rn-saree|${password}|handlooms`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],

      login: async (email, password) => {
        const normalized = normalizeEmail(email);
        if (!normalized || !password) {
          return { ok: false, error: "Enter email and password" };
        }

        const account = get().accounts.find((a) => a.email === normalized);
        if (!account) {
          return {
            ok: false,
            error: "No account found with this email. Please sign up first.",
          };
        }

        const passwordHash = await hashPassword(password);
        if (passwordHash !== account.passwordHash) {
          return { ok: false, error: "Incorrect password. Please try again." };
        }

        set({
          user: {
            id: account.id,
            name: account.name,
            email: account.email,
            phone: account.phone,
          },
        });
        return { ok: true };
      },

      signup: async (name, email, password) => {
        const trimmedName = name.trim();
        const normalized = normalizeEmail(email);

        if (!trimmedName || !normalized || !password) {
          return { ok: false, error: "Please fill all fields" };
        }
        if (password.length < 6) {
          return {
            ok: false,
            error: "Password must be at least 6 characters",
          };
        }
        if (get().accounts.some((a) => a.email === normalized)) {
          return {
            ok: false,
            error: "An account with this email already exists. Please sign in.",
          };
        }

        const id = crypto.randomUUID();
        const passwordHash = await hashPassword(password);
        const account: StoredAccount = {
          id,
          name: trimmedName,
          email: normalized,
          passwordHash,
          createdAt: new Date().toISOString(),
        };

        set({
          accounts: [...get().accounts, account],
          user: {
            id,
            name: trimmedName,
            email: normalized,
          },
        });
        return { ok: true };
      },

      logout: () => set({ user: null }),

      updateProfile: (data) => {
        const user = get().user;
        if (!user) return { ok: false, error: "Please sign in first" };

        const nextUser: User = {
          ...user,
          ...data,
          email: data.email ? normalizeEmail(data.email) : user.email,
        };

        if (
          nextUser.email !== user.email &&
          get().accounts.some((a) => a.email === nextUser.email)
        ) {
          return {
            ok: false,
            error: "Another account already uses this email",
          };
        }

        set({
          user: nextUser,
          accounts: get().accounts.map((a) =>
            a.id === user.id
              ? {
                  ...a,
                  name: nextUser.name,
                  email: nextUser.email,
                  phone: nextUser.phone,
                }
              : a
          ),
        });
        return { ok: true };
      },
    }),
    {
      name: "rn-auth-v2",
      partialize: (state) => ({
        user: state.user,
        accounts: state.accounts,
      }),
    }
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
