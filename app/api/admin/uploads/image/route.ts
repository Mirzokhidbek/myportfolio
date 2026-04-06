import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function getCloudinaryConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "blog";

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return { cloud_name, api_key, api_secret, folder };
}

/** Keep uploads inside the configured folder, e.g. "blog" or "blog/covers". */
function resolveFolder(requested: string, base: string) {
  const folder = requested.trim().replace(/^\/+|\/+$/g, "");
  const safe = /^[a-zA-Z0-9_\-/]+$/.test(folder) && !folder.includes("..");
  if (safe && (folder === base || folder.startsWith(`${base}/`))) return folder;
  return base;
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("image");
    const baseFolder = getCloudinaryConfig().folder;
    const targetFolder = resolveFolder(String(formData.get("folder") ?? baseFolder), baseFolder);

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing image file." },
        { status: 400 }
      );
    }
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Only image files can be uploaded." },
        { status: 400 }
      );
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Image must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const { cloud_name, api_key, api_secret } = getCloudinaryConfig();
    cloudinary.v2.config({ cloud_name, api_key, api_secret });

    const bytes = Buffer.from(await image.arrayBuffer());
    const base64 = bytes.toString("base64");
    const dataUri = `data:${image.type};base64,${base64}`;

    const result = await cloudinary.v2.uploader.upload(dataUri, {
      folder: targetFolder,
      resource_type: "image",
    });

    return NextResponse.json({ ok: true, url: result.secure_url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

