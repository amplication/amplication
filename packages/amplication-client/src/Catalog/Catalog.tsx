import {
  Button,
  CircularProgress,
  DataGrid,
  DataGridColumn,
  DataGridColumnFilter,
  DataGridFilters,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import CreateResourceButton from "../Components/CreateResourceButton";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { CustomPropertyFilter } from "../CustomProperties/CustomPropertyFilter";
import CustomPropertyValue from "../CustomProperties/CustomPropertyValue";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import useDataGridColumnFilter from "../Layout/useDataGridColumnFilter";
import NewServiceFromTemplateDialogWithUrlTrigger from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import "./Catalog.scss";
import { RESOURCE_LIST_COLUMNS } from "./CatalogDataColumns";
import useCatalog from "./hooks/useCatalog";

const CLASS_NAME = "catalog";
const PAGE_TITLE = "Catalog";

const COLUMNS_LOCAL_STORAGE_KEY = "resource-list-columns";

function Catalog() {
  const { customPropertiesMap, currentProject } = useAppContext();

  const columnsWithAllProps = useMemo<DataGridColumn<models.Resource>[]>(() => {
    const propCols = Object.values(customPropertiesMap).map(
      (property): DataGridColumn<models.Resource> => {
        return {
          key: property.key,
          name: property.name,
          resizable: true,
          sortable: true,
          filterable: true,
          renderFilter: CustomPropertyFilter,
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
      }
    );

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

  const { catalog, loading, error, setFilter, setSearchPhrase, pagination } =
    useCatalog();

  const servicesLength = useMemo(
    () =>
      catalog?.filter(
        (resource) => resource.resourceType === models.EnumResourceType.Service
      ).length,
    [catalog]
  );

  const errorMessage = formatError(error);

  const handleLoadMore = useCallback(() => {
    pagination.triggerLoadMore();
  }, [pagination]);

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      <NewServiceFromTemplateDialogWithUrlTrigger />
      <div className={`${CLASS_NAME}__wrapper`}>
        <div className={`${CLASS_NAME}__header`}>
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
                    {pagination.recordCount}{" "}
                    {pluralize(pagination.recordCount, "Item", "Items")}
                  </Text>
                  <SearchField
                    label="search"
                    placeholder="search"
                    onChange={setSearchPhrase}
                  />
                  <DataGridColumnFilter
                    columns={columns}
                    onColumnsChanged={setColumns}
                  />
                  {loading && <CircularProgress />}
                </FlexItem>
              </>
            }
            end={
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                direction={EnumFlexDirection.Row}
              >
                {currentProject && (
                  <>
                    <Link to={`${platformProjectBaseUrl}`}>
                      <Button buttonStyle={EnumButtonStyle.Outline}>
                        View Templates
                      </Button>
                    </Link>
                    <CreateResourceButton servicesLength={servicesLength} />
                  </>
                )}
              </FlexItem>
            }
          ></FlexItem>
          <HorizontalRule doubleSpacing />
          <DataGridFilters columns={columns} onChange={setFilter} />
        </div>
        <div className={`${CLASS_NAME}__grid-container`}>
          {isEmpty(catalog) && !loading ? (
            <EmptyState
              message="There are no items to show with the current filters"
              image={EnumImages.AddResource}
            />
          ) : (
            <DataGrid
              columns={columns}
              rows={catalog}
              onColumnsReorder={onColumnsReorder}
              onScrollToBottom={handleLoadMore}
            ></DataGrid>
          )}
        </div>
      </div>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
}

export default Catalog;
