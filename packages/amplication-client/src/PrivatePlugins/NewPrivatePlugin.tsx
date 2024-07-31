import { useCallback, useContext, useRef, useState } from "react";
import { Formik, Form } from "formik";
import { isEmpty } from "lodash";
import classNames from "classnames";
import { Snackbar, TextField } from "@amplication/ui/design-system";
import { formatError } from "../util/error";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";
import "./NewPrivatePlugin.scss";
import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import usePrivatePlugin from "./hooks/usePrivatePlugin";

const INITIAL_VALUES: Partial<models.PrivatePlugin> = {
  pluginId: "",
  displayName: "",
  description: "",
};

type Props = {
  resourceId: string;
  onPrivatePluginAdd?: (privatePlugin: models.PrivatePlugin) => void;
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
const CLASS_NAME = "new-private-plugin";

const prepareName = (displayName: string) => {
  return displayName
    .toLowerCase() // Convert to lowercase
    .replace(/[ ]/g, ".") // Replace spaces with dots
    .replace(/[^a-zA-Z0-9._-]/g, ""); // Remove all non-legit characters
};

const NewPrivatePlugin = ({ onPrivatePluginAdd, resourceId }: Props) => {
  const { trackEvent } = useTracking();
  const { addEntity } = useContext(AppContext);

  const {
    createPrivatePlugin,
    createPrivatePluginError: error,
    createPrivatePluginLoading: loading,
  } = usePrivatePlugin(resourceId);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      trackEvent({ eventName: AnalyticsEventNames.PrivatePluginCreate });
      setAutoFocus(true);
      createPrivatePlugin({
        variables: {
          data: {
            ...data,
            pluginId: prepareName(data.displayName),
            enabled: true,
            resource: { connect: { id: resourceId } },
          },
        },
      })
        .then((result) => {
          if (onPrivatePluginAdd) {
            onPrivatePluginAdd(result.data.createPrivatePlugin);
          }
          addEntity(result.data.createPrivatePlugin.id);
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createPrivatePlugin, resourceId, onPrivatePluginAdd, addEntity, trackEvent]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.PrivatePlugin>) =>
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
              label="New Private Plugin Name"
              disabled={loading}
              inputRef={inputRef}
              placeholder="Add private Plugin"
              autoComplete="off"
              autoFocus={autoFocus}
              hideLabel
              className={`${CLASS_NAME}__add-field__text`}
            />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="plus"
              disabled={loading}
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

export default NewPrivatePlugin;
