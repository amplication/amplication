import React, { useMemo } from "react";
import { Formik, Field } from "formik";
import omit from "lodash.omit";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import "@rmwc/select/styles";
import * as types from "./types";
import { EnumDataType } from "../entityFieldProperties/EnumDataType";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";
import { SchemaFields } from "./SchemaFields";
import { SelectField } from "./SelectField";

type Values = {
  name: string;
  displayName: string;
  dataType: EnumDataType;
  required: boolean;
  searchable: boolean;
  description: string;
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

const INITIAL_VALUES: Values = {
  name: "",
  displayName: "",
  dataType: EnumDataType.singleLineText,
  required: false,
  searchable: false,
  description: "",
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
          <form onSubmit={formik.handleSubmit}>
            <p>
              <Field name="name" label="Name" as={TextField} minLength={1} />
            </p>
            <p>
              <Field
                name="displayName"
                label="Display Name"
                as={TextField}
                minLength={1}
              />
            </p>
            <p>
              <SelectField name="dataType" options={DATA_TYPE_OPTIONS} />
            </p>
            <p>
              Required <Field name="required" as={Switch} type="checkbox" />
            </p>
            <p>
              Searchable <Field name="searchable" as={Switch} type="checkbox" />
            </p>
            <Field
              name="description"
              label="Description"
              as={TextField}
              textarea
              outlined
              fullwidth
              rows={3}
            />
            <SchemaFields schema={schema} />
            <Button type="submit" raised>
              {submitButtonTitle}
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            {actions}
          </form>
        );
      }}
    </Formik>
  );
};

export default EntityFieldForm;
