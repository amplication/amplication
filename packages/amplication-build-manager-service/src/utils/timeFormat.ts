export function timeFormatYearMonthDay(date: Date) {
  return date.toISOString().split('T')[0];
}
