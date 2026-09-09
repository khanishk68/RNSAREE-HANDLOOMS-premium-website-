import { create } from "zustand";
import {
  categories as seedCategories,
  type Product,
  type Category,
  type Testimonial,
} from "./data";

export type AdminBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
};

export type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  total: number;
  status: AdminOrderStatus;
  createdAt: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  notes?: string;
};

export type AdminSession = {
  email: string;
  name: string;
  loggedInAt: string;
};

type AdminState = {
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  banners: AdminBanner[];
  orders: AdminOrder[];
  admin: AdminSession | null;
  hydrated: boolean;
  publishStatus: "idle" | "saving" | "saved" | "error";
  setHydrated: (v: boolean) => void;
  restoreSession: () => Promise<void>;
  signInAdmin: (email: string, password: string) => Promise<boolean>;
  loadFromServer: () => Promise<void>;
  loadOrders: () => Promise<void>;
  publishCatalog: () => Promise<boolean>;
  adminLogout: () => Promise<void>;
  addProduct: (product: Omit<Product, "id"> & { id?: string }) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (
    category: Omit<Category, "id"> & { id?: string }
  ) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: AdminOrderStatus) => Promise<void>;
  upsertOrder: (order: AdminOrder) => void;
  addTestimonial: (
    t: Omit<Testimonial, "id"> & { id?: string }
  ) => Promise<Testimonial>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  updateBanner: (id: string, data: Partial<AdminBanner>) => Promise<void>;
  addBanner: (
    banner: Omit<AdminBanner, "id"> & { id?: string }
  ) => Promise<AdminBanner>;
  deleteBanner: (id: string) => Promise<void>;
  analytics: () => {
    totalProducts: number;
    lowStock: number;
    revenue: number;
    orderCounts: Record<AdminOrderStatus, number>;
    totalOrders: number;
    categoriesCount: number;
    avgOrderValue: number;
  };
};

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
    ...init,
  });
  const data = (await res.json().catch(() => ({}))) as T & {
    error?: string;
    ok?: boolean;
  };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function notifyLiveCatalog() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("rn-catalog-updated"));
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  products: [],
  categories: seedCategories.map((c) => ({ ...c })),
  testimonials: [],
  banners: [],
  orders: [],
  admin: null,
  hydrated: false,
  publishStatus: "idle",

  setHydrated: (v) => set({ hydrated: v }),

  restoreSession: async () => {
    try {
      const data = await apiJson<{
        ok: boolean;
        admin?: { email: string; name: string };
      }>("/api/auth/admin");
      if (data.ok && data.admin) {
        set({
          admin: {
            email: data.admin.email,
            name: data.admin.name || "RN Admin",
            loggedInAt: new Date().toISOString(),
          },
        });
      } else {
        set({ admin: null });
      }
    } catch {
      set({ admin: null });
    } finally {
      set({ hydrated: true });
    }
  },

  signInAdmin: async (email, password) => {
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        admin?: { email: string; name: string };
      };
      if (!res.ok || !data.ok) return false;
      set({
        admin: {
          email: data.admin?.email || email,
          name: data.admin?.name || "RN Admin",
          loggedInAt: new Date().toISOString(),
        },
        hydrated: true,
      });
      await get().loadFromServer();
      await get().loadOrders();
      return true;
    } catch {
      return false;
    }
  },

  loadFromServer: async () => {
    try {
      const data = await apiJson<{
        catalog?: {
          products?: Product[];
          categories?: Category[];
          testimonials?: Testimonial[];
          banners?: AdminBanner[];
        };
      }>("/api/admin/catalog");
      const c = data.catalog;
      if (!c) return;
      set({
        products: c.products ?? [],
        categories:
          (c.categories?.length ?? 0) > 0
            ? c.categories!
            : seedCategories.map((x) => ({ ...x })),
        testimonials: c.testimonials ?? [],
        banners: c.banners ?? [],
      });
    } catch {
      /* session may be missing */
    }
  },

  loadOrders: async () => {
    try {
      const data = await apiJson<{ orders?: AdminOrder[] }>("/api/orders");
      set({ orders: Array.isArray(data.orders) ? data.orders : [] });
    } catch {
      /* keep current */
    }
  },

  publishCatalog: async () => {
    const { products, categories, testimonials, banners } = get();
    set({ publishStatus: "saving" });
    try {
      await apiJson("/api/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products,
          categories,
          testimonials,
          banners,
        }),
      });
      set({ publishStatus: "saved" });
      await get().loadFromServer();
      notifyLiveCatalog();
      setTimeout(() => {
        if (get().publishStatus === "saved") {
          set({ publishStatus: "idle" });
        }
      }, 2500);
      return true;
    } catch {
      set({ publishStatus: "error" });
      return false;
    }
  },

  adminLogout: async () => {
    try {
      await fetch("/api/auth/admin", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
    set({ admin: null });
  },

  addProduct: async (product) => {
    const data = await apiJson<{ product: Product }>("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    set({ products: [data.product, ...get().products] });
    notifyLiveCatalog();
    return data.product;
  },

  updateProduct: async (id, payload) => {
    const data = await apiJson<{ product: Product }>(
      `/api/admin/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    set({
      products: get().products.map((p) => (p.id === id ? data.product : p)),
    });
    notifyLiveCatalog();
  },

  deleteProduct: async (id) => {
    await apiJson(`/api/admin/products/${id}`, { method: "DELETE" });
    set({ products: get().products.filter((p) => p.id !== id) });
    notifyLiveCatalog();
  },

  addCategory: async (category) => {
    const data = await apiJson<{ category: Category }>(
      "/api/admin/categories",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      }
    );
    set({ categories: [...get().categories, data.category] });
    notifyLiveCatalog();
    return data.category;
  },

  updateCategory: async (id, payload) => {
    const data = await apiJson<{ category: Category }>(
      `/api/admin/categories/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    set({
      categories: get().categories.map((c) =>
        c.id === id ? data.category : c
      ),
    });
    notifyLiveCatalog();
  },

  deleteCategory: async (id) => {
    await apiJson(`/api/admin/categories/${id}`, { method: "DELETE" });
    set({ categories: get().categories.filter((c) => c.id !== id) });
    notifyLiveCatalog();
  },

  updateOrderStatus: async (id, status) => {
    const data = await apiJson<{ order: AdminOrder }>("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    set({
      orders: get().orders.map((o) => (o.id === id ? data.order : o)),
    });
  },

  upsertOrder: (order) => {
    const exists = get().orders.some((o) => o.id === order.id);
    if (exists) {
      set({
        orders: get().orders.map((o) =>
          o.id === order.id ? { ...o, ...order } : o
        ),
      });
    } else {
      set({ orders: [order, ...get().orders] });
    }
  },

  addTestimonial: async (t) => {
    const data = await apiJson<{ testimonial: Testimonial }>(
      "/api/admin/testimonials",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      }
    );
    set({ testimonials: [data.testimonial, ...get().testimonials] });
    notifyLiveCatalog();
    return data.testimonial;
  },

  updateTestimonial: async (id, payload) => {
    const data = await apiJson<{ testimonial: Testimonial }>(
      `/api/admin/testimonials/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    set({
      testimonials: get().testimonials.map((t) =>
        t.id === id ? data.testimonial : t
      ),
    });
    notifyLiveCatalog();
  },

  deleteTestimonial: async (id) => {
    await apiJson(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    set({
      testimonials: get().testimonials.filter((t) => t.id !== id),
    });
    notifyLiveCatalog();
  },

  updateBanner: async (id, payload) => {
    const data = await apiJson<{ banner: AdminBanner }>(
      `/api/admin/banners/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    set({
      banners: get().banners.map((b) => (b.id === id ? data.banner : b)),
    });
    notifyLiveCatalog();
  },

  addBanner: async (banner) => {
    const data = await apiJson<{ banner: AdminBanner }>("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...banner,
        order: banner.order ?? get().banners.length,
        active: banner.active ?? true,
      }),
    });
    set({ banners: [...get().banners, data.banner] });
    notifyLiveCatalog();
    return data.banner;
  },

  deleteBanner: async (id) => {
    await apiJson(`/api/admin/banners/${id}`, { method: "DELETE" });
    set({ banners: get().banners.filter((b) => b.id !== id) });
    notifyLiveCatalog();
  },

  analytics: () => {
    const { products, orders, categories } = get();
    const orderCounts: Record<AdminOrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    let revenue = 0;
    for (const o of orders) {
      orderCounts[o.status] = (orderCounts[o.status] || 0) + 1;
      if (o.status !== "cancelled") revenue += o.total;
    }
    const active = orders.filter((o) => o.status !== "cancelled").length;
    return {
      totalProducts: products.length,
      lowStock: products.filter((p) => p.stock < 5).length,
      revenue,
      orderCounts,
      totalOrders: orders.length,
      categoriesCount: categories.length,
      avgOrderValue: active ? Math.round(revenue / active) : 0,
    };
  },
}));
