import * as React from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import { useAPIQuery } from "./use-api-query";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const RESOURCE: string;
declare const CELLS: React.ReactNode[];
declare interface ENTITY_TYPE {
  id: string;
}

type ENTITY = ENTITY_TYPE;
type Data = ENTITY[];

export const ENTITY_LIST = () => {
  const { data, error } = useAPIQuery<Data>(`list-${RESOURCE}`, `/${RESOURCE}`);
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
