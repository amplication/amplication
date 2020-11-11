import React, { useEffect, useState } from "react";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const RESOURCE: string;
declare interface ENTITY_TYPE {
  id: string;
}

export const ENTITY_LIST = () => {
  const [data, setData] = useState<ENTITY_TYPE[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch(`/${RESOURCE}`)
      .then((res) => res.json())
      .then(setData)
      .catch(setError);
  });
  return (
    <>
      <h1>{ENTITY_PLURAL_DISPLAY_NAME}</h1>
      <table>
        <tr>
          <th>id</th>
        </tr>
        {data &&
          data.map((item) => (
            <tr>
              <td>{item.id}</td>
            </tr>
          ))}
      </table>
      {error}
    </>
  );
};
