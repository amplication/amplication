import {
  CircularProgress,
  DataGrid,
  DataGridSortColumn,
  EnumContentAlign,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Pagination,
  SelectMenu,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext } from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useOutdatedVersionAlerts from "./hooks/useOutdatedVersionAlerts";
import { COLUMNS } from "./OutdatedVersionAlertListDataColumns";
import { AlertStatusFilter } from "./AlertStatusFilter";
import { AlertTypeFilter } from "./AlertTypeFilter";

const CLASS_NAME = "resource-version-list";
const PAGE_TITLE = "Version List";

function OutdatedVersionAlertList() {
  const { currentProject } = useContext(AppContext);

  const {
    outdatedVersionAlerts,
    errorOutdatedVersionAlerts,
    loadingOutdatedVersionAlerts,
    //setSearchPhrase,
    pageSize,
    setPageNumber,
    pageNumber,
    setOrderBy,
    outdatedVersionAlertsCount,
    status,
    setStatus,
    type,
    setType,
  } = useOutdatedVersionAlerts(currentProject?.id);

  const errorMessage = formatError(errorOutdatedVersionAlerts);

  const onSortColumnsChange = useCallback(
    (sortColumns: DataGridSortColumn[]) => {
      setPageNumber(1);
      const [sortColumn] = sortColumns;
      if (!sortColumn) {
        setOrderBy(undefined);
        return;
      }

      setOrderBy(sortColumn);
    },
    [setOrderBy, setPageNumber]
  );

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
              <AlertStatusFilter
                onChange={(value) => {
                  setStatus(value);
                }}
                selectedValue={status}
              />
              <AlertTypeFilter
                onChange={(value) => {
                  setType(value);
                }}
                selectedValue={type}
              />

              {/* <SearchField
                label="search"
                placeholder="search"
                onChange={setSearchPhrase}
              /> */}
            </FlexItem>
          </>
        }
        end={
          <FlexItem gap={EnumGapSize.Large} itemsAlign={EnumItemsAlign.Center}>
            <Text textStyle={EnumTextStyle.Tag}>
              {outdatedVersionAlertsCount}{" "}
              {pluralize(outdatedVersionAlertsCount, "Alert", "Alerts")}
            </Text>
            <Pagination
              count={
                outdatedVersionAlertsCount > 0
                  ? Math.ceil(outdatedVersionAlertsCount / pageSize)
                  : 1
              }
              page={pageNumber}
              onChange={(event, page) => {
                setPageNumber(page);
                event.preventDefault();
              }}
            />
          </FlexItem>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {loadingOutdatedVersionAlerts && <CircularProgress centerToParent />}

      {isEmpty(outdatedVersionAlerts) && !loadingOutdatedVersionAlerts ? (
        <EmptyState
          message="The template was not published yet"
          image={EnumImages.CommitEmptyState}
        />
      ) : (
        <div className={`${CLASS_NAME}__grid-container`}>
          <DataGrid
            columns={COLUMNS}
            clientSideSort={false}
            onSortColumnsChange={onSortColumnsChange}
            rows={outdatedVersionAlerts}
          ></DataGrid>
        </div>
      )}

      <Snackbar
        open={Boolean(errorOutdatedVersionAlerts)}
        message={errorMessage}
      />
    </PageContent>
  );
}

export default OutdatedVersionAlertList;
