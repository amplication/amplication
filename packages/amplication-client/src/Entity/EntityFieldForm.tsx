import React, { useMemo } from "react";
import { Formik, Form, FormikErrors } from "formik";
import omit from "lodash.omit";
import { set } from "lodash";
import Ajv from "ajv";
import { getSchemaForDataType } from "amplication-data";
import * as models from "../models";
import { SchemaFields } from "./SchemaFields";
import DataTypeSelectField from "./DataTypeSelectField";
import { ToggleField } from "../Components/ToggleField";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import FormikAutoSave from "../util/formikAutoSave";

type Values = {
  name: string;
  displayName: string;
  dataType: models.EnumDataType;
  required: boolean;
  searchable: boolean;
  description: string;
  properties: Object;
};

type Props = {
  onSubmit: (values: Values) => void;
  isDisabled?: boolean;
  defaultValues?: Partial<models.EntityField>;
  applicationId: string;
};

const PROPERTIES_FIELD = "properties";

const FORM_SCHEMA = {
  required: ["name", "displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 1,
    },
    name: {
      type: "string",
      minLength: 2,
    },
  },
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Values = {
  name: "",
  displayName: "",
  dataType: models.EnumDataType.SingleLineText,
  required: false,
  searchable: false,
  description: "",
  properties: {},
};

const EntityFieldForm = ({
  onSubmit,
  defaultValues = {},
  isDisabled,
  applicationId,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    };
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: Values) => {
        const errors: FormikErrors<Values> = {};

        const ajv: Ajv.Ajv = new Ajv({ allErrors: true });

        let isValid = ajv.validate(FORM_SCHEMA, values);

        if (!isValid) {
          ajv.errors?.forEach((error) => {
            const fieldName = error.dataPath.substring(1);
            set(errors, fieldName, error.message);
          });
        }

        const schema = getSchemaForDataType(values.dataType);

        isValid = ajv.validate(schema, values.properties);

        if (!isValid) {
          errors.properties = {};
          ajv.errors?.forEach((error) => {
            const path = PROPERTIES_FIELD + error.dataPath;
            set(errors, path, error.message);
          });
        }

        return errors;
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        const schema = getSchemaForDataType(formik.values.dataType);

        return (
          <Form>
            {!isDisabled && <FormikAutoSave debounceMS={1000} />}

            <p>
              <DisplayNameField
                name="displayName"
                label="Display Name"
                disabled={isDisabled}
                required
              />
            </p>
            <p>
              <NameField name="name" disabled={isDisabled} required />
            </p>
            <p>
              <OptionalDescriptionField
                name="description"
                label="Description"
                disabled={isDisabled}
              />
            </p>
            <hr />
            <p>
              <ToggleField
                name="required"
                label="Required Field"
                disabled={isDisabled}
              />
            </p>
            <p>
              <ToggleField
                name="searchable"
                label="Searchable"
                disabled={isDisabled}
              />
            </p>
            <p>
              {formik.values.dataType !== models.EnumDataType.Id && (
                <DataTypeSelectField label="Data Type" disabled={isDisabled} />
              )}
            </p>
            <SchemaFields
              schema={schema}
              isDisabled={isDisabled}
              applicationId={applicationId}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EntityFieldForm;
