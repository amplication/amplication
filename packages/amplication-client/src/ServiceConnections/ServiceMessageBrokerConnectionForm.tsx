import { ToggleField } from "@amplication/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import React, { useMemo } from "react";
import { Form } from "../Components/Form";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  onSubmit: (values: models.ServiceMessageBrokerConnection) => void;
  defaultValues?: models.ServiceMessageBrokerConnection;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.ServiceMessageBrokerConnection> = {
  displayName: "",
  description: "",
  enabled: false,
};

const FORM_SCHEMA = {
  required: ["enabled"],
  properties: {
    enabled: {
      type: "boolean",
    },
  },
};

const ServiceMessageBrokerConnectionForm = ({
  onSubmit,
  defaultValues,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.ServiceMessageBrokerConnection;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ServiceMessageBrokerConnection) =>
        validate(values, FORM_SCHEMA)
      }
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        <FormikAutoSave debounceMS={1000} />
        <ToggleField name="enabled" label="enabled" />
      </Form>
    </Formik>
  );
};

export default ServiceMessageBrokerConnectionForm;
