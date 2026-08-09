import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit, Tiro_Telugu } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/site-shell";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const tiro = Tiro_Telugu({
  variable: "--font-tiro",
  subsets: ["telugu", "latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RN Saree Handlooms and Dress | Mana Samskruthi Mana Chenatha",
    template: "%s | RN Saree Handlooms",
  },
  description:
    "Ultra luxury handloom sarees — Banarasi, Kanjeevaram, Soft Silk & Bridal collections. Mana Samskruthi Mana Chenatha. Cash on Delivery.",
  keywords: [
    "luxury saree",
    "handloom",
    "kanjeevaram",
    "banarasi",
    "RN Saree",
    "Telugu saree",
    "bridal silk",
  ],
  openGraph: {
    title: "RN Saree Handlooms and Dress",
    description: "Mana Samskruthi Mana Chenatha — Ultra luxury Indian handloom fashion house.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4a0e1f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${tiro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <Providers>
          <SiteShell>{children}</SiteShell>
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              style: {
                background: "#2d0812",
                border: "1px solid rgba(201,169,98,0.4)",
                color: "#e8d5a3",
                fontFamily: "var(--font-outfit)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
