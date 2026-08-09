"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin-store";
import type { Product } from "@/lib/data";
import { formatINR, slugify } from "@/lib/utils";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminModal,
  AdminPageHeader,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/ui";
import { MultiImageUploader } from "@/components/admin/image-uploader";

const emptyForm = (): Omit<Product, "id"> => ({
  name: "",
  slug: "",
  price: 0,
  compareAt: undefined,
  category: "silk",
  fabric: "",
  color: "",
  occasion: "Wedding",
  description: "",
  story: "",
  care: ["Dry clean only"],
  images: [""],
  tags: [],
  stock: 1,
  featured: false,
  bestSeller: false,
  limited: false,
  isNew: true,
});

export default function AdminProductsPage() {
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const addProduct = useAdminStore((s) => s.addProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    );
  }, [products, query]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAt: p.compareAt,
      category: p.category,
      fabric: p.fabric,
      color: p.color,
      occasion: p.occasion,
      description: p.description,
      story: p.story,
      care: p.care.length ? p.care : ["Dry clean only"],
      images: p.images.length ? p.images : [""],
      tags: p.tags,
      stock: p.stock,
      featured: p.featured,
      bestSeller: p.bestSeller,
      limited: p.limited,
      isNew: p.isNew,
    });
    setOpen(true);
  }

  function save() {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      images: form.images.filter((u) => u.trim()),
      care: form.care.filter((c) => c.trim()),
      tags: form.tags,
    };
    if (editingId) {
      updateProduct(editingId, payload);
      toast.success("Product updated");
    } else {
      addProduct(payload);
      toast.success("Product added");
    }
    setOpen(false);
  }

  function remove(id: string, name: string) {
    if (!confirm(`Delete “${name}”?`)) return;
    deleteProduct(id);
    toast.success("Product deleted");
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Catalogue management — add, edit, and remove sarees."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add product
          </AdminButton>
        }
      />

      <AdminCard className="mb-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#c9a962]/50"
          />
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-white/35">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 overflow-hidden rounded bg-white/5">
                        {p.images[0] && (
                          <Image
                            src={p.images[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white/90">
                          {p.name}
                        </p>
                        <p className="truncate text-xs text-white/35">
                          {p.fabric}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-white/60">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-[#e8d5a3]">
                    {formatINR(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.stock < 5
                          ? "text-amber-300"
                          : "text-white/70"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <AdminButton
                        variant="ghost"
                        className="px-2"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        className="px-2 text-red-300/80"
                        onClick={() => remove(p.id, p.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-white/40">
              No products found.
            </p>
          )}
        </div>
      </AdminCard>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit product" : "Add product"}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-2">
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
          <AdminInput
            label="Price (INR)"
            type="number"
            value={form.price || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))
            }
          />
          <AdminInput
            label="Compare at"
            type="number"
            value={form.compareAt ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                compareAt: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              }))
            }
          />
          <AdminSelect
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </AdminSelect>
          <AdminInput
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))
            }
          />
          <AdminInput
            label="Fabric"
            value={form.fabric}
            onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
          />
          <AdminInput
            label="Color"
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          />
          <AdminInput
            label="Occasion"
            value={form.occasion}
            onChange={(e) =>
              setForm((f) => ({ ...f, occasion: e.target.value }))
            }
          />
          <AdminInput
            label="Tags (comma separated)"
            value={form.tags.join(", ")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
          />
          <div className="sm:col-span-2">
            <AdminTextarea
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="sm:col-span-2">
            <AdminTextarea
              label="Story"
              value={form.story}
              onChange={(e) =>
                setForm((f) => ({ ...f, story: e.target.value }))
              }
            />
          </div>
          <div className="sm:col-span-2">
            <MultiImageUploader
              label="Product images"
              values={form.images.length ? form.images : [""]}
              onChange={(images) => setForm((f) => ({ ...f, images }))}
            />
          </div>
          <div className="sm:col-span-2">
            <AdminTextarea
              label="Care (one per line)"
              value={form.care.join("\n")}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  care: e.target.value.split("\n").filter(Boolean),
                }))
              }
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-4 text-sm text-white/70">
            {(
              [
                ["featured", "Featured"],
                ["bestSeller", "Best seller"],
                ["limited", "Limited"],
                ["isNew", "New"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.checked }))
                  }
                  className="accent-[#c9a962]"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </AdminButton>
          <AdminButton onClick={save}>
            {editingId ? "Save changes" : "Create product"}
          </AdminButton>
        </div>
      </AdminModal>
    </div>
  );
}
