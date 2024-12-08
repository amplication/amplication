import { useMutation, useQuery } from "@apollo/client";
import {
  GET_RESOURCE_SETTINGS,
  UPDATE_SERVICE_SETTINGS,
} from "../resourceSettings/GenerationSettingsForm";
import * as models from "../../models";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { SET_RESOURCE_OWNER } from "../../Workspaces/queries/resourcesQueries";

type TData = {
  updateServiceSettings: models.ServiceSettings;
};

type setOwnerData = {
  resourceOwnerShipId: string;
  userId?: string;
  teamId?: string;
};

const useResource = (resourceId: string) => {
  const { addBlock, reloadResources } = useContext(AppContext);

  const { data: serviceSettings } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
    skip: !resourceId,
  });

  const [updateServiceSettings, { error: updateServiceSettingsError }] =
    useMutation<TData>(UPDATE_SERVICE_SETTINGS, {
      onCompleted: (data) => {
        addBlock(data.updateServiceSettings.id);
      },
    });

  const [setResourceOwner] = useMutation<setOwnerData>(SET_RESOURCE_OWNER, {});

  return {
    serviceSettings,
    updateServiceSettings,
    updateServiceSettingsError,
    setResourceOwner,
  };
};

export default useResource;
