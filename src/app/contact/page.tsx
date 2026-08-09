import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact RN Saree Handlooms in Nellore, Andhra Pradesh — store timings, WhatsApp, and concierge enquiry.",
};

export default function ContactPage() {
  return <ContactClient />;
}
