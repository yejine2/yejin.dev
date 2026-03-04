import type { Metadata } from "next";
import Link from "next/link";
import { HOME_PATH } from "@/constants/paths";
import { MESSAGES } from "@/constants/messages";

export const metadata: Metadata = {
  title: MESSAGES.NOT_FOUND_TITLE,
  description: MESSAGES.NOT_FOUND_MESSAGE,
  openGraph: {
    title: MESSAGES.NOT_FOUND_TITLE,
    description: MESSAGES.NOT_FOUND_MESSAGE,
  },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
      <div className="text-center flex flex-col gap-6">
        <h1 className="text-4xl font-bold">{MESSAGES.NOT_FOUND_TITLE}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {MESSAGES.NOT_FOUND_MESSAGE}
        </p>
        <Link
          href={HOME_PATH}
          className="text-neutral-600 dark:text-neutral-300 hover:underline"
        >
          {MESSAGES.NOT_FOUND_LINK}
        </Link>
      </div>
    </div>
  );
}
