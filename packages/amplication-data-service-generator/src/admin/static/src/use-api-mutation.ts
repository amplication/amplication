import { useMutation, MutationResultPair, MutationConfig } from "react-query";
import { getHeaders } from "./api.util";

export function useAPIMutation<TResult, TVariables>(
  path: string,
  config?: MutationConfig<TResult, Error, TVariables>
): MutationResultPair<TResult, Error, TVariables, unknown> {
  return useMutation<TResult, Error, TVariables>(async (variables) => {
    const headers = getHeaders();
    headers.append("Content-Type", "application/json");
    return fetch(path, {
      method: "POST",
      body: JSON.stringify(variables),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json();
    });
  }, config);
}
