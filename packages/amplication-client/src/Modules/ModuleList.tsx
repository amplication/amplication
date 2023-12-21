import {
  CircularProgress,
  Dialog,
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
import { ModuleListItem } from "./ModuleListItem";
import NewModule from "./NewModule";

import { Button, EnumButtonStyle } from "../Components/Button";
import { pluralize } from "../util/pluralize";
import useModule from "./hooks/useModule";
import { AppContext } from "../context/appContext";

type Props = {
  resourceId: string;
};

export const DATE_CREATED_FIELD = "createdAt";

const ModuleList: React.FC<Props> = ({ resourceId }) => {
  const pageTitle = "Modules";
  const [newModule, setNewModule] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const {
    handleSearchChange,
    findModulesData: data,
    findModulesError: errorLoading,
    findModulesLoading: loading,
  } = useModule();

  const handleNewModuleClick = useCallback(() => {
    setNewModule(!newModule);
  }, [newModule, setNewModule]);

  const errorMessage =
    (errorLoading && formatError(errorLoading)) ||
    (error && formatError(error));

  return (
    <>
      <Dialog
        isOpen={newModule}
        onDismiss={handleNewModuleClick}
        title="New Module"
      >
        <NewModule resourceId={resourceId} onSuccess={handleNewModuleClick} />
      </Dialog>

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
            {/* <Button
              buttonStyle={EnumButtonStyle.Primary}
              onClick={handleNewModuleClick}
              disabled={true}
            >
              Add Module
            </Button> */}
          </FlexItem>
        </FlexItem.FlexEnd>
      </FlexItem>

      {loading && <CircularProgress centerToParent />}
      <>
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Tag}>
            {data?.Modules.length}{" "}
            {pluralize(data?.Modules.length, "Module", "Modules")}
          </Text>
        </FlexItem>
        <VerticalNavigation>
          <VerticalNavigationItem
            icon={"box"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/all`}
          >
            All
          </VerticalNavigationItem>
          {data?.Modules.map((module) => (
            <ModuleListItem
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

export default ModuleList;
