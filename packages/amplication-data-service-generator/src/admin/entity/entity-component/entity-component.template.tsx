import * as React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { Formik } from "formik";
import pick from "lodash.pick";
import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
  Snackbar,
  EnumButtonStyle,
} from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";
// @ts-ignore
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";

declare const ENTITY_NAME: string;
declare const RESOURCE: string;
declare const PATH: string;
declare const INPUTS: React.ReactElement[];
declare interface UPDATE_INPUT {}
declare const EDITABLE_PROPERTIES: string[];
declare interface ENTITY {
  [key: string]: any;
}

export const COMPONENT_NAME = (): React.ReactElement => {
  const match = useRouteMatch<{ id: string }>(`${RESOURCE}/:id/`);
  const id = match?.params?.id;
  const history = useHistory();

  const { data, isLoading, isError, error } = useQuery<
    ENTITY,
    AxiosError,
    [string, string]
  >([`get-${RESOURCE}`, id], async (key: string, id: string) => {
    const response = await api.get(`${RESOURCE}/${id}`);
    return response.data;
  });

  const [
    deleteEntity,
    { error: deleteError, isError: deleteIsError },
  ] = useMutation<ENTITY, AxiosError>(
    async (data) => {
      const response = await api.delete(`${RESOURCE}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        history.push(`/${PATH}`);
      },
    }
  );

  const [
    update,
    { error: updateError, isError: updateIsError, isLoading: updateIsLoading },
  ] = useMutation<ENTITY, AxiosError, UPDATE_INPUT>(async (data) => {
    const response = await api.patch(`${RESOURCE}/${id}`, data);
    return response.data;
  });

  const handleSubmit = React.useCallback(
    (values: UPDATE_INPUT) => {
      void update(values);
    },
    [update]
  );

  useBreadcrumbs(match?.url, data?.ENTITY_TITLE_FIELD);

  const handleDelete = React.useCallback(() => {
    void deleteEntity();
  }, [deleteEntity]);

  const errorMessage =
    updateError?.response?.data?.message || error?.response?.data?.message;

  const initialValues = React.useMemo(() => pick(data, EDITABLE_PROPERTIES), [
    data,
  ]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {data && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form
            formStyle={EnumFormStyle.Horizontal}
            formHeaderContent={
              <FormHeader
                title={`${ENTITY_NAME} ${
                  data?.ENTITY_TITLE_FIELD && data?.ENTITY_TITLE_FIELD.length
                    ? data.ENTITY_TITLE_FIELD
                    : data?.id
                }`}
              >
                <Button
                  type="button"
                  disabled={updateIsLoading}
                  buttonStyle={EnumButtonStyle.Secondary}
                  icon="trash_2"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button type="submit" disabled={updateIsLoading}>
                  Save
                </Button>
              </FormHeader>
            }
          >
            {INPUTS}
          </Form>
        </Formik>
      )}
      <Snackbar open={isError || updateIsError} message={errorMessage} />
    </>
  );
};
