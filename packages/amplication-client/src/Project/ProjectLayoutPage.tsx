import React, { useContext } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../context/appContext";
import {
  ResourceContextInterface,
  ResourceContextProvider,
} from "../context/resourceContext";
import OuterPageLayout from "../Layout/OuterPageLayout";
import PlatformDashboard from "../Platform/PlatformDashboard";
import useResourcePermissions from "../Resource/hooks/useResourcePermissions";
import ProjectMenu from "../Resource/ProjectMenu";
import { AppRouteProps } from "../routes/routesUtil";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import ResourceList from "../Workspaces/ResourceList";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const ProjectPlatformPage: React.FC<Props> = React.memo(
  ({ innerRoutes, match, moduleClass, tabRoutes, tabRoutesDef }) => {
    const { isPlatformConsole } = useProjectBaseUrl();

    //we use resource context for the project configuration resource to check permissions on the project level
    const { projectConfigurationResource } = useContext(AppContext);
    const permissions = useResourcePermissions(
      projectConfigurationResource?.id
    );
    const context: ResourceContextInterface = {
      resourceId: projectConfigurationResource?.id,
      resource: projectConfigurationResource,
      lastSuccessfulGitBuild: undefined,
      lastSuccessfulGitBuildPluginVersions: undefined,
      permissions,
    };

    return (
      <ResourceContextProvider newVal={context}>
        <OuterPageLayout
          className={moduleClass}
          menu={<ProjectMenu routeDefs={tabRoutesDef} />}
        >
          {match.isExact ? (
            isPlatformConsole ? (
              <PlatformDashboard />
            ) : (
              <ResourceList />
            )
          ) : (
            <>
              {tabRoutes}
              {innerRoutes}
            </>
          )}
        </OuterPageLayout>
      </ResourceContextProvider>
    );
  }
);

export default ProjectPlatformPage;
