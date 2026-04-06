import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPostBySlug,
  getPostSlugs,
  getAdjacentPosts,
  type Post,
} from "@/lib/posts";
import { formatDateShort } from "@/lib/utils";
import { renderMarkdown } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-content";
import { PostJsonLd } from "@/components/post-json-ld";
import {
  AUTHOR_NAME,
  DEFAULT_CATEGORY,
  SITE_URL,
  SITE_DESCRIPTION,
} from "@/constants/site";

async function getPostOrNotFound(slug: string): Promise<Post> {
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return post;
}

function buildPostMetadata(post: Post): Metadata {
  const description = post.description ?? `${post.title} - ${SITE_DESCRIPTION}`;
  let ogImage: string | undefined;
  if (post.thumbnail) {
    ogImage = post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${SITE_URL}${post.thumbnail}`;
  }

  const postUrl = `${SITE_URL}/posts/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      authors: [AUTHOR_NAME],
      section: post.category ?? DEFAULT_CATEGORY,
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostOrNotFound(slug);
  return buildPostMetadata(post);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostOrNotFound(slug);
  const [htmlContent, { prev, next }] = await Promise.all([
    renderMarkdown(post.content, slug),
    getAdjacentPosts(slug),
  ]);

  return (
    <>
      <PostJsonLd post={post} />
      <header className="border-b border-neutral-200 dark:border-neutral-800 sm:py-10 py-6 flex flex-col items-center gap-6 sm:gap-10">
        {post.thumbnail && (
          <div className="w-full overflow-hidden sm:max-w-2xl sm:mx-auto sm:rounded-xl">
            <div className="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42rem"
                priority
              />
            </div>
          </div>
        )}
        <div className="max-w-2xl mx-auto px-4 sm:px-0 flex flex-col items-center sm:gap-6 gap-4">
          <h1 className="sm:text-4xl text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <p className="tracking-wide">{post.category ?? DEFAULT_CATEGORY}</p>
            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <p>{formatDateShort(post.date)}</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <article className="prose-article">
          <MDXContent>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </MDXContent>
        </article>
        <nav className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/posts/${prev.slug}`}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                ← 이전 글
              </span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors line-clamp-2">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex flex-col gap-1 text-left opacity-30 select-none">
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                ← 이전 글
              </span>
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-600">
                이전 글이 없습니다
              </span>
            </div>
          )}
          {next ? (
            <Link
              href={`/posts/${next.slug}`}
              className="group flex flex-col gap-1 text-right ml-auto"
            >
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                다음 글 →
              </span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors line-clamp-2">
                {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex flex-col gap-1 text-right ml-auto opacity-30 select-none">
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                다음 글 →
              </span>
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-600">
                다음 글이 없습니다
              </span>
            </div>
          )}
        </nav>
      </main>
    </>
  );
}
