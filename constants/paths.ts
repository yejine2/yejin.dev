export const HOME_PATH = "/";
export const POSTS_PATH_PREFIX = "/posts";

export function getPostPath(slug: string): string {
  return `${POSTS_PATH_PREFIX}/${slug}`;
}

export function getPostAssetPath(slug: string, filename: string): string {
  return `${POSTS_PATH_PREFIX}/${slug}/${filename}`;
}
