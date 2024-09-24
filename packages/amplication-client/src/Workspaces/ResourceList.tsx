import {
  Button,
  CircularProgress,
  DataGrid,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
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
import { Link } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
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
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import NewServiceFromTemplateDialogWithUrlTrigger from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";
const LOCAL_STORAGE_KEY = "resource-list-view-mode";

const VIEW_CARDS = "Cards";
const VIEW_GRID = "Grid";

function ResourceList() {
  const { refreshData } = useStiggContext();
  const [error, setError] = useState<Error | null>(null);

  const { baseUrl: platformProjectBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const { resources, handleSearchChange, loadingResources, errorResources } =
    useContext(AppContext);

  const relevantResources = useMemo(() => {
    return resources.filter(
      (resource) =>
        resource.resourceType === models.EnumResourceType.Service ||
        resource.resourceType === models.EnumResourceType.MessageBroker
    );
  }, [resources]);

  const [viewMode, setViewMode] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    VIEW_CARDS
  );

  const servicesLength = useMemo(() => {
    return relevantResources.filter(
      (resource) => resource.resourceType === models.EnumResourceType.Service
    ).length;
  }, [relevantResources]);

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
      <NewServiceFromTemplateDialogWithUrlTrigger />
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
                {relevantResources.length}{" "}
                {pluralize(relevantResources.length, "Resource", "Resources")}
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
              <Link to={`${platformProjectBaseUrl}`}>
                <Button buttonStyle={EnumButtonStyle.Outline}>
                  View Templates
                </Button>
              </Link>
              <CreateResourceButton
                resourcesLength={relevantResources.length}
                servicesLength={servicesLength}
              />
            </FlexItem>
          </>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {loadingResources && <CircularProgress centerToParent />}

      {isEmpty(relevantResources) && !loadingResources ? (
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
                rows={relevantResources}
              ></DataGrid>
            </div>
          ) : (
            <List>
              {!loadingResources &&
                relevantResources.map((resource) => (
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
