import React, { useContext } from "react";
import * as models from "../../models";
import "./GenerationSettingsForm.scss";
import { AppContext } from "../../context/appContext";
import { Form, Formik } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "./GenerationSettingsForm";
import { useTracking } from "../../util/analytics";
import useSettingsHook from "../useSettingsHook";
import EntitySelectField from "../../Components/EntitySelectField";
import FormikAutoSave from "../../util/formikAutoSave";

const CLASS_NAME = "generation-settings-form";

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

function AuthenticationSettingsForm() {
  const { currentResource, addBlock } = useContext(AppContext);
  const { data, error } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: currentResource?.id,
    },
  });
  const { trackEvent } = useTracking();

  const [updateResourceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_SERVICE_SETTINGS,
    {
      onCompleted: (data) => {
        addBlock(data.updateServiceSettings.id);
      },
    }
  );
  const resourceId = currentResource?.id;
  const { handleSubmit, SERVICE_CONFIG_FORM_SCHEMA } = useSettingsHook({
    trackEvent,
    resourceId,
    updateResourceSettings,
  });

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
                  <h3>Choose authentication entity</h3>
                </div>
                <FormikAutoSave debounceMS={200} />
                <EntitySelectField
                  label={"Entity List"}
                  name="authEntityName"
                  resourceId={resourceId}
                  isValueId={false}
                />
              </Form>
            );
          }}
        </Formik>
      )}
      {/* <Snackbar
        open={Boolean(error)}
        message={formatError(error || updateError)}
      /> */}
    </div>
  );
}

export default AuthenticationSettingsForm;
