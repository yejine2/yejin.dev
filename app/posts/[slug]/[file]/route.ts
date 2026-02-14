import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { NextRequest } from "next/server";
import {
  POSTS_DIRECTORY,
  ALLOWED_IMAGE_EXT,
  MIME_TYPES,
} from "@/constants/content";

const NOT_FOUND = new Response("Not Found", { status: 404 });

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; file: string }> },
) {
  const { slug, file } = await params;

  if (!slug || !file || file.includes("..") || file.includes("/")) {
    return NOT_FOUND;
  }

  const ext = file.includes(".")
    ? `.${file.split(".").pop()?.toLowerCase()}`
    : "";
  if (!(ALLOWED_IMAGE_EXT as readonly string[]).includes(ext)) {
    return NOT_FOUND;
  }

  const filePath = join(POSTS_DIRECTORY, slug, file);
  if (!existsSync(filePath)) {
    return NOT_FOUND;
  }

  const body = readFileSync(filePath);
  const contentType = MIME_TYPES[ext];

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
