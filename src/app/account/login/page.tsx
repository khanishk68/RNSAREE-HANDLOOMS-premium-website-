"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Dedicated login route — redirects to account (login/signup tabs). */
export default function AccountLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account");
  }, [router]);

  return (
    <div className="min-h-[60vh] pt-32 flex items-center justify-center px-4">
      <p className="text-[11px] tracking-[0.3em] uppercase text-muted">
        Redirecting to account…
      </p>
    </div>
  );
}
