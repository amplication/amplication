import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import omit from "lodash.omit";
import * as models from "../models";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";
import { SchemaFields } from "./SchemaFields";
import { SelectField } from "../Components/SelectField";
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
  submitButtonTitle: string;
  onSubmit: (values: Values) => void;
  defaultValues?: Partial<models.EntityField>;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

const DATA_TYPE_TO_LABEL: { [key in models.EnumDataType]: string } = {
  [models.EnumDataType.SingleLineText]: "Single Line Text",
  [models.EnumDataType.MultiLineText]: "Multi Line Text",
  [models.EnumDataType.Email]: "Email",
  [models.EnumDataType.State]: "State",
  [models.EnumDataType.AutoNumber]: "Auto Number",
  [models.EnumDataType.WholeNumber]: "Whole Number",
  [models.EnumDataType.DateTime]: "Date Time",
  [models.EnumDataType.DecimalNumber]: "Decimal Number",
  [models.EnumDataType.File]: "File",
  [models.EnumDataType.Image]: "Image",
  [models.EnumDataType.Lookup]: "Lookup",
  [models.EnumDataType.MultiSelectOptionSet]: "Multi Select Option Set",
  [models.EnumDataType.OptionSet]: "Option Set",
  [models.EnumDataType.TwoOptions]: "Two Options",
  [models.EnumDataType.Boolean]: "Boolean",
  [models.EnumDataType.Id]: "Id",
  [models.EnumDataType.CreatedAt]: "Created At",
  [models.EnumDataType.UpdatedAt]: "Updated At",
  [models.EnumDataType.GeographicAddress]: "Geographic Address",
};

const DATA_TYPE_OPTIONS = Object.entries(DATA_TYPE_TO_LABEL)
  .map(([value, label]) => ({ value, label }))
  .sort();

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
  submitButtonTitle,
  onSubmit,
  defaultValues = {},
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
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        console.log(formik.values.dataType);
        const schema = entityFieldPropertiesValidationSchemaFactory.getSchema(
          formik.values.dataType
        );

        return (
          <Form>
            <FormikAutoSave debounceMS={1000} />
            <p>
              <NameField name="name" />
            </p>
            <p>
              <DisplayNameField
                name="displayName"
                label="Display Name"
                minLength={1}
              />
            </p>
            <p>
              <OptionalDescriptionField
                name="description"
                label="Description"
              />
            </p>
            <hr />
            <p>
              <ToggleField name="required" label="Required Field" />
            </p>
            <p>
              <ToggleField name="searchable" label="Searchable" />
            </p>
            <p>
              <SelectField
                label="Data Type"
                name="dataType"
                options={DATA_TYPE_OPTIONS}
              />
            </p>
            <SchemaFields schema={schema} formik={formik} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EntityFieldForm;
