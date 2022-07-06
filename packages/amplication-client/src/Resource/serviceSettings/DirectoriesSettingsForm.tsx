import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  TextField,
} from "@amplication/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import { match } from "react-router-dom";
import PendingChangesContext from "../../VersionControl/PendingChangesContext";
import "./GenerationSettingsForm.scss";
import useSettingsHook from "../useSettingsHook";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "./GenerationSettingsForm";

type Props = {
  match: match<{ resource: string }>;
};

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const CLASS_NAME = "generation-settings-form";

function GenerationSettingsForm({ match }: Props) {
  const resourceId = match.params.resource;

  const { data, error } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });

  const pendingChangesContext = useContext(PendingChangesContext);

  const { trackEvent } = useTracking();

  const [updateServiceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_SERVICE_SETTINGS,
    {
      onCompleted: (data) => {
        pendingChangesContext.addBlock(data.updateServiceSettings.id);
      },
    }
  );

  const { handleSubmit, FORM_SCHEMA } = useSettingsHook({
    trackEvent,
    updateServiceSettings: updateServiceSettings,
    resourceId: resourceId,
  });

  return (
    <div className={CLASS_NAME}>
      {data?.serviceSettings && (
        <Formik
          initialValues={data.serviceSettings}
          validate={(values: models.ServiceSettings) =>
            validate(values, FORM_SCHEMA)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Base directories</h3>
                </div>
                <p className={`${CLASS_NAME}__description`}>
                  Enter the Server and Admin-UI directories, if required. This
                  will override the default directories.
                </p>
                <hr />
                <FormikAutoSave debounceMS={1000} />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Server</h2>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="serverSettings[serverPath]"
                    placeholder="packages/[SERVICE-NAME]"
                    label="Server base URL"
                    value={
                      data?.serviceSettings.serverSettings.serverPath || ""
                    }
                    helpText={data?.serviceSettings.serverSettings.serverPath}
                    labelType="normal"
                  />
                </Panel>
                <hr />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Admin UI</h2>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="adminUISettings[adminUIPath]"
                    placeholder="packages/[SERVICE-NAME]"
                    label="Admin UI base URL"
                    disabled={
                      !data?.serviceSettings.serverSettings.generateGraphQL
                    }
                    value={
                      data?.serviceSettings.adminUISettings.adminUIPath || ""
                    }
                    helpText={data?.serviceSettings.adminUISettings.adminUIPath}
                    labelType="normal"
                  />
                </Panel>
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar
        open={Boolean(error)}
        message={formatError(error || updateError)}
      />
    </div>
  );
}

export default GenerationSettingsForm;
