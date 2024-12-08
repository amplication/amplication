import { useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { UPDATE_RESOURCE_SETTINGS } from "../queries/resourceSettingsQueries";
import { GET_RESOURCE } from "../../Workspaces/queries/resourcesQueries";

type TData = {
  updateResourceSettings: models.ResourceSettings;
};

const useResourceSettings = (resourceId?: string) => {
  const { addBlock } = useContext(AppContext);

  const [resourceSettings, setResourceSettings] =
    useState<models.ResourceSettings | null>(null);

  const { error: getResourceSettingsError, loading } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE, {
    variables: {
      id: resourceId,
    },
    skip: !resourceId,
    onCompleted: (data) => {
      setResourceSettings(data.resource.settings || null);
    },
  });

  const [
    updateResourceSettings,
    { error: updateError, loading: updateLoading },
  ] = useMutation<TData>(UPDATE_RESOURCE_SETTINGS, {
    onCompleted: (data) => {
      addBlock(data.updateResourceSettings.id);
    },
  });

  return {
    loading: loading || updateLoading,
    resourceSettings,
    getResourceSettingsError,
    updateResourceSettings,
    updateError,
  };
};

export default useResourceSettings;
