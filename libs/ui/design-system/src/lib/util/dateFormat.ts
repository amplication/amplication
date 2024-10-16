import { format } from "date-fns";

const DATE_FORMAT = "PP p";

export function formatDateAndTime(date: Date, defaultText = "Never"): string {
  return date ? format(date, DATE_FORMAT) : defaultText;
}
