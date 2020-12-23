import React, { useCallback, useRef, useContext } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { TextField } from "@amplication/design-system";
import { formatError } from "../util/error";
import * as models from "../models";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { useTracking } from "../util/analytics";

type Values = {
  displayName: string;
};

type Props = {
  entity: models.Entity;
  onFieldAdd?: (field: models.EntityField) => void;
};

type TData = {
  createEntityFieldByDisplayName: models.EntityField;
};

const INITIAL_VALUES = {
  displayName: "",
};

const NewEntityField = ({ entity, onFieldAdd }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [createEntityField, { error, loading }] = useMutation<TData>(
    CREATE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;

        const newEntityField = data.createEntityFieldByDisplayName;

        cache.modify({
          id: cache.identify(entity),
          fields: {
            fields(existingEntityFieldRefs = [], { readField }) {
              const newEntityFieldRef = cache.writeFragment({
                data: newEntityField,
                fragment: NEW_ENTITY_FIELD_FRAGMENT,
              });

              if (
                existingEntityFieldRefs.some(
                  (ref: Reference) => readField("id", ref) === newEntityField.id
                )
              ) {
                return existingEntityFieldRefs;
              }

              return [...existingEntityFieldRefs, newEntityFieldRef];
            },
          },
        });
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entity.id);
        trackEvent({
          eventName: "createEntityField",
          entityFieldName: data.createEntityFieldByDisplayName.displayName,
          dataType: data.createEntityFieldByDisplayName.dataType,
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
            displayName: data.displayName,
            entity: { connect: { id: entity.id } },
          },
        },
      })
        .then((result) => {
          if (onFieldAdd && result.data) {
            onFieldAdd(result.data.createEntityFieldByDisplayName);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createEntityField, entity.id, inputRef, onFieldAdd]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik
        initialValues={INITIAL_VALUES}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        <Form>
          <TextField
            required
            name="displayName"
            label="New Field Name"
            disabled={loading}
            inputRef={inputRef}
            autoFocus
            trailingButton={{ title: "Add field" }}
            hideLabel
            placeholder="Type field name and press Enter"
            autoComplete="off"
          />
        </Form>
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntityField;

const CREATE_ENTITY_FIELD = gql`
  mutation createEntityFieldByDisplayName(
    $data: EntityFieldCreateByDisplayNameInput!
  ) {
    createEntityFieldByDisplayName(data: $data) {
      id
      displayName
      name
      dataType
      required
      searchable
      description
      properties
    }
  }
`;

const NEW_ENTITY_FIELD_FRAGMENT = gql`
  fragment NewEntityField on EntityField {
    id
    displayName
    name
    dataType
    required
    searchable
    description
    properties
  }
`;
