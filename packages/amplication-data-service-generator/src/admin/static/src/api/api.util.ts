import { getCredentials } from "../auth";
import { createBasicAuthorizationHeader } from "./http.util";

export function getHeaders(
  init?: Headers | string[][] | Record<string, string> | undefined
) {
  const headers = new Headers(init);
  const credentials = getCredentials();
  if (credentials) {
    headers.append(
      "Authorization",
      createBasicAuthorizationHeader(credentials.username, credentials.password)
    );
  }
  return headers;
}
