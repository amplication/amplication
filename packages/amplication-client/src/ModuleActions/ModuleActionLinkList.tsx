import {
  CircularProgress,
  EnabledIndicator,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";

import useModuleAction from "./hooks/useModuleAction";
import { Flex } from "@primer/react/lib/deprecated";

const CLASS_NAME = "module-action-link-list";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
};

export const ModuleActionLinkList = React.memo(
  ({ moduleId, resourceId }: Props) => {
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
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        },
      });
    }, [moduleId, findModuleActions]);

    const history = useHistory();

    const errorMessage = formatError(errorLoading);

    return (
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <div className={CLASS_NAME}>
            {data?.ModuleActions.map((action) => (
              <div key={action.id}>
                <InnerTabLink
                  icon="box"
                  to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/actions/${action.id}`}
                >
                  <FlexItem
                    itemsAlign={EnumItemsAlign.Center}
                    end={<EnabledIndicator enabled={action.enabled} />}
                  >
                    {action.displayName}
                  </FlexItem>
                </InnerTabLink>
              </div>
            ))}
          </div>
        )}

        <Snackbar open={Boolean(errorLoading)} message={errorMessage} />
      </>
    );
  }
);
