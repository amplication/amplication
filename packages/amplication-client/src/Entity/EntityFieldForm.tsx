import React, { useMemo } from "react";
import { Formik, FormikErrors } from "formik";
import { omit, isEmpty } from "lodash";
import { getSchemaForDataType } from "@amplication/code-gen-types";
import { TextField, ToggleField, Form } from "@amplication/ui/design-system";
import * as models from "../models";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import { SYSTEM_DATA_TYPES } from "./constants";
import DataTypeSelectField from "./DataTypeSelectField";
import { SchemaFields } from "./SchemaFields";

export type Values = {
  id: string; //the id field is required in the form context to be used in "DataTypeSelectField"
  name: string;
  displayName: string;
  dataType: models.EnumDataType;
  unique: boolean;
  required: boolean;
  searchable: boolean;
  customAttributes: string | null;
  description: string | null;
  permanentId?: string | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  properties: {
    relatedEntityId?: string;
    allowMultipleSelection?: string;
  };
};

type Props = {
  onSubmit: (values: Values) => void;
  defaultValues?: Partial<models.EntityField>;
  resourceId: string;
  entity: models.Entity;
  isSystemDataType?: boolean;
  isAuthEntitySpecificDataType?: boolean;
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
      minLength: 1,
    },
  },
};

const NON_INPUT_GRAPHQL_PROPERTIES = ["createdAt", "updatedAt", "__typename"];

export const INITIAL_VALUES: Values = {
  id: "",
  name: "",
  displayName: "",
  dataType: models.EnumDataType.SingleLineText,
  unique: false,
  required: false,
  searchable: false,
  customAttributes: null,
  description: "",
  properties: {},
};

const EntityFieldForm = ({
  onSubmit,
  defaultValues = {},
  resourceId,
  entity,
  isSystemDataType,
  isAuthEntitySpecificDataType,
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
        const propertiesError = validate<{
          relatedEntityId?: string;
          allowMultipleSelection?: string;
        }>(values.properties, schema);

        // Ignore related field ID error
        if ("relatedFieldId" in propertiesError) {
          delete propertiesError.relatedFieldId;
        }

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
          <Form childrenAsBlocks>
            <FormikAutoSave debounceMS={1000} />

            <DisplayNameField
              name="displayName"
              label="Display Name"
              disabled={isSystemDataType}
              required
            />
            <NameField name="name" disabled={isSystemDataType} required />
            <OptionalDescriptionField
              name="description"
              label="Description"
              disabled={isSystemDataType}
            />
            <div>
              <ToggleField
                name="unique"
                label="Unique Field"
                disabled={isSystemDataType || isAuthEntitySpecificDataType}
              />
            </div>
            <div>
              <ToggleField
                name="required"
                label="Required Field"
                disabled={isSystemDataType}
              />
            </div>
            <div>
              <ToggleField
                name="searchable"
                label="Searchable"
                disabled={isSystemDataType}
              />
            </div>
            {!SYSTEM_DATA_TYPES.has(formik.values.dataType) && (
              <DataTypeSelectField
                label="Data Type"
                disabled={isSystemDataType}
              />
            )}

            <SchemaFields
              fieldDataType={formik.values.dataType}
              schema={schema}
              resourceId={resourceId}
              entity={entity}
            />

            <TextField
              autoComplete="off"
              placeholder="Custom Prisma Attributes"
              inputToolTip={{
                content: (
                  <span>
                    Add custom attributes to fields using the format
                    @attribute([parameters]) or @attribute. <br />
                    <br /> For example:
                    <br />
                    @map(name: "fieldName")
                    <br />
                    @unique
                    <br />
                    @default(value)
                  </span>
                ),
              }}
              textarea
              rows={3}
              name="customAttributes"
              label="Custom Attributes"
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EntityFieldForm;
