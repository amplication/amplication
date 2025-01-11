import {
  CircularProgress,
  EnabledIndicator,
  EnumItemsAlign,
  FlexItem,
  Snackbar,
  VerticalNavigation,
  VerticalNavigationItem,
} from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import * as models from "../models";
import { ModulesFilter } from "../Modules/ModuleNavigationList";
import { formatError } from "../util/error";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import useModuleDto from "./hooks/useModuleDto";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
  filters: ModulesFilter;
};

export const ModuleDtoLinkList = React.memo(
  ({ moduleId, resourceId, filters }: Props) => {
    const {
      findModuleDtos,
      findModuleDtosData: data,
      findModuleDtosError: errorLoading,
      findModuleDtosLoading: loading,
    } = useModuleDto();
    const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

    useEffect(() => {
      findModuleDtos({
        variables: {
          where: {
            parentBlock: { id: moduleId },
            resource: { id: resourceId },
            displayName: undefined,
            includeDefaultDtos: filters.showDefaultObjects,
            includeCustomDtos: filters.showCustomObjects,
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        },
      });
    }, [moduleId, findModuleDtos, resourceId, filters]);

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
                to={`${baseUrl}/modules/${moduleId}/dtos/${dto.id}`}
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
