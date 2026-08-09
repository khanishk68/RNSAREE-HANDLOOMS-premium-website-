"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-2xl tracking-wide text-[#e8d5a3] md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-white/45">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-5 shadow-[0_0_0_1px_rgba(201,169,98,0.04)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "outline";
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-40",
        variant === "primary" &&
          "bg-[#c9a962] text-[#0a0a0a] hover:bg-[#d4af37]",
        variant === "ghost" &&
          "text-white/60 hover:bg-white/5 hover:text-white",
        variant === "danger" &&
          "bg-[#4a0e1f]/70 text-[#e8d5a3] hover:bg-[#4a0e1f] ring-1 ring-[#c9a962]/20",
        variant === "outline" &&
          "border border-[#c9a962]/35 text-[#c9a962] hover:bg-[#c9a962]/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-xs uppercase tracking-[0.12em] text-white/40">
          {label}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#c9a962]/50 focus:ring-1 focus:ring-[#c9a962]/30",
          className
        )}
        {...props}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-xs uppercase tracking-[0.12em] text-white/40">
          {label}
        </span>
      )}
      <textarea
        className={cn(
          "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#c9a962]/50 focus:ring-1 focus:ring-[#c9a962]/30 min-h-[88px]",
          className
        )}
        {...props}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-xs uppercase tracking-[0.12em] text-white/40">
          {label}
        </span>
      )}
      <select
        className={cn(
          "w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#c9a962]/50 focus:ring-1 focus:ring-[#c9a962]/30",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function AdminModal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-[#141414] p-5 shadow-2xl sm:rounded-2xl sm:p-6",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl text-[#e8d5a3]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/40 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
    confirmed: "bg-[#c9a962]/15 text-[#e8d5a3] ring-[#c9a962]/30",
    shipped: "bg-sky-500/15 text-sky-200 ring-sky-500/30",
    delivered: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-200 ring-red-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wider ring-1",
        colors[status] || "bg-white/10 text-white/60 ring-white/20"
      )}
    >
      {status}
    </span>
  );
}
