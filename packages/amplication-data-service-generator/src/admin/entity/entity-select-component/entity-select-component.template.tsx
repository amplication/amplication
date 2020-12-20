import React, { useMemo } from "react";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
// @ts-ignore
import { api } from "../api";
import { SelectField, SelectFieldProps } from "@amplication/design-system";

declare const RESOURCE: string;
declare interface ENTITY {
  id: string;
  [key: string]: any;
}

type Data = ENTITY[];

type Props = Omit<SelectFieldProps, "options">;

export const ENTITY_SELECT = (props: Props) => {
  const { data } = useQuery<Data, AxiosError>(
    `select-${RESOURCE}`,
    async () => {
      const response = await api.get(`${RESOURCE}`);
      return response.data;
    }
  );

  const options = useMemo(() => {
    return data
      ? data.map((item) => ({
          value: item.id,
          label:
            item.ENTITY_TITLE_FIELD && item.ENTITY_TITLE_FIELD.length
              ? item.ENTITY_TITLE_FIELD
              : item.id,
        }))
      : [];
  }, [data]);

  return <SelectField {...props} options={options} />;
};
