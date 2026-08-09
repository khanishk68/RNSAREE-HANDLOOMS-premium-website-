"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore, type AdminBanner } from "@/lib/admin-store";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminModal,
  AdminPageHeader,
} from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";

const empty = (): Omit<AdminBanner, "id"> => ({
  title: "",
  subtitle: "",
  image: "",
  link: "",
  order: 0,
  active: true,
});

export default function AdminBannersPage() {
  const banners = useAdminStore((s) => s.banners);
  const updateBanner = useAdminStore((s) => s.updateBanner);
  const addBanner = useAdminStore((s) => s.addBanner);
  const deleteBanner = useAdminStore((s) => s.deleteBanner);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty());

  const sorted = [...banners].sort((a, b) => a.order - b.order);

  function openCreate() {
    setEditingId(null);
    setForm({ ...empty(), order: banners.length });
    setOpen(true);
  }

  function openEdit(b: AdminBanner) {
    setEditingId(b.id);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      link: b.link || "",
      order: b.order,
      active: b.active,
    });
    setOpen(true);
  }

  function save() {
    if (!form.title.trim() || !form.image.trim()) {
      toast.error("Title and image are required");
      return;
    }
    if (editingId) {
      updateBanner(editingId, form);
      toast.success("Banner updated");
    } else {
      addBanner(form);
      toast.success("Banner added");
    }
    setOpen(false);
  }

  function remove(id: string) {
    if (!confirm("Delete this banner?")) return;
    deleteBanner(id);
    toast.success("Banner deleted");
  }

  return (
    <div>
      <AdminPageHeader
        title="Banners"
        description="Homepage hero slides — title, subtitle, and imagery."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add banner
          </AdminButton>
        }
      />

      <div className="space-y-4">
        {sorted.map((b) => (
          <AdminCard key={b.id} className="overflow-hidden p-0">
            <div className="grid md:grid-cols-[240px_1fr]">
              <div className="relative h-40 bg-white/5 md:h-auto md:min-h-[140px]">
                {b.image && (
                  <Image
                    src={b.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="240px"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl text-[#e8d5a3]">
                      {b.title}
                    </h3>
                    <span
                      className={
                        b.active
                          ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase text-emerald-200"
                          : "rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-white/40"
                      }
                    >
                      {b.active ? "Active" : "Hidden"}
                    </span>
                    <span className="text-xs text-white/30">
                      Order {b.order}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/50">{b.subtitle}</p>
                </div>
                <div className="mt-4 flex gap-1">
                  <AdminButton
                    variant="ghost"
                    className="px-2"
                    onClick={() => openEdit(b)}
                  >
                    <Pencil className="h-4 w-4" />
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    className="px-2 text-red-300/80"
                    onClick={() => remove(b.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    className="ml-auto text-xs"
                    onClick={() => {
                      updateBanner(b.id, { active: !b.active });
                      toast.success(b.active ? "Banner hidden" : "Banner active");
                    }}
                  >
                    {b.active ? "Hide" : "Show"}
                  </AdminButton>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit banner" : "Add banner"}
      >
        <div className="space-y-4">
          <AdminInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <AdminInput
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, subtitle: e.target.value }))
            }
          />
          <ImageUploader
            label="Banner image"
            value={form.image}
            onChange={(image) => setForm((f) => ({ ...f, image }))}
          />
          <AdminInput
            label="Link (optional)"
            value={form.link || ""}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
          <AdminInput
            label="Order"
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
            }
          />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
              className="accent-[#c9a962]"
            />
            Active on homepage
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </AdminButton>
          <AdminButton onClick={save}>Save</AdminButton>
        </div>
      </AdminModal>
    </div>
  );
}
