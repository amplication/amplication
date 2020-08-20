import React, { useCallback, useRef } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import * as entityFieldPropertiesValidationSchemaFactory from "../entityFieldProperties/validationSchemaFactory";
import { INITIAL_VALUES as ENTITY_FIELD_FORM_INITIAL_VALUES } from "./EntityFieldForm";
import NameField from "../Components/NameField";
import { getInitialValues } from "./SchemaFields";
import { formatError } from "../util/error";
import { generateDisplayName } from "../Components/DisplayNameField";
import * as models from "../models";

const DEFAULT_SCHEMA = entityFieldPropertiesValidationSchemaFactory.getSchema(
  ENTITY_FIELD_FORM_INITIAL_VALUES.dataType
);
const SCHEMA_INITIAL_VALUES = getInitialValues(DEFAULT_SCHEMA);
const INITIAL_VALUES = {
  ...ENTITY_FIELD_FORM_INITIAL_VALUES,
  properties: SCHEMA_INITIAL_VALUES,
};

type Props = {
  onFieldAdd?: (field: models.EntityField) => void;
};

const NewEntityField = ({ onFieldAdd }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const match = useRouteMatch<RouteParams>("/:application/entities/:entity");

  const { entity } = match?.params ?? {};

  const [createEntityField, { error, loading }] = useMutation(
    CREATE_ENTITY_FIELD
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
      }).then((result) => {
        if (onFieldAdd) {
          onFieldAdd(result.data.createEntityField);
        }
        actions.resetForm();
        inputRef.current?.focus();
      });
    },
    [createEntityField, entity, inputRef, onFieldAdd]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <NameField
            required
            name="name"
            label="New Field Name"
            disabled={loading}
            inputRef={inputRef}
            autoFocus
            trailingButton={{ icon: "add", title: "Add field" }}
            hideLabel
            placeholder="Type field name"
          />
        </Form>
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntityField;

type RouteParams = {
  application?: string;
  entity?: string;
};

const CREATE_ENTITY_FIELD = gql`
  mutation createEntityField($data: EntityFieldCreateInput!) {
    createEntityField(data: $data) {
      id
      name
      dataType
    }
  }
`;
