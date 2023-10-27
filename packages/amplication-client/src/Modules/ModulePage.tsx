import { useContext, useEffect } from "react";
import { match } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import "./Module.scss";
import useModule from "./hooks/useModule";
import Module from "./Module";
import { ModuleActionLinkList } from "../ModuleActions/ModuleActionLinkList";

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

  return match.isExact ? <Module /> : innerRoutes;
};

export default ModulePage;
