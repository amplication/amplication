export function pluralize(count = 0, singular: string, plural: string): string {
  return count > 1 || count === 0 ? plural : singular;
}
