export const TRUNCATED_NAME_LENGTH = 20;

export function truncateName(name: string): string {
  if (name.length > TRUNCATED_NAME_LENGTH) {
    return `${name.slice(0, TRUNCATED_NAME_LENGTH)}...`;
  }
  return name;
}
