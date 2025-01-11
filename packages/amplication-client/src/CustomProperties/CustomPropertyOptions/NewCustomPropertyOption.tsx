import { Snackbar, TextField } from "@amplication/ui/design-system";
import classNames from "classnames";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import * as models from "../../models";
import { formatError } from "../../util/error";
import useCustomProperties from "../hooks/useCustomProperties";
import "./NewCustomPropertyOption.scss";

type Props = {
  customProperty: models.CustomProperty;
  onOptionAdd?: (property: models.CustomProperty) => void;
  disabled?: boolean;
};

const INITIAL_VALUES: Partial<models.CustomPropertyOption> = {
  value: "",
};

const CLASS_NAME = "new-dto-property";

const NewCustomPropertyOption = ({
  customProperty,
  onOptionAdd,
  disabled,
}: Props) => {
  const {
    createCustomPropertyOption,
    createCustomPropertyOptionError: error,
    createCustomPropertyOptionLoading: loading,
  } = useCustomProperties();

  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(false);

      createCustomPropertyOption({
        variables: {
          data: {
            ...data,
            customProperty: { connect: { id: customProperty.id } },
          },
        },
      })
        .catch(console.error)
        .then(() => {
          actions.resetForm(INITIAL_VALUES);
          setAutoFocus(true);

          if (onOptionAdd) {
            onOptionAdd(customProperty);
          }
        });
    },
    [createCustomPropertyOption, customProperty, onOptionAdd]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={`${CLASS_NAME}__add-field`}>
            <TextField
              required
              name="value"
              label="New Option "
              disabled={loading || disabled}
              placeholder="Add option"
              autoComplete="off"
              autoFocus={autoFocus}
              hideLabel
            />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="plus"
              disabled={loading || disabled}
              className={classNames(`${CLASS_NAME}__add-field__button`, {
                [`${CLASS_NAME}__add-field__button--show`]:
                  formik.values.value.length > 0,
              })}
            />
          </Form>
        )}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewCustomPropertyOption;
