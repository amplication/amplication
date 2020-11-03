import React, { useCallback, useRef } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { Formik, Form } from "formik";
import { camelCase } from "camel-case";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { TextField } from "../Components/TextField";
import { formatError } from "../util/error";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

const INITIAL_VALUES: Partial<models.AppRole> = {
  name: "",
  displayName: "",
  description: "",
};

type Props = {
  applicationId: string;
  onRoleAdd?: (role: models.AppRole) => void;
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

const NewRole = ({ onRoleAdd, applicationId }: Props) => {
  const [createRole, { error, loading }] = useMutation(CREATE_ROLE, {
    update(cache, { data }) {
      if (!data) return;

      const newAppRole = data.createAppRole;

      cache.modify({
        fields: {
          appRoles(existingAppRoleRefs = [], { readField }) {
            const newAppRoleRef = cache.writeFragment({
              data: newAppRole,
              fragment: NEW_ROLE_FRAGMENT,
            });

            if (
              existingAppRoleRefs.some(
                (appRoleRef: Reference) =>
                  readField("id", appRoleRef) === newAppRole.id
              )
            ) {
              return existingAppRoleRefs;
            }

            return [...existingAppRoleRefs, newAppRoleRef];
          },
        },
      });
    },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = useCallback(
    (data, actions) => {
      createRole({
        variables: {
          data: {
            ...data,
            name: camelCase(data.displayName),

            app: { connect: { id: applicationId } },
          },
        },
      })
        .then((result) => {
          if (onRoleAdd) {
            onRoleAdd(result.data.createAppRole);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createRole, applicationId, inputRef, onRoleAdd]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.AppRole>) =>
          validate(values, FORM_SCHEMA)
        }
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        <Form>
          <TextField
            required
            name="displayName"
            label="New Role Name"
            disabled={loading}
            inputRef={inputRef}
            autoFocus
            trailingButton={{ icon: "add", title: "Add Role" }}
            hideLabel
            placeholder="Type role name"
          />
        </Form>
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewRole;

type RouteParams = {
  application?: string;
  entity?: string;
};

const CREATE_ROLE = gql`
  mutation createAppRole($data: AppRoleCreateInput!) {
    createAppRole(data: $data) {
      id
      name
      displayName
      description
    }
  }
`;

const NEW_ROLE_FRAGMENT = gql`
  fragment NewAppRole on AppRole {
    id
    name
    displayName
    description
  }
`;
