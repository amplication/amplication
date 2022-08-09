import { TextField, Snackbar } from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import { match } from "react-router-dom";
import "./ApplicationDatabaseSettingsForms.scss";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "./resourceSettings/GenerationSettingsForm";
import useSettingsHook from "./useSettingsHook";
import { AppContext } from "../context/appContext";

type Props = {
  match: match<{ resource: string }>;
};

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const CLASS_NAME = "application-database-settings-form";

function ApplicationDatabaseSettingsForms({ match }: Props) {
  const resourceId = match.params.resource;
  const { data, error } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });
  const { addBlock } = useContext(AppContext);
  const { trackEvent } = useTracking();

  const [updateResourceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_SERVICE_SETTINGS,
    {
      onCompleted: (data) => {
        addBlock(data.updateServiceSettings.id);
      },
    }
  );

  const { handleSubmit, SERVICE_CONFIG_FORM_SCHEMA } = useSettingsHook({
    trackEvent,
    resourceId,
    updateResourceSettings,
  });

  const errorMessage = formatError(error || updateError);
  return (
    <div className={CLASS_NAME}>
      {data?.serviceSettings && (
        <Formik
          initialValues={data.serviceSettings}
          validate={(values: models.ServiceSettings) =>
            validate(values, SERVICE_CONFIG_FORM_SCHEMA)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Database Settings</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  All the below settings will appear in clear text in the
                  generated resource. <br />
                  It should only be used for the development environment
                  variables and should not include sensitive data.
                </p>
                <FormikAutoSave debounceMS={2000} />
                <div className={`${CLASS_NAME}__formWrapper`}>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbHost"
                    autoComplete="off"
                    label="Host"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbName"
                    autoComplete="off"
                    label="Database Name"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbPort"
                    type="number"
                    autoComplete="off"
                    label="Port"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbUser"
                    autoComplete="off"
                    label="User"
                  />
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="dbPassword"
                    autoComplete="off"
                    label="Password"
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default ApplicationDatabaseSettingsForms;
