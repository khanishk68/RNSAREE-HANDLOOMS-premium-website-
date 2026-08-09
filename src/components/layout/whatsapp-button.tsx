"use client";

import { BRAND } from "@/lib/data";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  if (!BRAND.whatsapp) return null;

  const href = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Namaskaram! I would like to enquire about your saree collections."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-gold-pulse"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
