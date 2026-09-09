"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Admin signs in on the main /account page — no separate login screen. */
export default function AdminLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account");
  }, [router]);

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
        Redirecting to sign in…
      </p>
    </div>
  );
}
