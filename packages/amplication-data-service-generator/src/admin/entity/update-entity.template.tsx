import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
// @ts-ignore
import { api } from "./api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactNode[];
declare const ELEMENTS_MAPPING: any;
declare interface FormElements extends HTMLCollection {}
declare interface UPDATE_INPUT {}
declare interface ENTITY {}

export const COMPONENT_NAME = () => {
  const match = useRouteMatch<{ id: string }>(`/${RESOURCE}/:id/`);
  const { data, isLoading, isError } = useQuery<ENTITY, [string, string]>(
    ["get-entity", match?.params?.id],
    (key: string, id: string) => api.get(`/${RESOURCE}/${id}`)
  );
  const [update, { error }] = useMutation<ENTITY, Error, UPDATE_INPUT>(
    async (data) => {
      const response = await api.patch(
        `/${RESOURCE}/${match?.params?.id}`,
        data
      );
      return response.data;
    }
  );
  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      const { elements } = event.target as HTMLFormElement & {
        elements: FormElements;
      };
      update(ELEMENTS_MAPPING);
    },
    [update]
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error && error.message}</span>;
  }

  return (
    <>
      <h1>Update {ENTITY_NAME}</h1>
      <form onSubmit={handleSubmit}>{data && INPUTS}</form>
    </>
  );
};
