import {
  CircularProgress,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  SearchField,
  Snackbar,
  Text,
  VerticalNavigation,
  VerticalNavigationItem,
} from "@amplication/ui/design-system";
import React, { useCallback, useContext, useState } from "react";
import { formatError } from "../util/error";
import { ModuleNavigationListItem } from "./ModuleNavigationListItem";
import NewModule from "./NewModule";

import { AppContext } from "../context/appContext";
import { pluralize } from "../util/pluralize";
import useModule from "./hooks/useModule";

type Props = {
  resourceId: string;
};

export const DATE_CREATED_FIELD = "createdAt";

const ModuleNavigationList: React.FC<Props> = ({ resourceId }) => {
  const [error, setError] = useState<Error>();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const {
    handleSearchChange,
    findModulesData: data,
    findModulesError: errorLoading,
    findModulesLoading: loading,
    findModuleRefetch: refetch,
  } = useModule();

  const errorMessage =
    (errorLoading && formatError(errorLoading)) ||
    (error && formatError(error));

  const handleModuleListChanged = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <FlexItem
        contentAlign={EnumContentAlign.Center}
        itemsAlign={EnumItemsAlign.Center}
        margin={EnumFlexItemMargin.Bottom}
      >
        <FlexItem.FlexStart>
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        </FlexItem.FlexStart>

        <FlexItem.FlexEnd>
          <FlexItem direction={EnumFlexDirection.Row}>
            <NewModule
              resourceId={resourceId}
              onModuleCreated={handleModuleListChanged}
            />
          </FlexItem>
        </FlexItem.FlexEnd>
      </FlexItem>

      {loading && <CircularProgress centerToParent />}
      <>
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Tag}>
            {data?.modules.length}{" "}
            {pluralize(data?.modules.length, "Module", "Modules")}
          </Text>
        </FlexItem>
        <VerticalNavigation>
          <VerticalNavigationItem
            icon={"box"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules`}
          >
            All
          </VerticalNavigationItem>
          {data?.modules.map((module) => (
            <ModuleNavigationListItem
              key={module.id}
              module={module}
              onError={setError}
            />
          ))}
        </VerticalNavigation>
      </>

      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
};

export default ModuleNavigationList;
