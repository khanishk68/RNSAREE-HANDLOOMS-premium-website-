import { create } from "zustand";
import { persist } from "zustand/middleware";
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

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@rnsareehandlooms.com";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "RNAdmin@2026";

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
  loadFromServer: () => Promise<void>;
  publishCatalog: () => Promise<boolean>;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
  addProduct: (product: Omit<Product, "id"> & { id?: string }) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, "id"> & { id?: string }) => Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateOrderStatus: (id: string, status: AdminOrderStatus) => void;
  upsertOrder: (order: AdminOrder) => void;
  addTestimonial: (
    t: Omit<Testimonial, "id"> & { id?: string }
  ) => Testimonial;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  updateBanner: (id: string, data: Partial<AdminBanner>) => void;
  addBanner: (
    banner: Omit<AdminBanner, "id"> & { id?: string }
  ) => AdminBanner;
  deleteBanner: (id: string) => void;
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

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

let publishTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePublish(get: () => AdminState) {
  if (typeof window === "undefined") return;
  if (publishTimer) clearTimeout(publishTimer);
  publishTimer = setTimeout(() => {
    void get().publishCatalog();
  }, 400);
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: seedCategories.map((c) => ({ ...c })),
      testimonials: [],
      banners: [],
      orders: [],
      admin: null,
      hydrated: false,
      publishStatus: "idle",

      setHydrated: (v) => set({ hydrated: v }),

      loadFromServer: async () => {
        try {
          const res = await fetch("/api/catalog", { cache: "no-store" });
          if (!res.ok) return;
          const data = await res.json();
          const c = data.catalog;
          if (!c) return;
          set({
            products: c.products ?? [],
            categories:
              c.categories?.length > 0
                ? c.categories
                : seedCategories.map((x) => ({ ...x })),
            testimonials: c.testimonials ?? [],
            banners: c.banners ?? [],
          });
        } catch {
          /* keep local */
        }
      },

      publishCatalog: async () => {
        const { products, categories, testimonials, banners } = get();
        set({ publishStatus: "saving" });
        try {
          const res = await fetch("/api/catalog", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              products,
              categories,
              testimonials,
              banners,
            }),
          });
          if (!res.ok) {
            set({ publishStatus: "error" });
            return false;
          }
          set({ publishStatus: "saved" });
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

      adminLogin: (email, password) => {
        if (
          email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          password === ADMIN_PASSWORD
        ) {
          set({
            admin: {
              email: ADMIN_EMAIL,
              name: "RN Admin",
              loggedInAt: new Date().toISOString(),
            },
          });
          return true;
        }
        return false;
      },

      adminLogout: () => set({ admin: null }),

      addProduct: (product) => {
        const id = product.id || `p-${crypto.randomUUID().slice(0, 8)}`;
        let slug = product.slug || slugFromName(product.name);
        const existing = new Set(get().products.map((p) => p.slug));
        if (existing.has(slug)) {
          let n = 2;
          while (existing.has(`${slug}-${n}`)) n += 1;
          slug = `${slug}-${n}`;
        }
        const next: Product = { ...product, id, slug };
        set({ products: [next, ...get().products] });
        schedulePublish(get);
        return next;
      },

      updateProduct: (id, data) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...data, id } : p
          ),
        });
        schedulePublish(get);
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
        schedulePublish(get);
      },

      addCategory: (category) => {
        const id = category.id || `c-${crypto.randomUUID().slice(0, 8)}`;
        const slug = category.slug || slugFromName(category.name);
        const next: Category = { ...category, id, slug };
        set({ categories: [...get().categories, next] });
        schedulePublish(get);
        return next;
      },

      updateCategory: (id, data) => {
        set({
          categories: get().categories.map((c) =>
            c.id === id ? { ...c, ...data, id } : c
          ),
        });
        schedulePublish(get);
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
        schedulePublish(get);
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
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

      addTestimonial: (t) => {
        const id = t.id || `t-${crypto.randomUUID().slice(0, 8)}`;
        const next: Testimonial = { ...t, id };
        set({ testimonials: [next, ...get().testimonials] });
        schedulePublish(get);
        return next;
      },

      updateTestimonial: (id, data) => {
        set({
          testimonials: get().testimonials.map((t) =>
            t.id === id ? { ...t, ...data, id } : t
          ),
        });
        schedulePublish(get);
      },

      deleteTestimonial: (id) => {
        set({
          testimonials: get().testimonials.filter((t) => t.id !== id),
        });
        schedulePublish(get);
      },

      updateBanner: (id, data) => {
        set({
          banners: get().banners.map((b) =>
            b.id === id ? { ...b, ...data, id } : b
          ),
        });
        schedulePublish(get);
      },

      addBanner: (banner) => {
        const id = banner.id || `banner-${crypto.randomUUID().slice(0, 8)}`;
        const next: AdminBanner = {
          ...banner,
          id,
          order: banner.order ?? get().banners.length,
          active: banner.active ?? true,
        };
        set({ banners: [...get().banners, next] });
        schedulePublish(get);
        return next;
      },

      deleteBanner: (id) => {
        set({ banners: get().banners.filter((b) => b.id !== id) });
        schedulePublish(get);
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
    }),
    {
      name: "rn-admin-prod-v2",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        void state?.loadFromServer();
      },
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        testimonials: state.testimonials,
        banners: state.banners,
        orders: state.orders,
        admin: state.admin,
      }),
    }
  )
);
