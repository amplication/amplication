import { SelectField, Snackbar } from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { match } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import "./ApplicationAuthSettingForm.scss";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "./resourceSettings/GenerationSettingsForm";
import useSettingsHook from "./useSettingsHook";

type Props = {
  match: match<{ resource: string }>;
};
type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const CLASS_NAME = "application-auth-settings-form";

function ApplicationAuthSettingForm({ match }: Props) {
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
                <FormikAutoSave debounceMS={2000} />
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Authentication Providers</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  Select the authentication method to be used in the generated
                  resource.
                </p>

                <div className={`${CLASS_NAME}__space`}>
                  <SelectField
                    label="Authentication provider"
                    name="authProvider"
                    options={Object.keys(models.EnumAuthProviderType).map(
                      (authProvider) => ({
                        label: authProvider,
                        value: authProvider,
                      })
                    )}
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

export default ApplicationAuthSettingForm;
