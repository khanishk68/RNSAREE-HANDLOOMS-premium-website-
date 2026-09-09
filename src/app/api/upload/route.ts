import { mkdir, writeFile } from "fs/promises";
import { createHash } from "crypto";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024;
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

function cloudinaryConfig() {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      return {
        cloudName: parsed.hostname,
        apiKey: decodeURIComponent(parsed.username),
        apiSecret: decodeURIComponent(parsed.password),
      };
    } catch {
      return null;
    }
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }
  return null;
}

function signParams(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(`${toSign}${apiSecret}`)
    .digest("hex");
}

async function uploadToCloudinary(buffer: Buffer, filename: string) {
  const cfg = cloudinaryConfig();
  if (!cfg) throw new Error("Cloudinary is not configured");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "rn-saree-handlooms";
  const publicId = path.parse(filename).name;
  const params = { folder, public_id: publicId, timestamp };
  const signature = signParams(params, cfg.apiSecret);

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(buffer)]),
    filename
  );
  form.append("api_key", cfg.apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);
  form.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const json = (await res.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message || "Cloudinary upload failed");
  }
  return json.secure_url;
}

export async function POST(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files").filter(Boolean) as File[];
    const single = formData.get("file");
    if (single instanceof File) files.push(single);

    if (!files.length) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const useCloud = Boolean(cloudinaryConfig());
    if (!useCloud && process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Image uploads on Vercel require Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
        { status: 503 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!useCloud) {
      await mkdir(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json(
          {
            error: `Unsupported type: ${file.type || "unknown"}. Use JPG, PNG, WebP, GIF or AVIF.`,
          },
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

      if (useCloud) {
        urls.push(await uploadToCloudinary(buffer, filename));
      } else {
        await writeFile(path.join(uploadDir, filename), buffer);
        urls.push(`/uploads/${filename}`);
      }
    }

    return NextResponse.json({
      url: urls[0],
      urls,
      count: urls.length,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error && err.message.includes("Cloudinary")
            ? err.message
            : "Upload failed",
      },
      { status: 500 }
    );
  }
}
