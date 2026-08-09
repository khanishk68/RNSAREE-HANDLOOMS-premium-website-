"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/data";

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-matte"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(74,14,31,0.8) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.p
            className="font-telugu text-gold-soft/80 text-lg md:text-xl mb-6 tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {BRAND.quoteTelugu}
          </motion.p>
          <motion.h1
            className="font-serif text-3xl md:text-5xl text-center tracking-[0.25em] text-pearl px-6"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            RN SAREE
          </motion.h1>
          <motion.p
            className="mt-3 text-[10px] tracking-[0.4em] uppercase text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Handlooms and Dress
          </motion.p>
          <motion.div
            className="mt-12 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.5 }}
          />
          <motion.div
            className="mt-8 w-8 h-8 rounded-full border border-gold/40 border-t-gold animate-spin"
            style={{ animationDuration: "1.2s" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
