"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminButton } from "@/components/admin/ui";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
};

async function uploadFiles(files: FileList | File[]) {
  const list = Array.from(files);
  const form = new FormData();
  list.forEach((f) => form.append("files", f));
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.urls as string[];
}

export function ImageUploader({ value, onChange, label = "Image", className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files || !files.length) return;
      setUploading(true);
      try {
        const urls = await uploadFiles(files);
        onChange(urls[0]);
        toast.success("Image uploaded from your PC");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-[0.12em] text-white/40">{label}</span>
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          className="inline-flex items-center gap-1 text-[11px] text-[#c9a962]/80 hover:text-[#c9a962]"
        >
          <Link2 className="h-3 w-3" />
          {showUrl ? "Hide URL" : "Paste URL"}
        </button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed transition",
          dragOver
            ? "border-[#c9a962] bg-[#c9a962]/10"
            : "border-white/15 bg-white/[0.02]",
          value ? "aspect-[4/3]" : "min-h-[140px]"
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              unoptimized={value.startsWith("data:") || value.startsWith("/uploads/")}
              className="object-cover"
              sizes="400px"
            />
            <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity">
              <AdminButton
                variant="outline"
                className="text-xs"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Replace
              </AdminButton>
              <AdminButton
                variant="danger"
                className="text-xs"
                onClick={() => onChange("")}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </AdminButton>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-full min-h-[140px] w-full flex-col items-center justify-center gap-2 px-4 py-8 text-center"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a962]" />
            ) : (
              <ImagePlus className="h-8 w-8 text-[#c9a962]/80" />
            )}
            <span className="text-sm text-white/70">
              {uploading ? "Uploading…" : "Click to choose from PC"}
            </span>
            <span className="text-xs text-white/35">
              or drag & drop · JPG, PNG, WebP · max 8 MB
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {showUrl && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /uploads/…"
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a962]/50"
        />
      )}
    </div>
  );
}

type MultiProps = {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
};

export function MultiImageUploader({
  values,
  onChange,
  label = "Images",
}: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(files);
      const next = [...values.filter(Boolean), ...urls];
      onChange(next.length ? next : [""]);
      toast.success(
        urls.length === 1 ? "Image uploaded" : `${urls.length} images uploaded`
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const updateAt = (i: number, url: string) => {
    const next = [...values];
    next[i] = url;
    onChange(next);
  };

  const removeAt = (i: number) => {
    const next = values.filter((_, j) => j !== i);
    onChange(next.length ? next : [""]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-[0.12em] text-white/40">{label}</span>
        <div className="flex gap-2">
          <AdminButton
            variant="outline"
            className="text-xs"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload from PC
          </AdminButton>
          <AdminButton
            variant="ghost"
            className="text-xs"
            onClick={() => onChange([...values, ""])}
          >
            <Link2 className="h-3.5 w-3.5" />
            Add URL slot
          </AdminButton>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {values.map((url, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-white/10 p-2">
            <ImageUploader
              label={`Image ${i + 1}`}
              value={url}
              onChange={(u) => updateAt(i, u)}
            />
            {values.length > 1 && (
              <AdminButton
                variant="ghost"
                className="w-full text-xs text-red-300/80"
                onClick={() => removeAt(i)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove slot
              </AdminButton>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-white/35">
        Select one or many files from your computer. You can also paste an image URL in each slot.
      </p>
    </div>
  );
}
