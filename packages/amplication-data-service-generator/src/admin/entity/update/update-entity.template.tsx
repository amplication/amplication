import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

import { Formik, Form, Field } from "formik";
// @ts-ignore
import { api } from "../api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactNode[];
declare interface UPDATE_INPUT {}
declare interface ENTITY {}

export const COMPONENT_NAME = (): React.ReactNode => {
  const match = useRouteMatch<{ id: string }>(`/${RESOURCE}/:id/`);
  const { data, isLoading, isError } = useQuery<ENTITY, [string, string]>(
    ["get-entity", match?.params?.id],
    async (key: string, id: string) => {
      const response = await api.get(`/${RESOURCE}/${id}`);
      return response.data;
    }
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
    (values: UPDATE_INPUT) => {
      void update(values);
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
      {data && (
        <Formik initialValues={data} onSubmit={handleSubmit}>
          <Form>
            {INPUTS}
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      )}
    </>
  );
};
