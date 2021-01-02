import React, { useCallback, useMemo, useRef, useState } from "react";
import { Formik, FormikErrors } from "formik";
import omit from "lodash.omit";
import { isEmpty } from "lodash";
import { getSchemaForDataType, types } from "@amplication/data";
import { ToggleField } from "@amplication/design-system";
import * as models from "../models";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import { SYSTEM_DATA_TYPES } from "./constants";
import DataTypeSelectField from "./DataTypeSelectField";
import { SchemaFields } from "./SchemaFields";
import {
  RelatedFieldDialog,
  Values as RelatedFieldValues,
} from "./RelatedFieldDialog";

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
  onSubmit: (values: Values | (Values & RelatedFieldValues)) => void;
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
  const pendingDataRef = useRef<Values | null>(null);
  const [
    relatedFieldDialogDisplayed,
    setRelatedFieldDialogDisplayed,
  ] = useState(false);
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

  const handleSubmit = useCallback(
    (data: Values) => {
      if (data.dataType === models.EnumDataType.Lookup) {
        const properties = data.properties as types.Lookup;
        if (
          properties.relatedEntityId !==
          defaultValues.properties.relatedEntityId
        ) {
          pendingDataRef.current = data;
          setRelatedFieldDialogDisplayed(true);
          return;
        }
      }
      onSubmit(data);
    },
    [onSubmit, setRelatedFieldDialogDisplayed, defaultValues]
  );

  const hideRelatedFieldDialog = useCallback(() => {
    pendingDataRef.current = null;
    setRelatedFieldDialogDisplayed(false);
  }, [setRelatedFieldDialogDisplayed]);

  const handleRelatedFieldFormSubmit = useCallback(
    (data: RelatedFieldValues) => {
      const pendingData = pendingDataRef.current;
      if (!pendingData) {
        throw new Error("Pending data should be defined");
      }
      onSubmit({
        ...pendingData,
        ...data,
        properties: {
          ...pendingData.properties,
          relatedFieldId: undefined,
        },
      });
      setRelatedFieldDialogDisplayed(false);
    },
    [onSubmit, setRelatedFieldDialogDisplayed]
  );

  return (
    <>
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
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const schema = getSchemaForDataType(formik.values.dataType);

          return (
            <Form childrenAsBlocks>
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
              <hr />
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
      <RelatedFieldDialog
        isOpen={relatedFieldDialogDisplayed}
        onDismiss={hideRelatedFieldDialog}
        onSubmit={handleRelatedFieldFormSubmit}
      />
    </>
  );
};

export default EntityFieldForm;
