import { useQuery, QueryResult } from "react-query";
import { getHeaders } from "./api.util";

export function useAPIQuery<T>(
  key: string,
  path: string,
  init?: RequestInit
): QueryResult<T, Error> {
  return useQuery<T, Error>(key, async () => {
    const headers = getHeaders(init?.headers);
    const res = await fetch(path, { ...init, headers });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  });
}
