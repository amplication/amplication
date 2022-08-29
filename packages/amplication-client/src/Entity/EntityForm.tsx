import React, { useMemo } from "react";
import { Formik } from "formik";

import omitDeep from "deepdash-es/omitDeep";

import * as models from "../models";
import { TextField } from "@amplication/design-system";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import { Form } from "../Components/Form";
import FormikAutoSave from "../util/formikAutoSave";
import { USER_ENTITY } from "./constants";
import { validate } from "../util/formikValidateJsonSchema";
import { isEqual } from "../util/customValidations";

type EntityInput = Omit<models.Entity, "fields" | "versionNumber">;

type Props = {
  entity?: models.Entity;
  resourceId: string;
  onSubmit: (entity: EntityInput) => void;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "versionNumber",
  "fields",
  "permissions",
  "lockedAt",
  "lockedByUser",
  "lockedByUserId",
  "__typename",
];

const FORM_SCHEMA = {
  required: ["name", "displayName", "pluralDisplayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
    name: {
      type: "string",
      minLength: 2,
    },
    pluralDisplayName: {
      type: "string",
      minLength: 2,
    },
  },
};

const EQUAL_PLURAL_DISPLAY_NAME_AND_NAME_TEXT =
  "Name and plural display names cannot be equal. The ‘plural display name’ field must be in a plural form and ‘name’ field must be in a singular form";

const CLASS_NAME = "entity-form";

const EntityForm = React.memo(({ entity, resourceId, onSubmit }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omitDeep(
      {
        ...entity,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return sanitizedDefaultValues as EntityInput;
  }, [entity]);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          if (isEqual(values.name, values.pluralDisplayName)) {
            return {
              pluralDisplayName: EQUAL_PLURAL_DISPLAY_NAME_AND_NAME_TEXT,
            };
          }
          return validate(values, FORM_SCHEMA);
        }}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form childrenAsBlocks>
              <>
                <FormikAutoSave debounceMS={1000} />

                <DisplayNameField name="displayName" label="Display Name" />

                <NameField
                  name="name"
                  disabled={USER_ENTITY === entity?.name}
                  capitalized
                />
                <TextField
                  name="pluralDisplayName"
                  label="Plural Display Name"
                />
                <TextField
                  autoComplete="off"
                  textarea
                  rows={3}
                  name="description"
                  label="Description"
                />
              </>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
});

export default EntityForm;
