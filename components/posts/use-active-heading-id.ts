"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/mdx";

const ACTIVE_LINE_OFFSET = 140;

/** 기준선을 지나간 마지막 헤딩의 id를 반환한다. */
export function useActiveHeadingId(items: TocItem[]): string | null {
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
