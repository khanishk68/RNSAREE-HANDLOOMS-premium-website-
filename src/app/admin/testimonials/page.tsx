"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin-store";
import type { Testimonial } from "@/lib/data";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminModal,
  AdminPageHeader,
  AdminTextarea,
} from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";

const empty = (): Omit<Testimonial, "id"> => ({
  name: "",
  location: "",
  rating: 5,
  text: "",
  image: "",
  saree: "",
});

export default function AdminTestimonialsPage() {
  const testimonials = useAdminStore((s) => s.testimonials);
  const addTestimonial = useAdminStore((s) => s.addTestimonial);
  const deleteTestimonial = useAdminStore((s) => s.deleteTestimonial);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty());

  function save() {
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Name and text are required");
      return;
    }
    addTestimonial(form);
    toast.success("Testimonial added");
    setOpen(false);
    setForm(empty());
  }

  function remove(id: string, name: string) {
    if (!confirm(`Delete testimonial from ${name}?`)) return;
    deleteTestimonial(id);
    toast.success("Deleted");
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Patron voices featured on the homepage."
        action={
          <AdminButton
            onClick={() => {
              setForm(empty());
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add testimonial
          </AdminButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <AdminCard key={t.id}>
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/5">
                {t.image && (
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white/90">{t.name}</p>
                    <p className="text-xs text-white/40">
                      {t.location} · {t.saree}
                    </p>
                  </div>
                  <AdminButton
                    variant="ghost"
                    className="px-2 text-red-300/80"
                    onClick={() => remove(t.id, t.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                </div>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-[#c9a962] text-[#c9a962]"
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  “{t.text}”
                </p>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add testimonial"
      >
        <div className="space-y-4">
          <AdminInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <AdminInput
            label="Location"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
          />
          <AdminInput
            label="Saree purchased"
            value={form.saree}
            onChange={(e) => setForm((f) => ({ ...f, saree: e.target.value }))}
          />
          <ImageUploader
            label="Customer photo"
            value={form.image}
            onChange={(image) => setForm((f) => ({ ...f, image }))}
          />
          <AdminInput
            label="Rating (1–5)"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)),
              }))
            }
          />
          <AdminTextarea
            label="Testimonial"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </AdminButton>
          <AdminButton onClick={save}>Add</AdminButton>
        </div>
      </AdminModal>
    </div>
  );
}
