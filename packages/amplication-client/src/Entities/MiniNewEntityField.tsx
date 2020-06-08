import React, { useCallback, useRef } from "react";
import { Formik, Form } from "formik";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";
import { INITIAL_VALUES as ENTITY_FIELD_FORM_INITIAL_VALUES } from "./EntityFieldForm";
import NameField from "./fields/NameField";
import {
  useCreateEntityFieldRouteParams,
  useCreateEntityField,
} from "./NewEntityField";
import { getInitialValues } from "./SchemaFields";
import { formatError } from "../errorUtil";
import { generateDisplayName } from "./fields/DisplayNameField";

const DEFAULT_SCHEMA = entityFieldPropertiesValidationSchemaFactory.getSchema(
  ENTITY_FIELD_FORM_INITIAL_VALUES.dataType
);
const SCHEMA_INITIAL_VALUES = getInitialValues(DEFAULT_SCHEMA);
const INITIAL_VALUES = {
  ...ENTITY_FIELD_FORM_INITIAL_VALUES,
  properties: SCHEMA_INITIAL_VALUES,
};

const MiniNewEntityField = () => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const { application, entity } = useCreateEntityFieldRouteParams();
  const [createEntityField, { error, loading }] = useCreateEntityField(
    application,
    entity
  );

  const handleSubmit = useCallback(
    (data, actions) => {
      createEntityField({
        variables: {
          data: {
            ...data,
            displayName: generateDisplayName(data.name),
            properties: data.properties || {},
            entity: { connect: { id: entity } },
          },
        },
      }).then(() => {
        actions.resetForm();
        inputRef.current?.focus();
      });
    },
    [createEntityField, entity, inputRef]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <NameField
            name="name"
            label="New Field Name"
            disabled={loading}
            inputRef={inputRef}
            autoFocus
          />
          <Button disabled={loading} raised>
            Add
          </Button>
        </Form>
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default MiniNewEntityField;
