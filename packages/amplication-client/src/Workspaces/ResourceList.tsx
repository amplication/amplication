import {
  CircularProgress,
  DataGrid,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  SearchField,
  Snackbar,
  Text,
  ToggleView,
} from "@amplication/ui/design-system";
import { useStiggContext } from "@stigg/react-sdk";
import { isEmpty } from "lodash";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CreateResourceButton from "../Components/CreateResourceButton";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import "./ResourceList.scss";
import { RESOURCE_LIST_COLUMNS } from "./ResourceListDataColumns";
import ResourceListItem from "./ResourceListItem";
import useLocalStorage from "react-use-localstorage";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

const VIEW_CARDS = "Cards";
const VIEW_GRID = "Grid";

function ResourceList() {
  const { refreshData } = useStiggContext();
  const [error, setError] = useState<Error | null>(null);

  const { resources, handleSearchChange, loadingResources, errorResources } =
    useContext(AppContext);

  const [viewMode, setViewMode] = useLocalStorage(VIEW_CARDS);

  const servicesLength = useMemo(() => {
    return resources.filter(
      (resource) => resource.resourceType === models.EnumResourceType.Service
    ).length;
  }, [resources]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    refreshData();
  }, []);

  const errorMessage =
    formatError(errorResources) || (error && formatError(error));

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
        start={
          <>
            <FlexItem
              gap={EnumGapSize.Large}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text textStyle={EnumTextStyle.Tag}>
                {resources.length}{" "}
                {pluralize(resources.length, "Resource", "Resources")}
              </Text>
              <SearchField
                label="search"
                placeholder="search"
                onChange={handleSearchChange}
              />
              <ToggleView
                values={[VIEW_CARDS, VIEW_GRID]}
                selectedValue={viewMode}
                onValueChange={(selectedValue) => setViewMode(selectedValue)}
              />
            </FlexItem>
          </>
        }
        end={
          <>
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              direction={EnumFlexDirection.Row}
            >
              <CreateResourceButton
                resourcesLength={resources.length}
                servicesLength={servicesLength}
              />
            </FlexItem>
          </>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {loadingResources && <CircularProgress centerToParent />}

      {isEmpty(resources) && !loadingResources ? (
        <EmptyState
          message="There are no resources to show"
          image={EnumImages.AddResource}
        />
      ) : (
        <>
          {viewMode === VIEW_GRID ? (
            <div className={`${CLASS_NAME}__grid-container`}>
              <DataGrid
                columns={RESOURCE_LIST_COLUMNS}
                rows={resources}
              ></DataGrid>
            </div>
          ) : (
            <List>
              {!loadingResources &&
                resources.map((resource) => (
                  <ResourceListItem key={resource.id} resource={resource} />
                ))}
            </List>
          )}
        </>
      )}

      <Snackbar
        open={Boolean(error || errorResources)}
        message={errorMessage}
        onClose={clearError}
      />
    </PageContent>
  );
}

export default ResourceList;
