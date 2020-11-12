import { useState, useEffect } from "react";
import { getCredentials } from "./auth";
import { createBasicAuthorizationHeader } from "./http.util";

export function useAPI<T>(
  path: string,
  init?: RequestInit
): [T | null, Error | null] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const headers = new Headers(init?.headers);
    const credentials = getCredentials();
    if (credentials) {
      headers.append(
        "Authorization",
        createBasicAuthorizationHeader(
          credentials.username,
          credentials.password
        )
      );
    }
    fetch(path, { ...init, headers })
      .then((res) => res.json())
      .then(setData)
      .catch(setError);
  }, [setData, setError]);

  return [data, error];
}
