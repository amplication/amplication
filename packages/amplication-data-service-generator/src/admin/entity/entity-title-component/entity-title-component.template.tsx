import React from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
// @ts-ignore
import { api } from "../api";

declare const RESOURCE: string;
declare interface ENTITY {
  [key: string]: any;
}

type Props = { id: string };

export const ENTITY_TITLE = ({ id }: Props) => {
  const { data, isLoading, isError, error } = useQuery<
    ENTITY,
    AxiosError,
    [string, string]
  >([`get-${RESOURCE}`, id], async (key: string, id: string) => {
    const response = await api.get(`${RESOURCE}/${id}`);
    return response.data;
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <Link to={`${RESOURCE}/${id}`} className="entity-id">
      {data?.ENTITY_TITLE_FIELD && data?.ENTITY_TITLE_FIELD.length
        ? data.ENTITY_TITLE_FIELD
        : data?.id}
    </Link>
  );
};
