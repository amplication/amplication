import { ApolloError } from "@apollo/client";
import { AxiosError } from "axios";

export function formatError(
  error: Error | undefined | null
): string | undefined {
  if (error === undefined || error === null) {
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

  if (error instanceof AxiosError) {
    return (error as AxiosError).message;
  }
  return String(error);
}
