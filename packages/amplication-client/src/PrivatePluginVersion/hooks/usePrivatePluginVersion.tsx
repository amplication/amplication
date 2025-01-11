import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_PRIVATE_PLUGIN_VERSION,
  UPDATE_PRIVATE_PLUGIN_VERSION,
} from "../queries/privatePluginVersionQueries";

type TCreateVersionData = {
  createPrivatePluginVersion: models.PrivatePluginVersion;
};

type TUpdateVersionData = {
  updatePrivatePluginVersion: models.PrivatePluginVersion;
};

const useModuleDto = () => {
  const { addBlock, addEntity } = useContext(AppContext);

  const [
    createPrivatePluginVersion,
    {
      data: createPrivatePluginVersionData,
      error: createPrivatePluginVersionError,
      loading: createPrivatePluginVersionLoading,
    },
  ] = useMutation<TCreateVersionData>(CREATE_PRIVATE_PLUGIN_VERSION, {
    onCompleted: (data) => {
      addBlock(data.createPrivatePluginVersion.version);
    },
  });

  const [
    updatePrivatePluginVersion,
    {
      error: updatePrivatePluginVersionError,
      loading: updatePrivatePluginVersionLoading,
    },
  ] = useMutation<TUpdateVersionData>(UPDATE_PRIVATE_PLUGIN_VERSION, {
    onCompleted: (data) => {
      addEntity(data.updatePrivatePluginVersion.version);
    },
  });

  return {
    createPrivatePluginVersion,
    createPrivatePluginVersionData,
    createPrivatePluginVersionError,
    createPrivatePluginVersionLoading,
    updatePrivatePluginVersion,
    updatePrivatePluginVersionError,
    updatePrivatePluginVersionLoading,
  };
};

export default useModuleDto;
