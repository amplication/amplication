import { ApolloError } from "@apollo/client";

export function formatError(error: Error | undefined): string | undefined {
  if (error === undefined) {
    return undefined;
  }
  if ((error as ApolloError).graphQLErrors) {
    // show the first error
    /**@todo: return multiple errors */
    const [gqlError] = (error as ApolloError).graphQLErrors;
    if (gqlError && gqlError.message) {
      return gqlError.message;
    }
  }
  return String(error);
}
