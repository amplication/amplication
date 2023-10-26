import * as models from "../models";
import { useCallback, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useTracking } from "../util/analytics";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type TData = {
  updateProjectConfigurationSettings: models.ProjectConfigurationSettings;
};

const PROJECT_CONFIG_FORM_SCHEMA = {
  properties: {
    baseDirectory: {
      type: "string",
    },
  },
  required: ["baseDirectory"],
};

const useProjectConfigSettingsHook = () => {
  const { trackEvent } = useTracking();
  const { addBlock, projectConfigurationResource } = useContext(AppContext);
  const projectConfigurationResourceId = projectConfigurationResource?.id;
  const {
    data: projectConfigurationData,
    error: projectConfigurationError,
    refetch,
  } = useQuery<{
    projectConfigurationSettings: models.ProjectConfigurationSettings;
  }>(GET_PROJECT_CONFIG_SETTINGS, {
    variables: {
      id: projectConfigurationResourceId,
    },
    skip: !projectConfigurationResourceId,
  });

  const [updateResourceSettings, { error: ProjectConfigurationUpdateError }] =
    useMutation<TData>(UPDATE_PROJECT_CONFIG_SETTINGS, {
      onCompleted: (data) => {
        refetch();
        addBlock(data.updateProjectConfigurationSettings.id);
      },
    });

  const handleSubmit = useCallback(
    (data: models.ProjectConfigurationSettings) => {
      const { baseDirectory } = data;
      trackEvent({
        eventName: AnalyticsEventNames.ProjectConfigurationsSettingsUpdate,
      });
      updateResourceSettings({
        variables: {
          data: {
            baseDirectory,
          },
          resourceId: projectConfigurationResourceId,
        },
      }).catch(console.error);
    },
    [updateResourceSettings, projectConfigurationResourceId, trackEvent]
  );

  return {
    handleSubmit,
    PROJECT_CONFIG_FORM_SCHEMA,
    ProjectConfigurationUpdateError,
    projectConfigurationData,
    projectConfigurationError,
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
