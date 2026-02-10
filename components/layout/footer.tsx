import { GithubIcon, MailIcon } from "@/components/icons";
import {
  AUTHOR_NAME,
  AUTHOR_EMAIL,
  GITHUB_URL,
} from "@/constants/site";
import { MESSAGES } from "@/constants/messages";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-5xl mx-auto px-6 sm:px-4 py-4">
        <div className="flex sm:flex-row flex-col gap-2 items-center justify-between text-neutral-500 dark:text-neutral-400">
          <p className="text-sm tracking-tight">
            &copy; {currentYear} {AUTHOR_NAME}. {MESSAGES.FOOTER_RIGHTS}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              <GithubIcon size={20} className="text-current" />
            </a>
            <a
              href={`mailto:${AUTHOR_EMAIL}`}
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              <MailIcon size={20} className="text-current" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
