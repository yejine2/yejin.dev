import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { getPostAssetPath } from "@/constants/paths";

interface MdastNode {
  type?: string;
  url?: string;
  children?: MdastNode[];
}

/** remark 플러그인: 상대 경로 이미지 URL을 /posts/{slug}/... 로 변환 */
function remarkImagePath(options: { slug?: string }) {
  const slug = options?.slug;
  return (tree: MdastNode) => {
    if (!slug) return;
    const slugValue = slug;
    visitImageNodes(tree);
    function visitImageNodes(node: MdastNode) {
      if (node.type === "image" && typeof node.url === "string") {
        const url = node.url;
        if (
          !url.startsWith("http") &&
          !url.startsWith("//") &&
          !url.startsWith("/")
        ) {
          node.url = getPostAssetPath(slugValue, url.replace(/^\.\//, ""));
        }
        return;
      }
      if (node.children) {
        for (const child of node.children) visitImageNodes(child);
      }
    }
  };
}

export interface TocItem {
  id: string;
  text: string;
}

interface HastNode {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: { id?: string };
  children?: HastNode[];
}

function rehypeCollectToc(options: { toc: TocItem[] }) {
  return (tree: HastNode) => {
    for (const node of tree.children ?? []) {
      if (node.tagName !== "h2") continue;
      const id = node.properties?.id;
      if (!id) continue;
      options.toc.push({ id, text: toPlainText(node) });
    }
  };
}

function toPlainText(node: HastNode): string {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(toPlainText).join("");
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
}

export async function renderMarkdown(
  source: string,
  slug?: string,
): Promise<RenderedMarkdown> {
  const toc: TocItem[] = [];
  try {
    const html = String(
      await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkBreaks)
        .use(remarkImagePath, { slug })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypeCollectToc, { toc })
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(source),
    );
    return { html, toc };
  } catch (error) {
    console.error("Markdown 렌더링 오류:", error);
    return {
      html: "<p>포스트를 로드하는 중 오류가 발생했습니다.</p>",
      toc: [],
    };
  }
}
