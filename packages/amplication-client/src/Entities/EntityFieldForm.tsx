import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import omit from "lodash.omit";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import * as types from "./types";
import { EnumDataType } from "../entityFieldProperties/EnumDataType";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";
import { SchemaFields } from "./SchemaFields";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { BooleanField } from "./fields/BooleanField";
import NameField from "./fields/NameField";

type Values = {
  name: string;
  displayName: string;
  dataType: EnumDataType;
  required: boolean;
  searchable: boolean;
  description: string;
  properties: Object;
};

type Props = {
  submitButtonTitle: string;
  onCancel: () => void;
  onSubmit: (values: Values) => void;
  actions?: React.ReactNode;
  defaultValues?: Partial<types.EntityField>;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

const DATA_TYPE_TO_LABEL: { [key in EnumDataType]: string } = {
  singleLineText: "Single Line Text",
  multiLineText: "Multi Line Text",
  email: "Email",
  state: "State",
  autoNumber: "Auto Number",
  wholeNumber: "Whole Number",
  dateTime: "Date Time",
  decimalNumber: "Decimal Number",
  file: "File",
  image: "Image",
  lookup: "Lookup",
  multiSelectOptionSet: "Multi Select Option Set",
  optionSet: "Option Set",
  twoOptions: "Two Options",
  boolean: "Boolean",
  uniqueId: "Unique Id",
  geographicAddress: "Geographic Address",
};

const DATA_TYPE_OPTIONS = Object.entries(DATA_TYPE_TO_LABEL)
  .map(([value, label]) => ({ value, label }))
  .sort();

export const INITIAL_VALUES: Values = {
  name: "",
  displayName: "",
  dataType: EnumDataType.singleLineText,
  required: false,
  searchable: false,
  description: "",
  properties: {},
};

const EntityFieldForm = ({
  submitButtonTitle,
  onSubmit,
  onCancel,
  actions = null,
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
        const schema = entityFieldPropertiesValidationSchemaFactory.getSchema(
          formik.values.dataType
        );

        return (
          <Form>
            <p>
              <NameField name="name" />
            </p>
            <p>
              <TextField
                name="displayName"
                label="Display Name"
                minLength={1}
              />
            </p>
            <p>
              <SelectField name="dataType" options={DATA_TYPE_OPTIONS} />
            </p>
            <p>
              Required <BooleanField name="required" />
            </p>
            <p>
              Searchable <BooleanField name="searchable" />
            </p>
            <TextField
              name="description"
              label="Description"
              textarea
              outlined
              fullwidth
              rows={3}
            />
            <SchemaFields schema={schema} formik={formik} />
            <Button type="submit" raised>
              {submitButtonTitle}
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            {actions}
          </Form>
        );
      }}
    </Formik>
  );
};

export default EntityFieldForm;
