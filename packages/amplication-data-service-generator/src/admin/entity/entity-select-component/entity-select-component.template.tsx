import React, { useMemo } from "react";
import { useQuery } from "react-query";
// @ts-ignore
import { api } from "../api";
import { SelectField, SelectFieldProps } from "@amplication/design-system";

declare const RESOURCE: string;
declare interface ENTITY {
  id: string;
}

type Data = ENTITY[];

type Props = Omit<SelectFieldProps, "options">;

export const ENTITY_SELECT = (props: Props) => {
  const { data, error } = useQuery<Data, Error>(
    `select-${RESOURCE}`,
    async () => {
      const response = await api.get(`/${RESOURCE}`);
      return response.data;
    }
  );

  const options = useMemo(() => {
    return data
      ? data.map((item) => ({
          value: item.id,
          /**@todo: replace id with a title */
          label: item.id,
        }))
      : [];
  }, [data]);

  return <SelectField {...props} options={options} />;
};
