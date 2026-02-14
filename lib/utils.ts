import { DATE_LOCALE } from "@/constants/date";

export function formatDateShort(dateString: string): string {
  if (!dateString) return "";

  return new Intl.DateTimeFormat(DATE_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}
