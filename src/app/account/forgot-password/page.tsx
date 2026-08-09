"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { BRAND } from "@/lib/data";
import { toast } from "sonner";

const inputClass =
  "w-full bg-pearl/80 border border-gold/35 px-4 py-3.5 pl-10 text-sm text-charcoal placeholder:text-muted/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Reset link sent");
    }, 700);
  }

  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(201,169,98,0.15), transparent 50%), linear-gradient(165deg, var(--cream), var(--pearl))",
        }}
      />

      <div className="relative max-w-md mx-auto px-4 md:px-8">
        <Reveal>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-maroon mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Account
          </Link>
          <SectionHeading
            eyebrow="Account Recovery"
            title="Forgot Password"
            subtitle="We'll send a reset link to your email"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            className="luxury-card p-6 md:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {sent ? (
              <div className="text-center py-6">
                <div className="mx-auto w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mb-5">
                  <Mail className="w-6 h-6 text-gold" strokeWidth={1.25} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal mb-2">
                  Check your inbox
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  If an account exists for{" "}
                  <span className="text-charcoal">{email}</span>, you will
                  receive reset instructions shortly. For immediate help, contact
                  us on WhatsApp or phone.
                </p>
                <Link href="/account" className="luxury-btn inline-flex">
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-sm text-muted leading-relaxed">
                  Enter the email associated with your{" "}
                  {BRAND.shortName} account.
                </p>
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="you@email.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="luxury-btn w-full disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
                <p className="text-center text-[11px] text-muted tracking-wide">
                  Need help? Call {BRAND.phone || "our store"}
                </p>
              </form>
            )}
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
}
