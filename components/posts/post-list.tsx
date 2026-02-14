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
    <ul className="flex flex-col gap-5 sm:gap-4">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={getPostPath(post.slug)}
            className="flex flex-col items-center sm:flex-row gap-4 sm:gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-900 sm:p-4 rounded-2xl transition-colors duration-300"
          >
            {post.thumbnail && (
              <div className="relative w-full sm:w-40 md:w-48 aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 30vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-1 sm:gap-2 tracking-tight">
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{post.category ?? DEFAULT_CATEGORY}</span>
                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="tabular-nums">
                  {formatDateShort(post.date)}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-semibold text-neutral-700 dark:text-neutral-300 line-clamp-1">
                {post.title}
              </h2>
              {post.description && (
                <p className=" text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
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
