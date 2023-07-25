import { useMutation, useQuery } from "@apollo/client";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "../resourceSettings/GenerationSettingsForm";
import * as models from "../../models";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

const useResource = (resourceId: string) => {
  const { addBlock } = useContext(AppContext);

  const { data: resourceSettings } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
    skip: !resourceId,
  });

  const [updateResourceSettings, { error: updateResourceSettingsError }] =
    useMutation<TData>(UPDATE_SERVICE_SETTINGS, {
      onCompleted: (data) => {
        addBlock(data.updateServiceSettings.id);
      },
    });

  return {
    resourceSettings,
    updateResourceSettings,
    updateResourceSettingsError,
  };
};

export default useResource;
