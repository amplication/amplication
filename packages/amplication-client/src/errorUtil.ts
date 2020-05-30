import { ApolloError } from "apollo-boost";

export function formatError(
  error: ApolloError | undefined
): string | undefined {
  if (error === undefined) {
    return undefined;
  }
  return String(error);
}
