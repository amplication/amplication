import {
  CircularProgress,
  DataGrid,
  DataGridColumn,
  DataGridColumnFilter,
  DataGridFilters,
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
import { useCallback, useEffect, useMemo } from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { CustomPropertyFilter } from "../CustomProperties/CustomPropertyFilter";
import CustomPropertyValue from "../CustomProperties/CustomPropertyValue";
import useDataGridColumnFilter from "../Layout/useDataGridColumnFilter";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import { RESOURCE_LIST_COLUMNS } from "./CatalogDataColumns";
import "./CatalogGrid.scss";
import { useCatalogContext } from "./CatalogContext";

const CLASS_NAME = "catalog-grid";

const COLUMNS_LOCAL_STORAGE_KEY = "resource-list-columns";

type Props = {
  HeaderActions?: React.ReactNode;
  fixedFilters?: Record<string, string | null>;
};

function CatalogGrid({ HeaderActions, fixedFilters }: Props) {
  const { customPropertiesMap } = useAppContext();

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
  const { catalog, loading, error, setFilter, setSearchPhrase, pagination } =
    useCatalogContext();

  const errorMessage = formatError(error);

  const handleLoadMore = useCallback(() => {
    pagination.triggerLoadMore();
  }, [pagination]);

  // Reset page number on initial load
  useEffect(() => {
    pagination.setPageNumber(1);
  }, []);

  return (
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
              {HeaderActions}
            </FlexItem>
          }
        ></FlexItem>
        <HorizontalRule doubleSpacing />
        <DataGridFilters
          columns={columns}
          onChange={setFilter}
          fixedFilters={fixedFilters}
        />
      </div>
      <div className={`${CLASS_NAME}__grid-container`}>
        <DataGrid
          columns={columns}
          rows={catalog}
          onColumnsReorder={onColumnsReorder}
          onScrollToBottom={handleLoadMore}
        ></DataGrid>
        {isEmpty(catalog) && !loading && (
          <EmptyState
            message="There are no items to show with the current filters"
            image={EnumImages.AddResource}
          />
        )}
      </div>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default CatalogGrid;
