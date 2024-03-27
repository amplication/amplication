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
import useModuleDto from "./hooks/useModuleDto";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
};

export const ModuleDtoLinkList = React.memo(
  ({ moduleId, resourceId }: Props) => {
    const { currentWorkspace, currentProject } = useContext(AppContext);

    const {
      findModuleDtos,
      findModuleDtosData: data,
      findModuleDtosError: errorLoading,
      findModuleDtosLoading: loading,
    } = useModuleDto();

    useEffect(() => {
      findModuleDtos({
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
    }, [moduleId, findModuleDtos, resourceId]);

    const errorMessage = formatError(errorLoading);

    return (
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <VerticalNavigation>
            {data?.moduleDtos.map((dto) => (
              <VerticalNavigationItem
                key={dto.id}
                icon="zap"
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/dtos/${dto.id}`}
              >
                <FlexItem
                  itemsAlign={EnumItemsAlign.Center}
                  end={<EnabledIndicator enabled={dto.enabled} />}
                  singeChildWithEllipsis
                >
                  {dto.name}
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
