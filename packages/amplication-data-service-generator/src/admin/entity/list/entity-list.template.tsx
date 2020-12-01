import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
// @ts-ignore

import { api } from "../api";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const RESOURCE: string;
declare const TITLE_CELLS: React.ReactNode[];
declare const CELLS: React.ReactNode[];
declare interface ENTITY_TYPE {
  id: string;
}

type ENTITY = ENTITY_TYPE;
type Data = ENTITY[];

export const ENTITY_LIST = (): React.ReactNode => {
  const { data, error } = useQuery<Data, Error>(
    `list-${RESOURCE}`,
    async () => {
      const response = await api.get(`/${RESOURCE}`);
      return response.data;
    }
  );
  return (
    <>
      <h1>{ENTITY_PLURAL_DISPLAY_NAME}</h1>
      <Link to={`/${RESOURCE}/new`}>
        <button>Create</button>
      </Link>
      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            {TITLE_CELLS}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item: ENTITY) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/${RESOURCE}/${item.id}`}>{item.id}</Link>
                </td>
                {CELLS}
              </tr>
            ))}
        </tbody>
      </table>
      <h2>Error</h2>
      {error && error.toString()}
    </>
  );
};
