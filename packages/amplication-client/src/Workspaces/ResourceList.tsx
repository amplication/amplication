import {
  Button,
  CircularProgress,
  DataGrid,
  DataGridColumn,
  DataGridColumnFilter,
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
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import { AppContext, useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import "./ResourceList.scss";
import { RESOURCE_LIST_COLUMNS } from "./ResourceListDataColumns";
import ResourceListItem from "./ResourceListItem";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import NewServiceFromTemplateDialogWithUrlTrigger from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
import useDataGridColumnFilter from "../Layout/useDataGridColumnFilter";
import CustomPropertyValue from "../CustomProperties/CustomPropertyValue";
import { CustomPropertyFilters } from "../CustomProperties/CustomPropertyFilters";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";
const LOCAL_STORAGE_KEY = "resource-list-view-mode";

const VIEW_CARDS = "Cards";
const VIEW_GRID = "Grid";
const COLUMNS_LOCAL_STORAGE_KEY = "resource-list-columns";

function ResourceList() {
  const { refreshData } = useStiggContext();
  const [error, setError] = useState<Error | null>(null);

  const { customPropertiesMap } = useAppContext();

  const columnsWithAllProps = useMemo<DataGridColumn<models.Resource>[]>(() => {
    const propCols = Object.values(customPropertiesMap).map((property) => {
      return {
        key: property.key,
        name: property.name,
        resizable: true,
        sortable: true,
        hidden: false,
        renderCell: (props) => {
          return (
            <CustomPropertyValue
              propertyKey={property.key}
              allValues={props.row.properties}
            />
          );
        },
        getValue: (row) => {
          return row.properties && row.properties[property.key]
            ? row.properties[property.key]
            : "";
        },
      };
    });

    const lastCol = RESOURCE_LIST_COLUMNS[RESOURCE_LIST_COLUMNS.length - 1];
    const otherCols = RESOURCE_LIST_COLUMNS.slice(0, -1);

    return [...otherCols, ...propCols, lastCol];
  }, [customPropertiesMap]);

  const { columns, setColumns, onColumnsReorder } = useDataGridColumnFilter(
    columnsWithAllProps,
    COLUMNS_LOCAL_STORAGE_KEY
  );

  const { baseUrl: platformProjectBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const {
    resources,
    handleSearchChange,
    setResourcePropertiesFilter,
    loadingResources,
    errorResources,
  } = useContext(AppContext);

  const relevantResources = useMemo(() => {
    return resources.filter(
      (resource) =>
        resource.resourceType === models.EnumResourceType.Service ||
        resource.resourceType === models.EnumResourceType.MessageBroker ||
        resource.resourceType === models.EnumResourceType.Component
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
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
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
              <DataGridColumnFilter
                columns={columns}
                onColumnsChanged={setColumns}
              />

              <ToggleView
                values={[VIEW_CARDS, VIEW_GRID]}
                selectedValue={viewMode}
                onValueChange={(selectedValue) => setViewMode(selectedValue)}
              />
              {loadingResources && <CircularProgress />}
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
              <CreateResourceButton servicesLength={servicesLength} />
            </FlexItem>
          </>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      <CustomPropertyFilters onChange={setResourcePropertiesFilter} />

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
                columns={columns}
                rows={relevantResources}
                onColumnsReorder={onColumnsReorder}
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
