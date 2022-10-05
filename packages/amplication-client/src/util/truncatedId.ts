const TRUNCATED_ID_LENGTH = 8;

export function truncateId(id: string): string {
  return id.slice(id.length - TRUNCATED_ID_LENGTH);
}
