import { getPosts } from "@/lib/posts";
import { MESSAGES } from "@/constants/messages";
import { PostList } from "@/components/posts/post-list";

export default async function Home() {
  const posts = await getPosts();

  const listItems = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    thumbnail: p.thumbnail,
    description: p.description,
  }));

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-9 flex flex-col gap-4 sm:gap-9">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-bold text-neutral-700 dark:text-neutral-300">
          Posts
        </h1>

        <div>
          {posts.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400">
              {MESSAGES.EMPTY_POSTS}
            </p>
          ) : (
            <PostList posts={listItems} />
          )}
        </div>
      </main>
    </>
  );
}
