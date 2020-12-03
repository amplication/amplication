import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

import { Formik, Form } from "formik";
import pick from "lodash.pick";
import { TextField } from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const FIELDS: React.ReactElement[];
declare const INPUTS: React.ReactElement[];
declare interface UPDATE_INPUT {}
declare const EDITABLE_PROPERTIES: string[];
declare interface ENTITY {
  [key: string]: any;
}

export const COMPONENT_NAME = (): React.ReactElement => {
  const [editing, setEditing] = React.useState(false);
  const match = useRouteMatch<{ id: string }>(`/${RESOURCE}/:id/`);
  const id = match?.params?.id;

  const { data, isLoading, isError, error } = useQuery<
    ENTITY,
    Error,
    [string, string]
  >([`get-${RESOURCE}`, id], async (key: string, id: string) => {
    const response = await api.get(`/${RESOURCE}/${id}`);
    return response.data;
  });

  const [
    update,
    { error: updateError, isLoading: updateIsLoading },
  ] = useMutation<ENTITY, Error, UPDATE_INPUT>(
    async (data) => {
      const response = await api.patch(`/${RESOURCE}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        setEditing(false);
      },
    }
  );

  const handleSubmit = React.useCallback(
    (values: UPDATE_INPUT) => {
      void update(values);
    },
    [update]
  );

  const toggleEditing = React.useCallback(() => {
    setEditing((editing) => !editing);
  }, []);

  const initialValues = React.useMemo(() => pick(data, EDITABLE_PROPERTIES), [
    data,
  ]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error && error.message}</span>;
  }

  return (
    <>
      <h1>
        {ENTITY_NAME} {id}
      </h1>
      <button onClick={toggleEditing}>
        {!editing ? "Edit" : "Stop Editing"}
      </button>
      {data && !editing && FIELDS}
      {data && editing && (
        <>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              {INPUTS}
              <button type="submit" disabled={updateIsLoading}>
                Submit
              </button>
            </Form>
          </Formik>
          <h2>Error</h2>
          {updateError ? updateError.toString() : "No Error"}
        </>
      )}
    </>
  );
};
