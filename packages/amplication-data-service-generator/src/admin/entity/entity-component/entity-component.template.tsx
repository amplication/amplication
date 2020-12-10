import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

import { Formik } from "formik";
import pick from "lodash.pick";
import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
} from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";
// @ts-ignore
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";

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

  useBreadcrumbs(match?.url, data?.ENTITY_TITLE_FIELD);

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
      {data && (
        <>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form
              formStyle={EnumFormStyle.Horizontal}
              formHeaderContent={
                <FormHeader
                  title={`${ENTITY_NAME} ${data?.ENTITY_TITLE_FIELD}`}
                >
                  <Button type="submit" disabled={updateIsLoading}>
                    Save
                  </Button>
                </FormHeader>
              }
            >
              {INPUTS}
            </Form>
          </Formik>
          {updateError ? updateError.toString() : "No Error"}
        </>
      )}
    </>
  );
};
