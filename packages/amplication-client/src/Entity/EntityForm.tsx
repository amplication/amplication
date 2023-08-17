import React, { useMemo } from "react";
import { Formik } from "formik";
import * as models from "../models";
import { TextField } from "@amplication/ui/design-system";
import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import { Form } from "../Components/Form";
import FormikAutoSave from "../util/formikAutoSave";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import { isEqual } from "../util/customValidations";
import useResource from "../Resource/hooks/useResource";

// This must be here unless we get rid of deepdash as it does not support ES imports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const omitDeep = require("deepdash/omitDeep");

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

const { AT_LEAST_TWO_CHARARCTERS } = validationErrorMessages;

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
  errorMessage: {
    properties: {
      displayName: AT_LEAST_TWO_CHARARCTERS,
      name: AT_LEAST_TWO_CHARARCTERS,
      pluralDisplayName: AT_LEAST_TWO_CHARARCTERS,
    },
  },
};

const EQUAL_PLURAL_DISPLAY_NAME_AND_NAME_TEXT =
  "Name and plural display names cannot be equal. The ‘plural display name’ field must be in a plural form and ‘name’ field must be in a singular form";

const CLASS_NAME = "entity-form";

const EntityForm = React.memo(({ entity, resourceId, onSubmit }: Props) => {
  const { resourceSettings } = useResource(resourceId);
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
                  disabled={
                    resourceSettings?.serviceSettings?.authEntityName ===
                    entity?.name
                  }
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
                <TextField
                  autoComplete="off"
                  placeholder="Custom Prisma attributes"
                  inputToolTip={{
                    content: (
                      <span>
                        Add custom attributes to model using the format
                        @@attribute([parameters]) or @@attribute().
                        <br />
                        <br /> For example:
                        <br />
                        @@index([field_1, field_2]) <br />
                        @@map("modelName")
                      </span>
                    ),
                  }}
                  textarea
                  rows={3}
                  name="customAttributes"
                  label="Custom Attributes"
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
