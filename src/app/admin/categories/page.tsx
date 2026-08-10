"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
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
  const products = useAdminStore((s) => s.products);
  const addCategory = useAdminStore((s) => s.addCategory);
  const updateCategory = useAdminStore((s) => s.updateCategory);
  const deleteCategory = useAdminStore((s) => s.deleteCategory);

  const productsByCategory = useMemo(() => {
    const map: Record<string, typeof products> = {};
    for (const p of products) {
      const key = p.category || "";
      if (!map[key]) map[key] = [];
      map[key].push(p);
    }
    return map;
  }, [products]);

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
        description="Manage collection pages. Products appear here by the Category you pick when adding them in Products."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add category
          </AdminButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const linked = productsByCategory[c.slug] ?? [];
          return (
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
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#c9a962]/80">
                  {linked.length}{" "}
                  {linked.length === 1 ? "product" : "products"}
                </p>
                {linked.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {linked.slice(0, 4).map((p) => (
                      <li
                        key={p.id}
                        className="truncate text-xs text-white/55"
                        title={p.name}
                      >
                        · {p.name.trim()}
                      </li>
                    ))}
                    {linked.length > 4 && (
                      <li className="text-xs text-white/35">
                        +{linked.length - 4} more
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-white/35">
                    No products yet — assign this category when adding a
                    product.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
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
                  <Link
                    href={`/collections/${c.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View live
                  </Link>
                </div>
              </div>
            </AdminCard>
          );
        })}
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
