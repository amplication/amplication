import * as models from "../models";
import { useCallback } from "react";
import { gql } from "@apollo/client";
import { useTracking } from "../util/analytics";

interface ProjectSettingsHookParams {
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
  resourceId,
  updateResourceSettings,
}: ProjectSettingsHookParams) => {
  const { trackEvent } = useTracking();

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

export const UPDATE_PROJECT_CONFIG_SETTINGS = gql`
  mutation updateProjectConfigurationsSettings(
    $data: ProjectConfigurationSettingsUpdateInput!
    $resourceId: String!
  ) {
    updateProjectConfigurationSettings(
      data: $data
      where: { id: $resourceId }
    ) {
      id
      baseDirectory
    }
  }
`;

export const GET_PROJECT_CONFIG_SETTINGS = gql`
  query projectConfigurationSettings($id: String!) {
    projectConfigurationSettings(where: { id: $id }) {
      id
      baseDirectory
    }
  }
`;
