import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function enumerateDateStrings(startDate: string, endDate: string) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const diff = differenceInCalendarDays(end, start);

  if (diff < 0) {
    return [];
  }

  return Array.from({ length: diff + 1 }, (_, index) => format(addDays(start, index), "yyyy-MM-dd"));
}

export function formatKoreanDate(date: string) {
  return format(parseISO(date), "M월 d일 EEEE", { locale: ko });
}

export function getShortWeekday(date: string) {
  return format(parseISO(date), "EEE", { locale: ko });
}

export function isDateWithinRange(date: string, startDate: string, endDate: string) {
  return date >= startDate && date <= endDate;
}
