import { useCallback, useContext } from "react";
import { AppContext, useAppContext } from "../context/appContext";
import ResourceGitSettingsWithOverride from "../Resource/git/ResourceGitSettingsWithOverride";

const PrivatePluginGitSettings = () => {
  const { refreshCurrentWorkspace, pluginRepositoryResource } =
    useContext(AppContext);

  const { reloadResources } = useAppContext();

  const handleRepositorySelected = useCallback(() => {
    refreshCurrentWorkspace();
    reloadResources();
  }, [refreshCurrentWorkspace, reloadResources]);

  return (
    <ResourceGitSettingsWithOverride
      resource={pluginRepositoryResource}
      gitRepositorySelectedCb={handleRepositorySelected}
      gitRepositoryCreatedCb={handleRepositorySelected}
    />
  );
};

export default PrivatePluginGitSettings;
