"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-12 md:mb-16 max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "text-[11px] tracking-[0.35em] uppercase mb-4",
            light ? "text-gold" : "text-maroon"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance",
          light ? "text-pearl" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg leading-relaxed",
            light ? "text-pearl/60" : "text-muted"
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent",
          center && "mx-auto"
        )}
      />
    </div>
  );
}

export function LuxuryButton({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  className?: string;
  type?: "button" | "submit";
}) {
  const cls = cn(
    "luxury-btn",
    variant === "outline" && "luxury-btn-outline",
    className
  );

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
