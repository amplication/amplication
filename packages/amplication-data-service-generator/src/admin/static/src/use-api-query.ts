import { useQuery, QueryResult, TypedQueryFunctionArgs } from "react-query";
import { getHeaders } from "./api.util";

export function useAPIQuery<T, TArgs extends TypedQueryFunctionArgs>(
  key: string,
  input: RequestInfo | ((...args: TArgs) => RequestInfo),
  init?: RequestInit
): QueryResult<T, Error> {
  return useQuery<T, Error, TArgs>(key, async (...args) => {
    const headers = getHeaders(init?.headers);
    if (typeof input === "function") {
      input = input(...args);
    }
    const res = await fetch(input, { ...init, headers });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  });
}
