"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils";
import { getPostPath } from "@/constants/paths";
import { DEFAULT_CATEGORY } from "@/constants/site";
import { Post } from "@/lib/posts";

type PostListItem = Omit<Post, "content" | "metadata">;

interface PostListProps {
  posts: PostListItem[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={getPostPath(post.slug)}
            className="flex flex-col h-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-300"
          >
            {post.thumbnail ? (
              <div className="relative w-full aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-neutral-100 dark:bg-neutral-800 shrink-0" />
            )}
            <div className="flex flex-col gap-2 p-4 tracking-tight">
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{post.category ?? DEFAULT_CATEGORY}</span>
                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="tabular-nums">
                  {formatDateShort(post.date)}
                </span>
              </div>
              <h2 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 line-clamp-2">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
