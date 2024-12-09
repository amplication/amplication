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
  EnumFlexItemMargin,
  EnumGapSize,
  EnumIconPosition,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Modal,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import CatalogGraph from "./CatalogGraph/CatalogGraph";
import "./CatalogGrid.scss";

const CLASS_NAME = "catalog-grid";

const COLUMNS_LOCAL_STORAGE_KEY = "resource-list-columns";

type Props = {
  HeaderActions?: React.ReactNode;
  fixedFilters?: Record<string, string | null>;
};

function CatalogGrid({ HeaderActions, fixedFilters }: Props) {
  const { customPropertiesMap } = useAppContext();
  const [graphIsOpen, setGraphIsOpen] = useState(false);

  const columnsWithAllProps = useMemo<DataGridColumn<models.Resource>[]>(() => {
    return columnsWithProperties(
      RESOURCE_LIST_COLUMNS,
      Object.values(customPropertiesMap)
    );
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
              <Button
                icon="relation"
                iconPosition={EnumIconPosition.Left}
                buttonStyle={EnumButtonStyle.Outline}
                onClick={() => setGraphIsOpen(true)}
              >
                Show Graph
              </Button>
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
      {graphIsOpen && (
        <Modal
          css="catalog-graph-modal"
          onCloseEvent={() => setGraphIsOpen(false)}
          open={graphIsOpen}
          fullScreen
          showCloseButton={true}
        >
          <CatalogGraph />
        </Modal>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default CatalogGrid;
