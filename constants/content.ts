import { join } from "path";

export const CONTENT_DIR = "content";
export const POSTS_DIR = "posts";
export const INDEX_MDX = "index.mdx";
export const COVER_FILE_PREFIX = "cover.";

export const POSTS_DIRECTORY = join(process.cwd(), CONTENT_DIR, POSTS_DIR);

export const ALLOWED_IMAGE_EXT = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
] as const;

export const MIME_TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
