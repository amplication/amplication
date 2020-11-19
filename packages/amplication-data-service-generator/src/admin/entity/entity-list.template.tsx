import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
// @ts-ignore
import { api } from "./api";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const RESOURCE: string;
declare const CELLS: React.ReactNode[];
declare interface ENTITY_TYPE {
  id: string;
}

type ENTITY = ENTITY_TYPE;
type Data = ENTITY[];

export const ENTITY_LIST = () => {
  const { data, error } = useQuery<Data>(`list-${RESOURCE}`, async () => {
    const response = await api.get(`/${RESOURCE}`);
    return response.data;
  });
  return (
    <>
      <h1>{ENTITY_PLURAL_DISPLAY_NAME}</h1>
      <Link to={`/${RESOURCE}/new`}>
        <button>Create</button>
      </Link>
      <h2>Items</h2>
      <table>
        <tr>
          <th>id</th>
        </tr>
        {data &&
          data.map((item: ENTITY) => (
            <tr>
              <td>{item.id}</td>
              {CELLS}
              <Link to={`/${RESOURCE}/${item.id}`}>
                <button>Update</button>
              </Link>
            </tr>
          ))}
      </table>
      <h2>Error</h2>
      {error && error.toString()}
    </>
  );
};
