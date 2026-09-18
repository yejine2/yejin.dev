"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlignRight, X } from "lucide-react";
import { useActiveHeadingId } from "@/components/posts/use-active-heading-id";
import { HEADER_TOC_SLOT_ID } from "@/constants/dom";
import { MESSAGES } from "@/constants/messages";
import type { TocItem } from "@/lib/mdx";

const ICON_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

const LINK_CLASS = "block text-sm leading-relaxed transition-colors";

function unlockScroll() {
  document.documentElement.style.overflow = "";
}

function useHeaderSlot(): HTMLElement | null {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById(HEADER_TOC_SLOT_ID));
  }, []);

  return slot;
}

interface TocLinksProps {
  items: TocItem[];
  activeId: string | null;
  rail?: boolean;
  onNavigate?: () => void;
  className?: string;
}

function TocLinks({
  items,
  activeId,
  rail = false,
  onNavigate,
  className,
}: TocLinksProps) {
  return (
    <ol className={className}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const railClassName = `border-l-2 ${
          isActive
            ? "border-neutral-900 dark:border-neutral-100"
            : "border-neutral-200 dark:border-neutral-800"
        }`;
        const linkClassName = `${LINK_CLASS} ${
          isActive
            ? "text-neutral-900 dark:text-neutral-100"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        }`;

        return (
          <li key={item.id} className={rail ? railClassName : undefined}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={linkClassName}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function PostToc({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeadingId(items);
  const slot = useHeaderSlot();
  const sheetRef = useRef<HTMLDialogElement>(null);

  useEffect(() => unlockScroll, []);

  const openSheet = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.showModal();
    if (sheet.open) document.documentElement.style.overflow = "hidden";
  };
  const closeSheet = () => sheetRef.current?.close();

  if (items.length === 0) return null;

  return (
    <>
      {slot !== null &&
        createPortal(
          <button
            type="button"
            onClick={openSheet}
            aria-label={MESSAGES.TOC_OPEN}
            className={`${ICON_BUTTON_CLASS} h-9 w-9 xl:hidden`}
          >
            <AlignRight size={18} />
          </button>,
          slot,
        )}

      <dialog
        ref={sheetRef}
        aria-label={MESSAGES.TOC_TITLE}
        onClose={unlockScroll}
        onClick={(event) => {
          if (event.target === sheetRef.current) closeSheet();
        }}
        className="toc-sheet mx-auto mb-0 mt-auto w-full max-w-none rounded-t-2xl bg-white p-0 dark:bg-neutral-900"
      >
        <div className="flex max-h-[70vh] flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <p className="text-sm font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
              {MESSAGES.TOC_TITLE}
            </p>
            <button
              type="button"
              onClick={closeSheet}
              aria-label={MESSAGES.TOC_CLOSE}
              className={`${ICON_BUTTON_CLASS} h-8 w-8`}
            >
              <X size={16} />
            </button>
          </div>
          <TocLinks
            items={items}
            activeId={activeId}
            onNavigate={closeSheet}
            className="flex flex-col overflow-y-auto px-3 py-3 [&>li>a]:rounded-lg [&>li>a]:px-3 [&>li>a]:py-2.5 [&_a[aria-current]]:bg-neutral-100 dark:[&_a[aria-current]]:bg-neutral-800"
          />
        </div>
      </dialog>

      <div className="absolute bottom-0 top-16 -left-[15.5rem] hidden w-52 xl:block">
        <nav
          aria-label={MESSAGES.TOC_TITLE}
          className="sticky top-32 max-h-[calc(100vh-16rem)] overflow-y-auto"
        >
          <p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 dark:text-neutral-500">
            {MESSAGES.TOC_TITLE}
          </p>
          <TocLinks
            items={items}
            activeId={activeId}
            rail
            className="flex flex-col [&>li>a]:py-1.5 [&>li>a]:pl-4"
          />
        </nav>
      </div>
    </>
  );
}
