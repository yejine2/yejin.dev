import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
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

export async function renderMarkdown(
  source: string,
  slug?: string,
): Promise<string> {
  try {
    const html = String(
      await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkBreaks)
        .use(remarkImagePath, { slug })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(source),
    );
    return html;
  } catch (error) {
    console.error("Markdown 렌더링 오류:", error);
    return "<p>포스트를 로드하는 중 오류가 발생했습니다.</p>";
  }
}
