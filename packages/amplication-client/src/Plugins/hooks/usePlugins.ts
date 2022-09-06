import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PLUGIN_INSTALLATIONS,
  CREATE_PLUGIN_INSTALLATION,
  UPDATE_PLUGIN_INSTALLATION,
} from "../queries/pluginsQueries";
import * as models from "../../models";
import { keyBy } from "lodash";
import { useContext, useMemo } from "react";
import { AppContext } from "../../context/appContext";

export type Plugin = {
  id: string;
  name: string;
  description: string;
  logo: string;
};

const PLUGINS: Plugin[] = [
  {
    id: "111",
    description:
      "description description description description description description",
    logo: "logo",
    name: "plugin name 1",
  },
  {
    id: "222",
    description:
      "description description description description description description",
    logo: "logo",
    name: "plugin name 2",
  },
  {
    id: "333",
    description:
      "description description description description description description",
    logo: "logo",
    name: "plugin name 3",
  },
];

const usePlugins = (resourceId: string) => {
  const { addBlock } = useContext(AppContext);

  const {
    data: pluginInstallations,
    loading: loadingPluginInstallations,
    error: errorPluginInstallations,
  } = useQuery<{
    PluginInstallations: models.PluginInstallation[];
  }>(GET_PLUGIN_INSTALLATIONS, {
    variables: {
      resourceId: resourceId,
    },
  });

  const pluginCatalog = useMemo(() => {
    return keyBy(PLUGINS, (plugin) => plugin.id);
  }, []);

  const [updatePluginInstallation, { error: updateError }] = useMutation<{
    updatePluginInstallation: models.PluginInstallation;
  }>(UPDATE_PLUGIN_INSTALLATION, {
    onCompleted: (data) => {
      addBlock(data.updatePluginInstallation.id);
    },
    refetchQueries: [
      {
        query: GET_PLUGIN_INSTALLATIONS,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  const [createPluginInstallation, { error: createError }] = useMutation<{
    createPluginInstallation: models.PluginInstallation;
  }>(CREATE_PLUGIN_INSTALLATION, {
    onCompleted: (data) => {
      addBlock(data.createPluginInstallation.id);
    },
    refetchQueries: [
      {
        query: GET_PLUGIN_INSTALLATIONS,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  return {
    pluginInstallations,
    loadingPluginInstallations,
    errorPluginInstallations,
    updatePluginInstallation,
    updateError,
    createPluginInstallation,
    createError,
    pluginCatalog,
  };
};

export default usePlugins;
