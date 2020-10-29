import React, { useCallback, useRef, useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { TextField } from "../Components/TextField";
import { formatError } from "../util/error";
import * as models from "../models";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { useTracking } from "../util/analytics";
import { validate } from "../util/formikValidateJsonSchema";
import { GET_FIELDS } from "./EntityFieldList";

type Values = {
  displayName: string;
};

type Props = {
  onFieldAdd?: (field: models.EntityField) => void;
};

type TData = {
  createEntityFieldByDisplayName: models.EntityField;
};

const INITIAL_VALUES = {
  displayName: "",
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
  },
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
      update(cache, { data }) {
        if (!data) return;
        const queryData = cache.readQuery<{ entity: models.Entity }>({
          query: GET_FIELDS,
          variables: {
            id: entity,
            orderBy: undefined,
            whereName: undefined,
          },
        });
        if (!queryData?.entity?.fields) {
          return;
        }

        cache.writeQuery({
          query: GET_FIELDS,
          variables: {
            id: entity,
            orderBy: undefined,
            whereName: undefined,
          },
          data: {
            entity: {
              ...queryData.entity,
              fields: queryData.entity.fields.concat([
                data.createEntityFieldByDisplayName,
              ]),
            },
          },
        });
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entity);
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
            entity: { connect: { id: entity } },
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
    [createEntityField, entity, inputRef, onFieldAdd]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Values) => validate(values, FORM_SCHEMA)}
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
    }
  }
`;
