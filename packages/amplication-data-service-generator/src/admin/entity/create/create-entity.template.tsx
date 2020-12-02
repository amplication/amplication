import * as React from "react";
import { useMutation } from "react-query";

import { Formik, Form } from "formik";
import { TextField } from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactElement[];
declare interface CREATE_INPUT {}
declare interface ENTITY {}

const INITIAL_VALUES = {} as CREATE_INPUT;

export const COMPONENT_NAME = (): React.ReactElement => {
  const [create, { error }] = useMutation<ENTITY, Error, CREATE_INPUT>(
    async (data) => {
      const response = await api.post(`/${RESOURCE}`, data);
      return response.data;
    }
  );
  const handleSubmit = React.useCallback(
    (values: CREATE_INPUT) => {
      void create(values);
    },
    [create]
  );
  return (
    <>
      <h1>Create {ENTITY_NAME}</h1>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          {INPUTS}
          <button>Submit</button>
        </Form>
      </Formik>
      <h2>Error</h2>
      {error ? error.toString() : "No Error"}
    </>
  );
};
