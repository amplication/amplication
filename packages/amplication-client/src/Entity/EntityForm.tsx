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
import { USER_ENTITY } from "./constants";
import { isEqual } from "../util/customValidations";
import * as Yup from "yup";

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

const { AT_LEAST_TWO_CHARARCTERS: AT_LEAST_TWO_CHARACTERS } =
  validationErrorMessages;

const SYMBOL_REGEX = new RegExp("^[a-zA-Z0-9\\s]+$");

const entitySchema = Yup.object().shape({
  displayName: Yup.string().min(2, AT_LEAST_TWO_CHARACTERS),
  name: Yup.string().min(2, AT_LEAST_TWO_CHARACTERS).matches(SYMBOL_REGEX),
  pluralDisplayName: Yup.string().min(2, AT_LEAST_TWO_CHARACTERS),
});

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
        }}
        validationSchema={entitySchema}
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
