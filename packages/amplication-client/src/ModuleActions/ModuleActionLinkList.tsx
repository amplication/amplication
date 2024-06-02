import {
  CircularProgress,
  EnabledIndicator,
  EnumItemsAlign,
  FlexItem,
  Snackbar,
  VerticalNavigation,
  VerticalNavigationItem,
} from "@amplication/ui/design-system";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import useModuleAction from "./hooks/useModuleAction";
import { ModulesFilter } from "../Modules/ModuleNavigationList";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
  filters: ModulesFilter;
};

export const ModuleActionLinkList = React.memo(
  ({ moduleId, resourceId, filters }: Props) => {
    const { currentWorkspace, currentProject } = useContext(AppContext);

    const {
      findModuleActions,
      findModuleActionsData: data,
      findModuleActionsError: errorLoading,
      findModuleActionsLoading: loading,
    } = useModuleAction();

    useEffect(() => {
      findModuleActions({
        variables: {
          where: {
            parentBlock: { id: moduleId },
            resource: { id: resourceId },
            displayName: undefined,
            includeDefaultActions: filters.showDefaultObjects,
            includeCustomActions: filters.showCustomObjects,
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        },
      });
    }, [moduleId, findModuleActions, resourceId, filters]);

    const errorMessage = formatError(errorLoading);

    return (
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <VerticalNavigation>
            {data?.moduleActions.map((action) => (
              <VerticalNavigationItem
                key={action.id}
                icon="api"
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/actions/${action.id}`}
              >
                <FlexItem
                  itemsAlign={EnumItemsAlign.Center}
                  end={<EnabledIndicator enabled={action.enabled} />}
                  singeChildWithEllipsis
                >
                  {action.displayName}
                </FlexItem>
              </VerticalNavigationItem>
            ))}
          </VerticalNavigation>
        )}

        <Snackbar open={Boolean(errorLoading)} message={errorMessage} />
      </>
    );
  }
);
