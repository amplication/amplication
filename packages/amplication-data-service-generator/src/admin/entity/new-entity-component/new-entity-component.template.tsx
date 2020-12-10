import * as React from "react";
import { useMutation } from "react-query";

import { Formik } from "formik";
import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
} from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactElement[];
declare interface CREATE_INPUT {}
declare interface ENTITY {}

const INITIAL_VALUES = {} as CREATE_INPUT;

export const COMPONENT_NAME = (): React.ReactElement => {
  const [create, { error, isLoading }] = useMutation<
    ENTITY,
    Error,
    CREATE_INPUT
  >(async (data) => {
    const response = await api.post(`/${RESOURCE}`, data);
    return response.data;
  });
  const handleSubmit = React.useCallback(
    (values: CREATE_INPUT) => {
      void create(values);
    },
    [create]
  );
  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form
          formStyle={EnumFormStyle.Horizontal}
          formHeaderContent={
            <FormHeader title={`Create ${ENTITY_NAME}`}>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </FormHeader>
          }
        >
          {INPUTS}
        </Form>
      </Formik>
      {error ? error.toString() : "No Error"}
    </>
  );
};
