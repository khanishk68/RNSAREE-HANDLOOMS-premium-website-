"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin-store";
import { AdminButton, AdminInput } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const admin = useAdminStore((s) => s.admin);
  const hydrated = useAdminStore((s) => s.hydrated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && admin) router.replace("/admin");
  }, [admin, hydrated, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        useAdminStore.setState({
          admin: {
            email: data.admin?.email || email,
            name: data.admin?.name || "RN Admin",
            loggedInAt: new Date().toISOString(),
          },
        });
        toast.success("Welcome back");
        router.replace("/admin");
      } else {
        toast.error("Invalid email or password");
      }
    } catch {
      if (adminLogin(email, password)) {
        toast.success("Welcome back");
        router.replace("/admin");
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,169,98,0.12),transparent_45%),radial-gradient(ellipse_at_70%_80%,rgba(74,14,31,0.35),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#141414]/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a962]/30 to-[#4a0e1f]/50 ring-1 ring-[#c9a962]/40">
            <Sparkles className="h-5 w-5 text-[#c9a962]" />
          </div>
          <h1 className="font-serif text-2xl text-[#e8d5a3]">
            RN SAREE HANDLOOMS
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
            Admin Sign In
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-white/30" />
            <AdminInput
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-white/30" />
            <AdminInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <AdminButton
            type="submit"
            disabled={loading}
            className="w-full py-3"
          >
            {loading ? "Signing in…" : "Enter Admin"}
          </AdminButton>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/30">
          Authorised staff only
        </p>
      </motion.div>
    </div>
  );
}
