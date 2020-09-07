import React, { useMemo } from "react";
import { Formik, Form, FormikErrors } from "formik";
import omit from "lodash.omit";
import { getSchemaForDataType } from "amplication-data";
import * as models from "../models";
import { SchemaFields } from "./SchemaFields";
import { SelectField } from "../Components/SelectField";
import { ToggleField } from "../Components/ToggleField";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";
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

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

const DATA_TYPE_OPTIONS = Object.entries(DATA_TYPE_TO_LABEL_AND_ICON)
  .filter(([value, content]) => value !== models.EnumDataType.Id)
  .map(([value, content]) => ({
    value,
    label: content.label,
    icon: content.icon,
  }));

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
        /**@todo: validate all fields using JSON Schema or yup */
        const errors: FormikErrors<Values> = {};

        if (!values.name.length) {
          errors.name = "Required";
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
                minLength={1}
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
                <SelectField
                  label="Data Type"
                  name="dataType"
                  options={DATA_TYPE_OPTIONS}
                  disabled={isDisabled}
                />
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
