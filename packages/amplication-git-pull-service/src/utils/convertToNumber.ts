import { AmplicationError } from "../errors/AmplicationError";

export const convertToNumber = (value: string): number => {
  const result = parseInt(value);
  if (isNaN(result)) {
    throw new AmplicationError(
      'GitHub App installation identifier is invalid'
    );
  }
  return result;
}