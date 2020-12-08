import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

import { Formik } from "formik";
import pick from "lodash.pick";
import {
  TextField,
  SelectField,
  Form,
  EnumFormStyle,
  Button,
} from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactElement[];
declare interface UPDATE_INPUT {}
declare const EDITABLE_PROPERTIES: string[];
declare interface ENTITY {
  [key: string]: any;
}

export const COMPONENT_NAME = (): React.ReactElement => {
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
  ] = useMutation<ENTITY, Error, UPDATE_INPUT>(async (data) => {
    const response = await api.patch(`/${RESOURCE}/${id}`, data);
    return response.data;
  });

  const handleSubmit = React.useCallback(
    (values: UPDATE_INPUT) => {
      void update(values);
    },
    [update]
  );

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

      {data && (
        <>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form formStyle={EnumFormStyle.Horizontal}>
              {INPUTS}
              <Button type="submit" disabled={updateIsLoading}>
                Submit
              </Button>
            </Form>
          </Formik>
          {updateError ? updateError.toString() : "No Error"}
        </>
      )}
    </>
  );
};
