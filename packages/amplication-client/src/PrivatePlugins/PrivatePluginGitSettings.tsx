import { useCallback, useContext } from "react";
import { AppContext, useAppContext } from "../context/appContext";
import ResourceGitSettingsWithOverride from "../Resource/git/ResourceGitSettingsWithOverride";
import PageContent from "../Layout/PageContent";

const PrivatePluginGitSettings = () => {
  const { refreshCurrentWorkspace, pluginRepositoryResource } =
    useContext(AppContext);

  const { reloadResources } = useAppContext();

  const handleRepositorySelected = useCallback(() => {
    refreshCurrentWorkspace();
    reloadResources();
  }, [refreshCurrentWorkspace, reloadResources]);

  return (
    <PageContent pageTitle="Git Settings">
      <ResourceGitSettingsWithOverride
        resource={pluginRepositoryResource}
        gitRepositorySelectedCb={handleRepositorySelected}
        gitRepositoryCreatedCb={handleRepositorySelected}
      />
    </PageContent>
  );
};

export default PrivatePluginGitSettings;
