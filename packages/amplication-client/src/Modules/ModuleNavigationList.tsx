import {
  CircularProgress,
  HorizontalRule,
  NavigationFilter,
  NavigationFilterItem,
  Snackbar,
  VerticalNavigation,
  VerticalNavigationItem,
} from "@amplication/ui/design-system";
import React, { useCallback, useState } from "react";
import { formatError } from "../util/error";
import { ModuleNavigationListItem } from "./ModuleNavigationListItem";

import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import useModule from "./hooks/useModule";

type Props = {
  resourceId: string;
};

export type ModulesFilter = {
  showDefaultObjects: boolean;
  showCustomObjects: boolean;
  showActions: boolean;
  showDTOs: boolean;
  showPendingChangeOnly: boolean;
};

export const DATE_CREATED_FIELD = "createdAt";

const ModuleNavigationList: React.FC<Props> = ({ resourceId }) => {
  const [error, setError] = useState<Error>();
  const [filters, setFilters] = useState<ModulesFilter>({
    showDefaultObjects: true,
    showCustomObjects: true,
    showActions: true,
    showDTOs: true,
    showPendingChangeOnly: false,
  });

  const { baseUrl } = useResourceBaseUrl();

  const {
    findModulesData: data,
    findModulesError: errorLoading,
    findModulesLoading: loading,
  } = useModule();

  const errorMessage =
    (errorLoading && formatError(errorLoading)) ||
    (error && formatError(error));

  const handleShowDefaultObjects = useCallback(() => {
    setFilters((filters) => ({
      ...filters,
      showDefaultObjects: !filters.showDefaultObjects,
    }));
  }, []);

  const handleShowCustomObjects = useCallback(() => {
    setFilters((filters) => ({
      ...filters,
      showCustomObjects: !filters.showCustomObjects,
    }));
  }, []);

  const handleShowActions = useCallback(() => {
    setFilters((filters) => ({
      ...filters,
      showActions: !filters.showActions,
    }));
  }, []);

  const handleShowDTOs = useCallback(() => {
    setFilters((filters) => ({
      ...filters,
      showDTOs: !filters.showDTOs,
    }));
  }, []);

  return (
    <>
      {loading && <CircularProgress centerToParent />}
      <>
        <NavigationFilter>
          <NavigationFilterItem
            tooltip="Default Actions and DTOs"
            tooltipDirection="se"
            selected={filters.showDefaultObjects}
            onClick={handleShowDefaultObjects}
          >
            Default
          </NavigationFilterItem>
          <NavigationFilterItem
            tooltip="Custom Actions and DTOs"
            tooltipDirection="s"
            selected={filters.showCustomObjects}
            onClick={handleShowCustomObjects}
          >
            Custom
          </NavigationFilterItem>
          <NavigationFilterItem
            tooltip="Show Actions"
            tooltipDirection="sw"
            selected={filters.showActions}
            onClick={handleShowActions}
          >
            Actions
          </NavigationFilterItem>
          <NavigationFilterItem
            tooltip="Show DTOs"
            tooltipDirection="sw"
            selected={filters.showDTOs}
            onClick={handleShowDTOs}
          >
            DTOs
          </NavigationFilterItem>
        </NavigationFilter>

        <VerticalNavigation>
          <VerticalNavigationItem icon={"box"} to={`${baseUrl}/modules`}>
            All Modules
          </VerticalNavigationItem>
          <HorizontalRule />
          {data?.modules.map((module) => (
            <ModuleNavigationListItem
              key={module.id}
              module={module}
              onError={setError}
              filters={filters}
            />
          ))}
        </VerticalNavigation>
      </>

      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
};

export default ModuleNavigationList;
