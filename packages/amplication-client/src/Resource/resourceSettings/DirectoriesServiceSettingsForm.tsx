import {
  EnumTextStyle,
  HorizontalRule,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import useSettingsHook from "../useSettingsHook";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "./GenerationSettingsForm";

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const CLASS_NAME = "generation-settings-form";

// eslint-disable-next-line @typescript-eslint/ban-types
const DirectoriesServiceSettingsForm: React.FC<{}> = () => {
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
                <FormikAutoSave debounceMS={1000} />
                <>
                  <Text textStyle={EnumTextStyle.H4}>Base Directories</Text>
                  <Text textStyle={EnumTextStyle.Tag}>
                    Set the base path where the generated code for the server
                    and Admin UI will be located. This will be the root
                    directory for your generated files.
                  </Text>
                  <HorizontalRule />
                  <TextField
                    name="serverSettings[serverPath]"
                    placeholder="packages/[SERVICE-NAME]"
                    label="Server base directory"
                    value={
                      data?.serviceSettings.serverSettings.serverPath || ""
                    }
                    labelType="normal"
                  />
                </>
                {data.serviceSettings.adminUISettings.generateAdminUI && (
                  <>
                    <TextField
                      name="adminUISettings[adminUIPath]"
                      placeholder="packages/[SERVICE-NAME]"
                      label="Admin UI base directory"
                      disabled={
                        !data?.serviceSettings.serverSettings.generateGraphQL
                      }
                      value={
                        data?.serviceSettings.adminUISettings.adminUIPath || ""
                      }
                      labelType="normal"
                    />
                  </>
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
