import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import fg from "fast-glob";
import {
  POSTS_DIRECTORY,
  INDEX_MDX,
  COVER_FILE_PREFIX,
} from "@/constants/content";
import { POSTS_PATH_PREFIX } from "@/constants/paths";

export interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  category?: string;
  cover?: string;
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
  content: string;
  title: string;
  date: string;
  description?: string;
  category?: string;
  thumbnail?: string;
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const entries = await fg(`*/${INDEX_MDX}`, {
      cwd: POSTS_DIRECTORY,
      absolute: false,
    });
    const regex = new RegExp(`/${INDEX_MDX.replace(".", "\\.")}$`);
    return entries.map((entry) => entry.replace(regex, ""));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const indexPath = join(POSTS_DIRECTORY, slug, INDEX_MDX);
    const fileContents = readFileSync(indexPath, "utf8");
    const { data, content } = matter(fileContents);

    const meta = data as PostMetadata;
    const slugDir = join(POSTS_DIRECTORY, slug);
    const coverFile = existsSync(slugDir)
      ? readdirSync(slugDir).find((f) => f.startsWith(COVER_FILE_PREFIX))
      : null;
    const thumbnail = coverFile
      ? `${POSTS_PATH_PREFIX}/${slug}/${coverFile}`
      : meta.cover;

    return {
      slug,
      metadata: meta,
      content,
      title: meta.title || "",
      date: meta.date || "",
      description: meta.description,
      category: meta.category,
      thumbnail: thumbnail || undefined,
    };
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<Post[]> {
  const slugs = await getPostSlugs();
  const postsOrNull = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug)),
  );

  const posts = postsOrNull.filter(isPost).sort(sortByNewestFirst);

  return posts;
}

function isPost(post: Post | null): post is Post {
  return post !== null;
}

function sortByNewestFirst(a: Post, b: Post): number {
  if (a.date === b.date) return 0;
  return a.date < b.date ? 1 : -1;
}
