"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin-store";
import type { Category } from "@/lib/data";
import { slugify } from "@/lib/utils";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminModal,
  AdminPageHeader,
  AdminTextarea,
} from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";

const empty = (): Omit<Category, "id"> => ({
  name: "",
  slug: "",
  description: "",
  banner: "",
});

export default function AdminCategoriesPage() {
  const categories = useAdminStore((s) => s.categories);
  const addCategory = useAdminStore((s) => s.addCategory);
  const updateCategory = useAdminStore((s) => s.updateCategory);
  const deleteCategory = useAdminStore((s) => s.deleteCategory);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty());

  function openCreate() {
    setEditingId(null);
    setForm(empty());
    setOpen(true);
  }

  function openEdit(c: Category) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description,
      banner: c.banner,
    });
    setOpen(true);
  }

  function save() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };
    if (editingId) {
      updateCategory(editingId, payload);
      toast.success("Category updated");
    } else {
      addCategory(payload);
      toast.success("Category added");
    }
    setOpen(false);
  }

  function remove(id: string, name: string) {
    if (!confirm(`Delete category “${name}”?`)) return;
    deleteCategory(id);
    toast.success("Category deleted");
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Organise collections shown across the storefront."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add category
          </AdminButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <AdminCard key={c.id} className="overflow-hidden p-0">
            <div className="relative h-32 bg-white/5">
              {c.banner && (
                <Image
                  src={c.banner}
                  alt=""
                  fill
                  className="object-cover opacity-80"
                  sizes="400px"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-serif text-lg text-[#e8d5a3]">{c.name}</h3>
                <p className="text-xs text-white/40">/{c.slug}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-sm text-white/50">
                {c.description}
              </p>
              <div className="mt-3 flex gap-1">
                <AdminButton
                  variant="ghost"
                  className="px-2"
                  onClick={() => openEdit(c)}
                >
                  <Pencil className="h-4 w-4" />
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  className="px-2 text-red-300/80"
                  onClick={() => remove(c.id, c.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit category" : "Add category"}
      >
        <div className="space-y-4">
          <AdminInput
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: f.slug || slugify(e.target.value),
              }))
            }
          />
          <AdminInput
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <AdminTextarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <ImageUploader
            label="Banner image"
            value={form.banner}
            onChange={(banner) => setForm((f) => ({ ...f, banner }))}
          />
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
