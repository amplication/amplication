import * as React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import { AxiosError } from "axios";
import { Formik } from "formik";
import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
  Snackbar,
} from "@amplication/design-system";
// @ts-ignore
import { api } from "../api";
// @ts-ignore
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";

declare const ENTITY_NAME: string;
declare const PATH: string;
declare const RESOURCE: string;
declare const INPUTS: React.ReactElement[];
declare interface CREATE_INPUT {}
declare interface ENTITY {
  id: string;
}

const INITIAL_VALUES = {} as CREATE_INPUT;

export const COMPONENT_NAME = (): React.ReactElement => {
  useBreadcrumbs(`${PATH}/new`, `Create ${ENTITY_NAME}`);
  const history = useHistory();

  const [create, { error, isError, isLoading }] = useMutation<
    ENTITY,
    AxiosError,
    CREATE_INPUT
  >(
    async (data) => {
      const response = await api.post(RESOURCE, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        history.push(`${PATH}/${data.id}`);
      },
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
      <Snackbar open={isError} message={error?.response?.data?.message} />
    </>
  );
};
