"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Cross2Icon, ListBulletIcon } from "@radix-ui/react-icons";
import { HEADER_TOC_SLOT_ID } from "@/constants/dom";
import { MESSAGES } from "@/constants/messages";
import type { TocItem } from "@/lib/mdx";

const ACTIVE_LINE_OFFSET = 140;

function unlockScroll() {
  document.documentElement.style.overflow = "";
}

interface PostTocProps {
  items: TocItem[];
}

function useActiveHeadingId(items: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = items.map((item) => item.id).join("\n");

  useEffect(() => {
    const headings = idsKey
      .split("\n")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const update = () => {
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > ACTIVE_LINE_OFFSET) break;
        current = heading.id;
      }
      setActiveId(current);
    };

    let frame = 0;
    const schedule = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [idsKey]);

  return activeId;
}

function useHeaderSlot(): HTMLElement | null {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById(HEADER_TOC_SLOT_ID));
  }, []);

  return slot;
}

function TocLinks({
  items,
  activeId,
  rail = false,
  onNavigate,
  className,
}: PostTocProps & {
  activeId: string | null;
  rail?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ol className={className}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const railClassName = isActive
          ? "border-l-2 border-neutral-900 dark:border-neutral-100"
          : "border-l-2 border-neutral-200 dark:border-neutral-800";

        return (
          <li key={item.id} className={rail ? railClassName : undefined}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={
                isActive
                  ? "block text-sm leading-relaxed text-neutral-900 transition-colors dark:text-neutral-100"
                  : "block text-sm leading-relaxed text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function PostToc({ items }: PostTocProps) {
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 xl:hidden"
          >
            <ListBulletIcon width={18} height={18} />
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <Cross2Icon width={16} height={16} />
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
