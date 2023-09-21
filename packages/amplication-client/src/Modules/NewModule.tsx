import { Snackbar, TextField } from "@amplication/ui/design-system";
import classNames from "classnames";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import { pascalCase } from "pascal-case";
import { useCallback, useContext, useRef, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import "./NewModule.scss";
import useModule from "./hooks/useModule";

const INITIAL_VALUES: Partial<models.Module> = {
  name: "",
  displayName: "",
  description: "",
};

type Props = {
  resourceId: string;
  onModuleAdd?: (module: models.Module) => void;
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};
const CLASS_NAME = "new-module";

const prepareName = (displayName: string) => {
  return pascalCase(displayName);
};

const NewModule = ({ onModuleAdd, resourceId }: Props) => {
  const { trackEvent } = useTracking();
  const { addBlock } = useContext(AppContext);

  const { createModule, createModuleError, createModuleLoading } = useModule();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(true);
      const name = prepareName(data.displayName);
      createModule({
        variables: {
          data: {
            ...data,
            displayName: name,
            name,
            resource: { connect: { id: resourceId } },
          },
        },
      })
        .then((result) => {
          if (onModuleAdd) {
            onModuleAdd(result.data.createModule);
          }
          addBlock(result.data.createModule.id);
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createModule, resourceId, onModuleAdd, addBlock, trackEvent]
  );

  const errorMessage = formatError(createModuleError);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.Module>) =>
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
              label="New Module Name"
              disabled={createModuleLoading}
              inputRef={inputRef}
              placeholder="Add module"
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
      <Snackbar open={Boolean(createModuleError)} message={errorMessage} />
    </div>
  );
};

export default NewModule;
