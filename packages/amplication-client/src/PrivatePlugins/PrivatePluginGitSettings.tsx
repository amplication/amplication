import { useCallback, useContext } from "react";
import { AppContext, useAppContext } from "../context/appContext";
import ServiceConfigurationGitSettings from "../Resource/git/ServiceConfigurationGitSettings";

const PrivatePluginGitSettings = () => {
  const { refreshCurrentWorkspace, pluginRepositoryResource } =
    useContext(AppContext);

  const { reloadResources } = useAppContext();

  const handleOnDone = useCallback(() => {
    refreshCurrentWorkspace();
  }, [refreshCurrentWorkspace]);

  const handleRepositorySelected = useCallback(() => {
    refreshCurrentWorkspace();
    reloadResources();
  }, [refreshCurrentWorkspace, reloadResources]);

  return (
    <ServiceConfigurationGitSettings
      resource={pluginRepositoryResource}
      onDone={handleOnDone}
      gitRepositorySelectedCb={handleRepositorySelected}
      gitRepositoryCreatedCb={handleRepositorySelected}
    />
  );
};

export default PrivatePluginGitSettings;
