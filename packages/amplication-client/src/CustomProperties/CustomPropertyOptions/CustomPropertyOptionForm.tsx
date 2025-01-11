import {
  ColorPickerField,
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
  Form,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import * as models from "../../models";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import "./CustomPropertyOptionForm.scss";
import CustomPropertyOptionValueField from "./CustomPropertyOptionValueField";

type Props = {
  onSubmit: (values: models.CustomPropertyOption) => void;
  onPropertyDelete?: (property: models.CustomPropertyOption) => void;
  onPropertyClose?: (property: models.CustomPropertyOption) => void;

  defaultValues?: models.CustomPropertyOption;
  disabled?: boolean;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.CustomPropertyOption> = {
  value: "",
};

const FORM_SCHEMA = {
  required: ["value"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const CLASS_NAME = "custom-property-option-form";

const CustomPropertyOptionForm = ({
  onSubmit,
  defaultValues,
  disabled,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      {
        ...defaultValues,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );

    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.CustomPropertyOption;
  }, [defaultValues]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values: models.CustomPropertyOption) =>
          validate(values, FORM_SCHEMA)
        }
        enableReinitialize
        onSubmit={onSubmit}
      >
        <div className={CLASS_NAME}>
          <Form>
            {!disabled && <FormikAutoSave debounceMS={1000} />}

            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              direction={EnumFlexDirection.Row}
            >
              <CustomPropertyOptionValueField disabled={disabled} />
              {!disabled && (
                <ColorPickerField
                  name="color"
                  iconOnlyMode
                  disabled={disabled}
                />
              )}
            </FlexItem>
          </Form>
        </div>
      </Formik>
    </>
  );
};

export default CustomPropertyOptionForm;
