"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Package,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";
import { useAuthStore, useOrderStore, type Order } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { BRAND } from "@/lib/data";
import { toast } from "sonner";

const inputClass =
  "w-full bg-pearl/80 border border-gold/35 px-4 py-3.5 text-sm text-charcoal placeholder:text-muted/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors";

const statusLabel: Record<Order["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const orders = useOrderStore((s) => s.orders);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 px-4">
        <div className="max-w-lg mx-auto h-64 skeleton" />
      </div>
    );
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter email and password");
      return;
    }
    const result = await login(email.trim(), password);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Welcome back");
    setPassword("");
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    const result = await signup(name.trim(), email.trim(), password);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Account created");
    setPassword("");
    setConfirm("");
  }

  function handleProfile(e: FormEvent) {
    e.preventDefault();
    const nextEmail = email.trim().toLowerCase();
    if (!name.trim() || !nextEmail) {
      toast.error("Name and email are required");
      return;
    }
    const result = updateProfile({
      name: name.trim(),
      email: nextEmail,
      phone: phone.trim() || undefined,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated");
  }

  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 0%, rgba(201,169,98,0.12), transparent 45%), linear-gradient(180deg, var(--cream), var(--ivory))",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={user ? "My Atelier" : "Welcome"}
            title={user ? "Account" : "Sign In"}
            subtitle={
              user
                ? `Namaste, ${user.name}`
                : `${BRAND.shortName} · ${BRAND.quote}`
            }
          />
        </Reveal>

        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <Reveal delay={0.08}>
                <form
                  onSubmit={handleProfile}
                  className="luxury-card p-6 md:p-8 space-y-5"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-full bg-maroon flex items-center justify-center">
                      <User className="w-6 h-6 text-gold" strokeWidth={1.25} />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-charcoal">
                        Profile
                      </h3>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${inputClass} pl-10`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${inputClass} pl-10`}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button type="submit" className="luxury-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        toast("Signed out");
                      }}
                      className="luxury-btn luxury-btn-outline inline-flex"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </form>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="luxury-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-5 h-5 text-gold" />
                    <h3 className="font-serif text-2xl text-charcoal">
                      Order History
                    </h3>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted mb-4">No orders yet.</p>
                      <Link href="/shop" className="luxury-btn inline-flex text-[10px] py-3">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gold/20">
                      {orders.map((order) => (
                        <li key={order.id}>
                          <Link
                            href={`/order-confirmation/${order.id}`}
                            className="flex items-center justify-between gap-4 py-4 group"
                          >
                            <div>
                              <p className="font-serif text-lg text-charcoal group-hover:text-maroon transition-colors">
                                {order.id}
                              </p>
                              <p className="text-xs text-muted mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}{" "}
                                · {statusLabel[order.status]} ·{" "}
                                {formatINR(order.total)}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gold shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/track-order"
                    className="inline-block mt-4 text-[11px] tracking-[0.2em] uppercase text-maroon hover:text-gold transition-colors"
                  >
                    Track an Order →
                  </Link>
                </div>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="luxury-card p-6 md:p-8 max-w-md mx-auto">
                <div className="flex border-b border-gold/25 mb-8">
                  {(["login", "signup"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`flex-1 pb-3 text-[11px] tracking-[0.25em] uppercase transition-colors ${
                        tab === t
                          ? "text-maroon border-b-2 border-gold"
                          : "text-muted hover:text-charcoal"
                      }`}
                    >
                      {t === "login" ? "Login" : "Signup"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          placeholder="you@email.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputClass}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Link
                          href="/account/forgot-password"
                          className="text-xs text-muted hover:text-maroon transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <button type="submit" className="luxury-btn w-full mt-2">
                        Sign In
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      onSubmit={handleSignup}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                          placeholder="Your name"
                          autoComplete="name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          placeholder="you@email.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputClass}
                          placeholder="Min. 6 characters"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          className={inputClass}
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                      <button type="submit" className="luxury-btn w-full mt-2">
                        Create Account
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
