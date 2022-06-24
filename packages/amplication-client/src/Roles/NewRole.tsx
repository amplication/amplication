import React, { useCallback, useRef, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { Formik, Form } from "formik";
import { isEmpty } from "lodash";
import classNames from "classnames";
import { camelCase } from "camel-case";
import { TextField, Snackbar } from "@amplication/design-system";
import { formatError } from "../util/error";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";
import "./NewRole.scss";

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
const CLASS_NAME = "new-role";

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
  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(true);
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
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.AppRole>) =>
          validate(values, FORM_SCHEMA)
        }
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={`${CLASS_NAME}__add-field`}>
            <TextField
              required
              name="displayName"
              label="New Role Name"
              disabled={loading}
              inputRef={inputRef}
              placeholder="Add role"
              autoComplete="off"
              autoFocus={autoFocus}
              hideLabel
              className={`${CLASS_NAME}__add-field__text`}
            />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="plus"
              className={classNames(`${CLASS_NAME}__add-field__button`, {
                [`${CLASS_NAME}__add-field__button--show`]: !isEmpty(
                  formik.values.displayName
                ),
              })}
            />
          </Form>
        )}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewRole;

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
