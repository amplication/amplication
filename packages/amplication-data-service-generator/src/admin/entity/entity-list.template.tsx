import React, { useEffect, useState, ReactNode } from "react";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const RESOURCE: string;
declare const CELLS: ReactNode[];
declare interface ENTITY_TYPE {
  id: string;
}

type Data = ENTITY_TYPE[];

export const ENTITY_LIST = () => {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch(`/${RESOURCE}`)
      .then((res) => res.json())
      .then(setData)
      .catch(setError);
  }, [setData, setError]);
  return (
    <>
      <h1>{ENTITY_PLURAL_DISPLAY_NAME}</h1>
      <h2>Items</h2>
      <table>
        <tr>
          <th>id</th>
        </tr>
        {data &&
          data.map((item) => (
            <tr>
              <td>{item.id}</td>
              {CELLS}
            </tr>
          ))}
      </table>
      <h2>Error</h2>
      {error && error.toString()}
    </>
  );
};
