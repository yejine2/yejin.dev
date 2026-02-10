import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { HOME_PATH } from "@/constants/paths";
import { MESSAGES } from "@/constants/messages";
import { SITE_NAME } from "@/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto p-4">
        <nav className="flex items-center justify-between">
          <Link
            href={HOME_PATH}
            className="flex items-center gap-1 text-lg font-bold text-neutral-900 dark:text-white"
          >
            <Image
              src="/images/logo.png"
              alt={SITE_NAME}
              width={24}
              height={24}
              className="object-contain dark:invert"
            />
            <span className="font-serif text-lg">{MESSAGES.HEADER_BRAND}</span>
            <span className="font-serif italic text-lg">
              {MESSAGES.HEADER_BRAND_SUFFIX}
            </span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
