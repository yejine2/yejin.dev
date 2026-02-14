# yejin.dev

Next.js 기반의 개인 기술 블로그

## 스택

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS, next-themes (다크 모드)
- 포스트: Markdown(frontmatter) + unified/remark/rehype

## 실행

```bash
pnpm install
pnpm dev
```

## 컨벤션

- **파일/폴더명**:
  - 파일명은 kebab-case (post-list.tsx)
  - 컴포넌트는 PascalCase
  - 운영 환경에 따른 대소문자 이슈를 줄이기 위해 파일명은 전반적으로 kebab-case로 통일
- **상수/설정**:
  - `constants/` 에서 경로, 메시지, 사이트 정보 등 관리

## 렌더링 방식

- **콘텐츠 구조**
  - content/posts/{slug}/index.mdx
  - frontmatter는 gray-matter로 파싱
  - 본문은 Markdown 문자열로 관리
- **흐름**:
  - 빌드/요청 시 `getPostBySlug(slug)` 로 Markdown 파일 읽기
  - → unified 파이프라인으로 HTML 문자열 생성
  - → 서버에서 HTML 생성 후 클라이언트에는 `dangerouslySetInnerHTML` 로 전달

   ```
  마크다운 문자열
    → remark-parse (mdast)
    → remark-gfm (GFM 확장)
    → remarkImagePath (상대 경로 이미지 → /posts/{slug}/...)
    → remark-rehype (hast, allowDangerousHtml)
    → rehype-raw (raw HTML 노드 해석)
    → rehype-highlight (코드 하이라이트)
    → rehype-stringify (HTML 문자열)
    → 최종 HTML
  ```
- **이미지**:
  - 본문 내 상대 경로(`./xxx.png`)는 remark 단계에서 `/posts/{slug}/xxx.png` 로 변환
  - 실제 파일은 `app/posts/[slug]/[file]/route.ts`(GET)에서 읽어 응답
  - 각 포스트 폴더의 `cover.*` 파일은 썸네일로 자동 사용

## 추가 메모

- **렌더링 전략**: MDX 컴포넌트를 런타임에서 직접 렌더링하지 않고, 빌드/요청 시 HTML 문자열로 변환하여 런타임 복잡도와 hydration 비용을 최소화
- **보안**: 개인 블로그 용도이며 콘텐츠 소스가 제한적이기 때문에 `dangerouslySetInnerHTML` 사용 (필요 시 `rehype-sanitize` 로 sanitize 단계 추가 가능)

## 구조 요약

- `app/` — 라우트, 레이아웃, 페이지 (App Router)
- `components/` — UI 컴포넌트 (layout, posts, icons 등)
- `content/posts/` — Post 소스 (폴더 단위 관리)
- `lib/` — 도메인 로직 (posts 조회, mdx 파이프라인)
- `constants/` — 전역 설정 및 고정 값
