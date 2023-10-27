import { Icon, ListItem, Text } from "@amplication/ui/design-system";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import InnerTabLink from "../Layout/InnerTabLink";
import { ModuleActionLinkList } from "../ModuleActions/ModuleActionLinkList";

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
        <InnerTabLink
          icon={"box"}
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}`}
        >
          <span>{module.name}</span>
        </InnerTabLink>
        <div className="sub-list">
          <ModuleActionLinkList
            resourceId={currentResource?.id}
            moduleId={module.id}
          />
        </div>
      </>
    )
  );
};
