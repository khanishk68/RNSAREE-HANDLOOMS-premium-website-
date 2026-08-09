"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/ui/reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    // Simulated subscribe — replace with API when ready
    setTimeout(() => {
      toast.success("Welcome to the house — you are on the list.");
      setEmail("");
      setLoading(false);
    }, 600);
  }

  return (
    <section className="relative overflow-hidden bg-maroon-deep text-pearl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,169,98,0.18), transparent 55%), linear-gradient(180deg, rgba(45,8,18,0.2), transparent)",
        }}
      />

      <div className="relative section-pad max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-4">
            Private List
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-pearl leading-tight text-balance">
            First to the loom
          </h2>
          <div className="mt-6 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 text-pearl/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Receive early access to limited editions, bridal previews, and
            atelier notes — never noise, only invitation.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 bg-transparent border border-gold/40 px-5 py-3.5 text-pearl placeholder:text-pearl/35 text-sm tracking-wide outline-none focus:border-gold transition-colors"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="luxury-btn shrink-0 disabled:opacity-60"
            >
              {loading ? "Joining…" : "Subscribe"}
            </button>
          </form>
          <p className="mt-4 text-[11px] text-pearl/40 tracking-wide">
            By subscribing you agree to receive occasional emails from RN Saree
            Handlooms.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
