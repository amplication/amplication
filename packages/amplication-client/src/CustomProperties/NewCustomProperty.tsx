import { Snackbar, TextField } from "@amplication/ui/design-system";
import classNames from "classnames";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import { useCallback, useRef, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  LicenseIndicatorContainer,
  LicensedResourceType,
} from "../Components/LicenseIndicatorContainer";
import * as models from "../models";
import { formatError } from "../util/error";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import useCustomProperties from "./hooks/useCustomProperties";
import "./NewCustomProperty.scss";

const INITIAL_VALUES: Partial<models.CustomProperty> = {
  name: "",
};

type Props = {
  onCustomPropertyAdd?: (customProperty: models.CustomProperty) => void;
  disabled?: boolean;
  blueprintId?: string;
};

const { AT_LEAST_TWO_CHARACTERS } = validationErrorMessages;

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
  errorMessage: {
    properties: {
      name: AT_LEAST_TWO_CHARACTERS,
    },
  },
};
const CLASS_NAME = "new-custom-property";

const NewCustomProperty = ({
  onCustomPropertyAdd,
  disabled,
  blueprintId,
}: Props) => {
  const {
    createCustomProperty,
    createCustomPropertyError: error,
    createCustomPropertyLoading: loading,
  } = useCustomProperties();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(true);
      createCustomProperty({
        variables: {
          data: {
            ...data,
            blueprint: blueprintId
              ? { connect: { id: blueprintId } }
              : undefined,
          },
        },
      })
        .then((result) => {
          if (onCustomPropertyAdd) {
            onCustomPropertyAdd(result.data.createCustomProperty);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [blueprintId, createCustomProperty, onCustomPropertyAdd]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.CustomProperty>) =>
          validate(values, FORM_SCHEMA)
        }
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={`${CLASS_NAME}__add-field`}>
            <TextField
              required
              name="name"
              label="New Property Name"
              disabled={loading || disabled}
              inputRef={inputRef}
              placeholder="Add Property"
              autoComplete="off"
              autoFocus={autoFocus}
              hideLabel
              className={`${CLASS_NAME}__add-field__text`}
            />
            <LicenseIndicatorContainer
              licensedResourceType={LicensedResourceType.Service}
            >
              <Button
                buttonStyle={EnumButtonStyle.Text}
                icon="plus"
                className={classNames(`${CLASS_NAME}__add-field__button`, {
                  [`${CLASS_NAME}__add-field__button--show`]: !isEmpty(
                    formik.values.displayName
                  ),
                })}
              />
            </LicenseIndicatorContainer>
          </Form>
        )}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewCustomProperty;
