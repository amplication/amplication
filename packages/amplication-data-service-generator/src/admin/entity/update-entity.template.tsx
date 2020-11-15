import * as React from "react";
// @ts-ignore
import { useAPIQuery } from "./use-api-query";
// @ts-ignore
import { useAPIMutation } from "./use-api-mutation";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactNode[];
declare const ELEMENTS_MAPPING: any;
declare interface FormElements extends HTMLCollection {}
declare interface UPDATE_INPUT {}
declare interface ENTITY {}

type Props = {
  id: string;
};

export const COMPONENT_NAME = ({ id }: Props) => {
  const { data, isLoading, isError } = useAPIQuery<ENTITY>(
    "get-entity",
    `/${RESOURCE}/${id}`
  );
  const [update, { error }] = useAPIMutation<ENTITY, UPDATE_INPUT>(
    `/${RESOURCE}`
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
