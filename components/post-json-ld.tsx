import { AUTHOR_NAME, SITE_URL, SITE_NAME } from "@/constants/site";
import type { Post } from "@/lib/posts";

export function PostJsonLd({ post }: { post: Post }) {
  const url = `${SITE_URL}/posts/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? "",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(post.thumbnail && {
      image: post.thumbnail.startsWith("http")
        ? post.thumbnail
        : `${SITE_URL}${post.thumbnail}`,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
