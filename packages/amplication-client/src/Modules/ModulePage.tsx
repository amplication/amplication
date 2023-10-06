import { useContext, useEffect } from "react";
import { match } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import "./Module.scss";
import useModule from "./hooks/useModule";
import Module from "./Module";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module: string;
  }>;
};

const ModulePage = ({ match, innerRoutes }: Props) => {
  const { resource: resourceId, module: moduleId } = match?.params ?? {};
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { getModule, getModuleData: data } = useModule();

  useEffect(() => {
    if (!moduleId) return;
    getModule({
      variables: {
        moduleId,
      },
    }).catch(console.error);
  }, [moduleId, getModule]);

  return (
    <PageContent
      pageTitle={data?.Module.name}
      sideContent={
        <>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}`}
            icon="settings"
          >
            General Settings
          </InnerTabLink>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/types`}
            icon="lock"
          >
            Types
          </InnerTabLink>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/actions`}
            icon="option_set"
          >
            Actions
          </InnerTabLink>
        </>
      }
    >
      {match.isExact ? <Module /> : innerRoutes}
    </PageContent>
  );
};

export default ModulePage;
