import React, { ReactNode, useCallback } from "react";
// @ts-ignore
import { useAPIMutation } from "./use-api-mutation";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: ReactNode[];
declare const ELEMENTS_MAPPING: any;
declare interface FormElements extends HTMLCollection {}

export const CREATE_ENTITY = () => {
  const [create, { error }] = useAPIMutation(`/${RESOURCE}`);
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      event.preventDefault();
      const { elements } = event.target as HTMLFormElement & {
        elements: FormElements;
      };
      create(ELEMENTS_MAPPING);
    },
    [create]
  );
  return (
    <>
      <h1>Create {ENTITY_NAME}</h1>
      <form onSubmit={handleSubmit}>{INPUTS}</form>
      <h2>Error</h2>
      {error ? error.toString() : "No Error"}
    </>
  );
};
