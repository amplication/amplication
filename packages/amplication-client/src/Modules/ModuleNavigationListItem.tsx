import { VerticalNavigationItem } from "@amplication/ui/design-system";
import { useContext } from "react";
import { ModuleActionLinkList } from "../ModuleActions/ModuleActionLinkList";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { ModuleDtoLinkList } from "../ModuleDto/ModuleDtoLinkList";
import { REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED } from "../env";
import { ModulesFilter } from "./ModuleNavigationList";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  module: models.Module;
  onDelete?: () => void;
  onError: (error: Error) => void;
  filters: ModulesFilter;
};

export const ModuleNavigationListItem = ({
  module,
  onDelete,
  onError,
  filters,
}: Props) => {
  const { currentResource } = useContext(AppContext);
  const { baseUrl } = useResourceBaseUrl();

  return (
    currentResource && (
      <>
        <VerticalNavigationItem
          icon={"box"}
          to={`${baseUrl}/modules/${module.id}`}
          expandable
          childItems={
            <>
              {filters.showActions && (
                <VerticalNavigationItem
                  expandable
                  to={`${baseUrl}/modules/${module.id}/actions`}
                  icon="api"
                  childItems={
                    <ModuleActionLinkList
                      resourceId={currentResource?.id}
                      moduleId={module.id}
                      filters={filters}
                    />
                  }
                >
                  Actions
                </VerticalNavigationItem>
              )}
              {REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED === "true" &&
                filters.showDTOs && (
                  <VerticalNavigationItem
                    expandable
                    to={`${baseUrl}/modules/${module.id}/dtos`}
                    icon="zap"
                    childItems={
                      <ModuleDtoLinkList
                        resourceId={currentResource?.id}
                        moduleId={module.id}
                        filters={filters}
                      />
                    }
                  >
                    DTOs
                  </VerticalNavigationItem>
                )}
            </>
          }
        >
          <span>{module.name}</span>
        </VerticalNavigationItem>
      </>
    )
  );
};
