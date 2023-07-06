import {
  Snackbar,
  Panel,
  EnumPanelStyle,
  TextField,
} from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import "./GenerationSettingsForm.scss";
import useSettingsHook from "../useSettingsHook";
import { UPDATE_SERVICE_SETTINGS } from "./GenerationSettingsForm";
import { AppContext } from "../../context/appContext";
import useResources from "../../Workspaces/hooks/useResources";

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const CLASS_NAME = "generation-settings-form";

// eslint-disable-next-line @typescript-eslint/ban-types
const DirectoriesServiceSettingsForm: React.FC<{}> = () => {
  const {
    currentResource,
    addBlock,
    addEntity,
    currentProject,
    currentWorkspace,
  } = useContext(AppContext);
  const { useResourceSettings } = useResources(
    currentWorkspace,
    currentProject,
    addBlock,
    addEntity
  );
  const { data, error, refetch } = useResourceSettings(currentResource?.id);

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
    refetch,
  });

  return (
    <div className={CLASS_NAME}>
      {data && (
        <Formik
          initialValues={data}
          validate={(values: models.ServiceSettings) =>
            validate(values, SERVICE_CONFIG_FORM_SCHEMA)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {() => {
            return (
              <Form>
                <div className={`${CLASS_NAME}__header`}>
                  <h3>Base directories</h3>
                </div>
                <FormikAutoSave debounceMS={1000} />
                <Panel panelStyle={EnumPanelStyle.Transparent}>
                  <h2>Server</h2>
                  <TextField
                    className={`${CLASS_NAME}__formWrapper_field`}
                    name="serverSettings[serverPath]"
                    placeholder="packages/[SERVICE-NAME]"
                    label="Server base directory"
                    value={data.serverSettings.serverPath || ""}
                    helpText={data.serverSettings.serverPath}
                    labelType="normal"
                  />
                </Panel>
                {data.adminUISettings.generateAdminUI && (
                  <Panel panelStyle={EnumPanelStyle.Transparent}>
                    <h2>Admin UI</h2>
                    <TextField
                      className={`${CLASS_NAME}__formWrapper_field`}
                      name="adminUISettings[adminUIPath]"
                      placeholder="packages/[SERVICE-NAME]"
                      label="Admin UI base directory"
                      disabled={!data?.serverSettings.generateGraphQL}
                      value={data?.adminUISettings.adminUIPath || ""}
                      helpText={data.adminUISettings.adminUIPath}
                      labelType="normal"
                    />
                  </Panel>
                )}
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
};

export default DirectoriesServiceSettingsForm;
