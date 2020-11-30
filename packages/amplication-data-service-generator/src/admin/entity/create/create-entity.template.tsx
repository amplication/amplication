import * as React from "react";
import { useMutation } from "react-query";
// @ts-ignore
import { api } from "../api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactNode[];
declare const ELEMENTS_MAPPING: any;
declare interface FormElements extends HTMLCollection {}
declare interface CREATE_INPUT {}
declare interface ENTITY {}

export const COMPONENT_NAME = () => {
  const [create, { error }] = useMutation<ENTITY, Error, CREATE_INPUT>(
    async (data) => {
      const response = await api.post(`/${RESOURCE}`, data);
      return response.data;
    }
  );
  const handleSubmit = React.useCallback(
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
      <form onSubmit={handleSubmit}>
        {INPUTS}
        <button>Submit</button>
      </form>
      <h2>Error</h2>
      {error ? error.toString() : "No Error"}
    </>
  );
};
