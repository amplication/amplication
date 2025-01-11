import {
  Form,
  TextField,
  ToggleField,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../Components/DisplayNameField";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";
import CustomPropertyTypeSelectField from "./CustomPropertyTypeSelectField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";

type Props = {
  onSubmit: (values: models.CustomProperty) => void;
  defaultValues?: models.CustomProperty;
  disabled?: boolean;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "options",
];

const NON_VALIDATED_TYPES = [
  models.EnumCustomPropertyType.Select,
  models.EnumCustomPropertyType.MultiSelect,
];

export const INITIAL_VALUES: Partial<models.CustomProperty> = {
  name: "",
  description: "",
  required: false,
};

const FORM_SCHEMA = {
  required: ["name", "key"],

  errorMessage: {},
};

const CustomPropertyForm = ({ onSubmit, defaultValues, disabled }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.CustomProperty;
  }, [defaultValues]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values: models.CustomProperty) =>
          validate(values, FORM_SCHEMA)
        }
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <FormikAutoSave debounceMS={1000} />

            <DisplayNameField
              name="name"
              label="Name"
              minLength={1}
              disabled={disabled}
            />
            <TextField name="key" label="Key" disabled={disabled} />

            <OptionalDescriptionField
              name="description"
              label="Description"
              disabled={disabled}
            />
            <div>
              <ToggleField
                name="required"
                label="Required"
                disabled={disabled}
              />
            </div>
            <CustomPropertyTypeSelectField
              name="type"
              label="Type"
              disabled={disabled}
            />

            {!NON_VALIDATED_TYPES.includes(formik.values.type) && (
              <>
                <TabContentTitle
                  title="Validation"
                  subTitle="Use regex to validate the property value"
                />
                <TextField
                  name="validationRule"
                  label="Validation (Regex)"
                  placeholder="^.{4}$"
                  inputToolTip={{
                    content:
                      "Use regex to validate the property value. For example, ^.{4}$ will require the field to be 4 characters long.",
                  }}
                  disabled={disabled}
                />
                <TextField
                  name="validationMessage"
                  label="Validation Message"
                  placeholder="Field must be 4 characters long"
                  inputToolTip={{
                    content:
                      "The message that will be displayed if the validation fails.",
                  }}
                  disabled={disabled}
                />
              </>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CustomPropertyForm;
