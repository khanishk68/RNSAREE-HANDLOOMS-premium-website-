import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function safeName(original: string) {
  const ext = path.extname(original).toLowerCase() || ".jpg";
  const base = path
    .basename(original, path.extname(original))
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  return `${Date.now()}-${base || "image"}${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files").filter(Boolean) as File[];
    const single = formData.get("file");
    if (single instanceof File) files.push(single);

    if (!files.length) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json(
          { error: `Unsupported type: ${file.type || "unknown"}. Use JPG, PNG, WebP, GIF or AVIF.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `${file.name} is too large. Max 8 MB per image.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = safeName(file.name);
      await writeFile(path.join(uploadDir, filename), buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({
      url: urls[0],
      urls,
      count: urls.length,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
