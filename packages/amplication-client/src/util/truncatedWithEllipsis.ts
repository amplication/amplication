export const truncateWithEllipsis = (
  input: string | undefined,
  limit: number,
  defaultValue: string
) => {
  if (!input) return defaultValue;
  return input.length > limit ? `${input.substring(0, limit)}...` : input;
};
