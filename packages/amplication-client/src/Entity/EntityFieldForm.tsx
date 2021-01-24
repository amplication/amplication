import React, { useMemo } from "react";
import { Formik, FormikErrors } from "formik";
import omit from "lodash.omit";
import { isEmpty } from "lodash";
import { getSchemaForDataType } from "@amplication/data";
import * as models from "../models";
import { SchemaFields } from "./SchemaFields";
import DataTypeSelectField from "./DataTypeSelectField";
import { ToggleField } from "@amplication/design-system";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import FormikAutoSave from "../util/formikAutoSave";
import { Form } from "../Components/Form";
import { validate } from "../util/formikValidateJsonSchema";
import { SYSTEM_DATA_TYPES } from "./constants";

type Values = {
  id: string; //the id field is required in the form context to be used in "DataTypeSelectField"
  name: string;
  displayName: string;
  dataType: models.EnumDataType;
  required: boolean;
  searchable: boolean;
  description: string | null;
  properties: Object;
};

type Props = {
  onSubmit: (values: Values) => void;
  isDisabled?: boolean;
  defaultValues?: Partial<models.EntityField>;
  applicationId: string;
};

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

const NON_INPUT_GRAPHQL_PROPERTIES = ["createdAt", "updatedAt", "__typename"];

export const INITIAL_VALUES: Values = {
  id: "",
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
        const errors: FormikErrors<Values> = validate<Values>(
          values,
          FORM_SCHEMA
        );
        //validate the field dynamic properties
        const schema = getSchemaForDataType(values.dataType);
        const propertiesError = validate<Object>(values.properties, schema);
        if (!isEmpty(propertiesError)) {
          errors.properties = propertiesError;
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

            <DisplayNameField
              name="displayName"
              label="Display Name"
              disabled={isDisabled}
              required
            />
            <NameField name="name" disabled={isDisabled} required />
            <OptionalDescriptionField
              name="description"
              label="Description"
              disabled={isDisabled}
            />
            <div>
              <ToggleField
                name="required"
                label="Required Field"
                disabled={isDisabled}
              />
            </div>
            <div>
              <ToggleField
                name="searchable"
                label="Searchable"
                disabled={isDisabled}
              />
            </div>
            {!SYSTEM_DATA_TYPES.has(formik.values.dataType) && (
              <DataTypeSelectField label="Data Type" disabled={isDisabled} />
            )}
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
