import * as models from "../models";
import { useCallback } from "react";

interface ProjectSettingsHookParams {
  trackEvent: (event: { eventName: string; [key: string]: any }) => void;
  resourceId: string;
  updateResourceSettings: any;
}

const PROJECT_CONFIG_FORM_SCHEMA = {
  properties: {
    baseDirectory: {
      type: "string",
    },
  },
  required: ["baseDirectory"],
};

const useProjectConfigSettingsHook = ({
  trackEvent,
  resourceId,
  updateResourceSettings,
}: ProjectSettingsHookParams) => {
  const handleSubmit = useCallback(
    (data: models.ProjectConfigurationSettings) => {
      const { baseDirectory } = data;
      trackEvent({
        eventName: "updateProjectConfigurationsSettings",
      });
      updateResourceSettings({
        variables: {
          data: {
            baseDirectory,
          },
          resourceId,
        },
      }).catch(console.error);
    },
    [updateResourceSettings, resourceId, trackEvent]
  );

  return {
    handleSubmit,
    PROJECT_CONFIG_FORM_SCHEMA,
  };
};

export default useProjectConfigSettingsHook;
