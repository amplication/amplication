export function formatError(error: Error | undefined): string | undefined {
  if (error === undefined) {
    return undefined;
  }
  return String(error);
}
