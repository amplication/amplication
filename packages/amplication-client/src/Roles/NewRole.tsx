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

const INITIAL_VALUES: Partial<models.ResourceRole> = {
  name: "",
  displayName: "",
  description: "",
};

type Props = {
  resourceId: string;
  onRoleAdd?: (role: models.ResourceRole) => void;
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

const NewRole = ({ onRoleAdd, resourceId }: Props) => {
  const [createRole, { error, loading }] = useMutation(CREATE_ROLE, {
    update(cache, { data }) {
      if (!data) return;

      const newResourceRole = data.createResourceRole;

      cache.modify({
        fields: {
          resourceRoles(existingResourceRoleRefs = [], { readField }) {
            const newResourceRoleRef = cache.writeFragment({
              data: newResourceRole,
              fragment: NEW_ROLE_FRAGMENT,
            });

            if (
              existingResourceRoleRefs.some(
                (resourceRoleRef: Reference) =>
                  readField("id", resourceRoleRef) === newResourceRole.id
              )
            ) {
              return existingResourceRoleRefs;
            }

            return [...existingResourceRoleRefs, newResourceRoleRef];
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

            resource: { connect: { id: resourceId } },
          },
        },
      })
        .then((result) => {
          if (onRoleAdd) {
            onRoleAdd(result.data.createResourceRole);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createRole, resourceId, inputRef, onRoleAdd]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.ResourceRole>) =>
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
  mutation createResourceRole($data: ResourceRoleCreateInput!) {
    createResourceRole(data: $data) {
      id
      name
      displayName
      description
    }
  }
`;

const NEW_ROLE_FRAGMENT = gql`
  fragment NewResourceRole on ResourceRole {
    id
    name
    displayName
    description
  }
`;
