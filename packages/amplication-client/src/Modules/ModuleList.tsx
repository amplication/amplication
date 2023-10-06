import {
  CircularProgress,
  Dialog,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";
import PageContent from "../Layout/PageContent";
import * as models from "../models";
import { formatError } from "../util/error";
import { ModuleListItem } from "./ModuleListItem";
import NewModule from "./NewModule";

import { Button, EnumButtonStyle } from "../Components/Button";
import { pluralize } from "../util/pluralize";
import useModule from "./hooks/useModule";
const TITLE = "Modules";
const SUB_TITLE =
  "Modules are used to group services, actions, DTOs and other code components.";
type Props = {
  resourceId: string;
};

export const DATE_CREATED_FIELD = "createdAt";

const ModuleList: React.FC<Props> = ({ resourceId }) => {
  const pageTitle = "Modules";
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [newModule, setNewModule] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const {
    findModules,
    findModulesData: data,
    findModulesError: errorLoading,
    findModulesLoading: loading,
  } = useModule();

  useEffect(() => {
    findModules({
      variables: {
        where: {
          resource: { id: resourceId },
          displayName:
            searchPhrase !== ""
              ? {
                  contains: searchPhrase,
                  mode: models.QueryMode.Insensitive,
                }
              : undefined,
        },
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
      },
    });
  }, [resourceId, searchPhrase, findModules]);

  const handleNewModuleClick = useCallback(() => {
    setNewModule(!newModule);
  }, [newModule, setNewModule]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const errorMessage =
    (errorLoading && formatError(errorLoading)) ||
    (error && formatError(error));

  return (
    <PageContent
      pageTitle={pageTitle}
      contentTitle={TITLE}
      contentSubTitle={SUB_TITLE}
    >
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
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                onClick={handleNewModuleClick}
              >
                Add Module
              </Button>
            </FlexItem>
          </FlexItem.FlexEnd>
        </FlexItem>

        <HorizontalRule doubleSpacing />

        {loading && <CircularProgress centerToParent />}
        <>
          <FlexItem margin={EnumFlexItemMargin.Bottom}>
            <Text textStyle={EnumTextStyle.Tag}>
              {data?.Modules.length}{" "}
              {pluralize(data?.Modules.length, "Module", "Modules")}
            </Text>
          </FlexItem>

          <List>
            {data?.Modules.map((module) => (
              <ModuleListItem
                key={module.id}
                module={module}
                onError={setError}
              />
            ))}
          </List>
        </>

        <Snackbar
          open={Boolean(error || errorLoading)}
          message={errorMessage}
        />
      </>
    </PageContent>
  );
};

export default ModuleList;
