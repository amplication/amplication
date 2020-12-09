import React from "react";
import { Link } from "react-router-dom";
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
    Error,
    [string, string]
  >([`get-${RESOURCE}`, id], async (key: string, id: string) => {
    const response = await api.get(`/${RESOURCE}/${id}`);
    return response.data;
  });

  return (
    <Link to={`/${RESOURCE}/${id}`} className="entity-id">
      {data?.ENTITY_TITLE_FIELD}
    </Link>
  );
};
