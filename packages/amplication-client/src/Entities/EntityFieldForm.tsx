import React, { useCallback, useMemo } from "react";
import { Formik, Field, useField } from "formik";
import { capitalCase } from "capital-case";
import omit from "lodash.omit";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import CreatableSelect from "react-select/creatable";
import * as types from "./types";
import { EnumDataType } from "../entityFieldProperties/EnumDataType";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";

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
  const sanitizedDefaultValues = omit(
    defaultValues,
    NON_INPUT_GRAPHQL_PROPERTIES
  );
  return (
    <Formik
      initialValues={{
        ...INITIAL_VALUES,
        ...sanitizedDefaultValues,
      }}
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

const SelectField = (props: any) => {
  const [field] = useField(props);
  const handleChange = useCallback(
    (event) => {
      // Formik expects event.target.name which is not set correctly by Material
      // Components Select
      event.target.name = props.name;
      field.onChange(event);
    },
    [props.name, field]
  );
  return <Select {...field} {...props} onChange={handleChange} />;
};

type Option = { label: string; value: string };

const RepeatedTextField = (props: any) => {
  const [field, , { setValue }] = useField<string[]>(props);
  const handleChange = useCallback(
    (selected) => {
      // React Select emits values instead of event onChange
      if (!selected) {
        setValue([]);
      } else {
        const values = selected.map((option: Option) => option.value);
        setValue(values);
      }
    },
    [setValue]
  );
  const value = useMemo(() => {
    const values = field.value || [];
    return values.map((value) => ({ value, label: value }));
  }, [field]);
  return (
    <CreatableSelect
      {...field}
      {...props}
      isMulti
      isClearable
      value={value}
      onChange={handleChange}
    />
  );
};

const SchemaField = ({
  propertyName,
  propertySchema,
}: {
  propertyName: string;
  propertySchema:
    | { type: Exclude<string, "array"> }
    | { type: "array"; items: { type: string } };
}) => {
  const fieldName = `properties.${propertyName}`;
  const label = capitalCase(propertyName);
  switch (propertySchema.type) {
    case "string": {
      return <Field name={fieldName} as={TextField} label={label} />;
    }
    case "integer": {
      return <Field name={fieldName} as={TextField} label={label} />;
    }
    case "boolean": {
      return (
        <>
          {label} <Field name={fieldName} as={Switch} />
        </>
      );
    }
    case "array": {
      // @ts-ignore
      switch (propertySchema.items.type) {
        case "string": {
          return (
            <>
              {label} <Field name={fieldName} as={RepeatedTextField} />
            </>
          );
        }
        default: {
          throw new Error(
            `Unexpected propertySchema.items.type: ${propertySchema.type}`
          );
        }
      }
    }
    default: {
      throw new Error(`Unexpected propertySchema.type: ${propertySchema.type}`);
    }
  }
};

const SchemaFields = ({
  schema,
}: {
  schema: ReturnType<
    typeof entityFieldPropertiesValidationSchemaFactory.getSchema
  >;
}) => {
  if (schema === null) {
    return null;
  }
  if (schema.type !== "object") {
    throw new Error(`Unexpected type ${schema.type}`);
  }
  return (
    <>
      {Object.entries(schema.properties).map(([name, property]) => {
        if (!property) {
          throw new Error(`Missing property: ${name}`);
        }
        return (
          <div key={name}>
            <p>
              <SchemaField propertyName={name} propertySchema={property} />
            </p>
          </div>
        );
      })}
    </>
  );
};
