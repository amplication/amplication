import {
  CircularProgress,
  DataGrid,
  DataGridColumn,
  DataGridColumnFilter,
  DataGridFilters,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
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
import useDataGridColumnFilter from "../Layout/useDataGridColumnFilter";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import { useCatalogContext } from "./CatalogContext";
import {
  columnsWithProperties,
  RESOURCE_LIST_COLUMNS,
} from "./CatalogDataColumns";
import "./CatalogGrid.scss";

const CLASS_NAME = "catalog-grid";

const COLUMNS_LOCAL_STORAGE_KEY = "resource-list-columns";

type Props = {
  HeaderActions?: React.ReactNode;
  fixedFilters?: Record<string, string | string[] | null>;
  fixedFiltersKey: string;
};

function CatalogGrid({ HeaderActions, fixedFilters, fixedFiltersKey }: Props) {
  const { customPropertiesMap, currentWorkspace } = useAppContext();

  const columnsWithAllProps = useMemo<DataGridColumn<models.Resource>[]>(() => {
    return columnsWithProperties(
      RESOURCE_LIST_COLUMNS,
      Object.values(customPropertiesMap)
    );
  }, [customPropertiesMap]);

  const { columns, setColumns, onColumnsReorder } = useDataGridColumnFilter(
    columnsWithAllProps,
    `${COLUMNS_LOCAL_STORAGE_KEY}-${currentWorkspace?.id}`
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
        <HorizontalRule />
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <DataGridFilters
            columns={columns}
            onChange={setFilter}
            fixedFilters={fixedFilters}
            fixedFiltersKey={fixedFiltersKey}
          />
        </FlexItem>
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
