"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  ImageIcon,
  MessageSquareQuote,
  BarChart3,
  LogOut,
  Menu,
  X,
  Sparkles,
  CloudUpload,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdminStore((s) => s.admin);
  const hydrated = useAdminStore((s) => s.hydrated);
  const setHydrated = useAdminStore((s) => s.setHydrated);
  const adminLogout = useAdminStore((s) => s.adminLogout);
  const loadFromServer = useAdminStore((s) => s.loadFromServer);
  const publishCatalog = useAdminStore((s) => s.publishCatalog);
  const publishStatus = useAdminStore((s) => s.publishStatus);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (useAdminStore.persist.hasHydrated()) {
      setHydrated(true);
      void loadFromServer();
    }
    const unsub = useAdminStore.persist.onFinishHydration(() => {
      setHydrated(true);
      void loadFromServer();
    });
    return unsub;
  }, [setHydrated, loadFromServer]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!hydrated || isLogin) return;
    if (!admin) router.replace("/admin/login");
  }, [admin, hydrated, isLogin, router]);

  if (isLogin) {
    return (
      <div className="fixed inset-0 z-[80] bg-[#0a0a0a] overflow-auto">
        {children}
      </div>
    );
  }

  if (!hydrated || !admin) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 rounded-full border-2 border-[#c9a962]/30 border-t-[#c9a962] animate-spin" />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  async function onPublish() {
    const ok = await publishCatalog();
    if (ok) toast.success("Catalogue published to the live website");
    else
      toast.error(
        "Publish failed. On Vercel, publish locally, commit data/catalog.json, then redeploy."
      );
  }

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#c9a962]/30 to-[#4a0e1f]/60 ring-1 ring-[#c9a962]/40">
          <Sparkles className="h-4 w-4 text-[#c9a962]" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-sm tracking-wide text-[#e8d5a3]">
            RN SAREE
          </p>
          <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/40">
            Admin Panel
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/[0.06] text-[#e8d5a3]"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-pill"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c9a962]/12 to-transparent ring-1 ring-[#c9a962]/25"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-4 w-4",
                  active
                    ? "text-[#c9a962]"
                    : "text-white/35 group-hover:text-white/60"
                )}
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-3 truncate px-1 text-xs text-white/40">
          {admin.email}
        </div>
        <button
          type="button"
          onClick={() => {
            adminLogout();
            router.replace("/admin/login");
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/50 transition hover:bg-[#4a0e1f]/40 hover:text-[#e8d5a3]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="fixed inset-0 z-[80] flex bg-[#0a0a0a] text-white">
      <div className="hidden md:block">{Sidebar}</div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              {Sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/5 bg-[#141414]/80 px-4 backdrop-blur-md md:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-lg text-[#e8d5a3]">
              RN SAREE HANDLOOMS AND DRESS
            </h1>
          </div>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishStatus === "saving"}
            className="inline-flex items-center gap-2 rounded-lg border border-[#c9a962]/35 bg-[#c9a962]/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#c9a962] transition hover:bg-[#c9a962]/20 disabled:opacity-50"
          >
            <CloudUpload className="h-3.5 w-3.5" />
            {publishStatus === "saving"
              ? "Publishing…"
              : publishStatus === "saved"
                ? "Published"
                : publishStatus === "error"
                  ? "Retry publish"
                  : "Publish live"}
          </button>
          <span className="hidden rounded-full bg-[#4a0e1f]/50 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#c9a962] ring-1 ring-[#c9a962]/25 sm:inline">
            Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(74,14,31,0.18),_transparent_55%),linear-gradient(180deg,#0a0a0a,#111)]">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
