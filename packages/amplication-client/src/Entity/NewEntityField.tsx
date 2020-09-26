import React, { useCallback, useRef, useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { camelCase } from "camel-case";
import { getSchemaForDataType, Schema } from "amplication-data";
import { INITIAL_VALUES as ENTITY_FIELD_FORM_INITIAL_VALUES } from "./EntityFieldForm";
import { TextField } from "../Components/TextField";
import { formatError } from "../util/error";
import * as models from "../models";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { useTracking } from "../util/analytics";

const DEFAULT_SCHEMA = getSchemaForDataType(
  ENTITY_FIELD_FORM_INITIAL_VALUES.dataType
);
const SCHEMA_INITIAL_VALUES = getInitialValues(DEFAULT_SCHEMA);

const INITIAL_VALUES_WITH_ID = {
  ...ENTITY_FIELD_FORM_INITIAL_VALUES,
  properties: SCHEMA_INITIAL_VALUES,
};

const { id, ...INITIAL_VALUES } = INITIAL_VALUES_WITH_ID;

type Props = {
  onFieldAdd?: (field: models.EntityField) => void;
};

type TData = {
  createEntityField: models.EntityField;
};

const NewEntityField = ({ onFieldAdd }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const match = useRouteMatch<RouteParams>("/:application/entities/:entity");
  const entity: string = match?.params.entity || "";

  const [createEntityField, { error, loading }] = useMutation<TData>(
    CREATE_ENTITY_FIELD,
    {
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entity);
        trackEvent({
          eventName: "createEntityField",
          entityFieldName: data.createEntityField.displayName,
          dataType: data.createEntityField.dataType,
        });
      },
      errorPolicy: "none",
    }
  );

  const handleSubmit = useCallback(
    (data, actions) => {
      createEntityField({
        variables: {
          data: {
            ...data,
            name: camelCase(data.displayName),
            properties: data.properties || {},
            entity: { connect: { id: entity } },
          },
        },
      })
        .then((result) => {
          if (onFieldAdd) {
            onFieldAdd(result.data.createEntityField);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createEntityField, entity, inputRef, onFieldAdd]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <TextField
            required
            name="displayName"
            label="New Field Name"
            disabled={loading}
            inputRef={inputRef}
            autoFocus
            trailingButton={{ icon: "add", title: "Add field" }}
            hideLabel
            placeholder="Type field name"
            autoComplete="off"
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

export function getInitialValues(schema: Schema): Object {
  return Object.fromEntries(
    Object.entries(schema.properties)
      .filter(([, property]) => "default" in property)
      .map(([name, property]) => [name, property.default])
  );
}
