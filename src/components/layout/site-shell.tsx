"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/layout/page-loader";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { LakshmiAssistant } from "@/components/lakshmi/assistant";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    // Custom cursor hides the system pointer — only enable it on the storefront
    document.body.classList.toggle("custom-cursor-active", !isAdmin);
    return () => {
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <Navbar />
      <main className="flex-1 page-enter">{children}</main>
      <Footer />
      <LakshmiAssistant />
      <WhatsAppButton />
    </>
  );
}
