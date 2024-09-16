import { useCallback, useContext } from "react";
import { AppContext } from "../context/appContext";
import ServiceConfigurationGitSettings from "../Resource/git/ServiceConfigurationGitSettings";

const PrivatePluginGitSettings = () => {
  const { refreshCurrentWorkspace, pluginRepositoryResource } =
    useContext(AppContext);

  const handleOnDone = useCallback(() => {
    refreshCurrentWorkspace();
  }, [refreshCurrentWorkspace]);

  const handleRepositorySelected = useCallback(() => {
    refreshCurrentWorkspace();
  }, [refreshCurrentWorkspace]);

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
