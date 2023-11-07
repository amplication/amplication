import {
  VerticalNavigation,
  VerticalNavigationItem,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { ModuleActionLinkList } from "../ModuleActions/ModuleActionLinkList";
import { AppContext } from "../context/appContext";
import * as models from "../models";

type Props = {
  module: models.Module;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

export const ModuleListItem = ({ module, onDelete, onError }: Props) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  return (
    currentResource && (
      <>
        <VerticalNavigationItem
          icon={"box"}
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}`}
          expandable
          childItems={
            <>
              <ModuleActionLinkList
                resourceId={currentResource?.id}
                moduleId={module.id}
              />
              {/* <VerticalNavigationItem
                expandable
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/actions`}
                icon="api"
                childItems={
                  <ModuleActionLinkList
                    resourceId={currentResource?.id}
                    moduleId={module.id}
                  />
                }
              >
                Actions
              </VerticalNavigationItem>
              <VerticalNavigationItem
                expandable
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/types`}
                icon="zap"
              >
                Types
              </VerticalNavigationItem> */}
            </>
          }
        >
          <span>{module.name}</span>
        </VerticalNavigationItem>
      </>
    )
  );
};