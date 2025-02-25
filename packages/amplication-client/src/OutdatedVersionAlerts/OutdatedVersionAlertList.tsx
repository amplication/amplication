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
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext } from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useOutdatedVersionAlerts from "./hooks/useOutdatedVersionAlerts";
import { COLUMNS } from "./OutdatedVersionAlertListDataColumns";
import { AlertStatusFilter } from "./AlertStatusFilter";
import { AlertTypeFilter } from "./AlertTypeFilter";
import ProjectNameLink from "../Workspaces/ProjectNameLink";
import { useLocation } from "react-router-dom";

const CLASS_NAME = "resource-version-list";
const PAGE_TITLE = "Tech Debt";

function OutdatedVersionAlertList() {
  const { currentProject, currentResource } = useContext(AppContext);
  const location = useLocation();

  const isWorkspaceTechDebt = /^\/[A-Za-z0-9-]{20,}\/tech-debt/.test(
    location.pathname
  );

  const {
    outdatedVersionAlerts,
    errorOutdatedVersionAlerts,
    loadingOutdatedVersionAlerts,
    //setSearchPhrase,
    pagination,
    setOrderBy,
    status,
    setStatus,
    type,
    setType,
  } = useOutdatedVersionAlerts(currentProject?.id, currentResource?.id);

  const errorMessage = formatError(errorOutdatedVersionAlerts);

  const columns = [
    ...COLUMNS,
    ...(isWorkspaceTechDebt
      ? [
          {
            key: "project",
            name: "Project",
            sortable: true,
            renderCell: (props) => {
              return <ProjectNameLink project={props.row.resource?.project} />;
            },
            getValue: (row) => row.resource?.project?.name ?? "(unavailable)",
          },
        ]
      : []),
  ];

  const onSortColumnsChange = useCallback(
    (sortColumns: DataGridSortColumn[]) => {
      pagination.setPageNumber(1);
      const [sortColumn] = sortColumns;
      if (!sortColumn) {
        setOrderBy(undefined);
        return;
      }

      setOrderBy(sortColumn);
    },
    [setOrderBy, pagination]
  );

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
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
              {loadingOutdatedVersionAlerts && <CircularProgress />}
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
              {pagination.recordCount}{" "}
              {pluralize(pagination.recordCount, "Alert", "Alerts")}
            </Text>
            <Pagination
              count={pagination.pageCount}
              page={pagination.pageNumber}
              onChange={(event, page) => {
                pagination.setPageNumber(page);
                event.preventDefault();
              }}
            />
          </FlexItem>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {isEmpty(outdatedVersionAlerts) && !loadingOutdatedVersionAlerts ? (
        <EmptyState
          message="There are no alerts to show"
          image={EnumImages.NoChanges}
        />
      ) : (
        <div className={`${CLASS_NAME}__grid-container`}>
          <DataGrid
            columns={columns}
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
