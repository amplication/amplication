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
  SearchField,
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
import useResourceVersions from "./hooks/useResourceVersions";
import "./ResourceVersionList.scss";
import { RESOURCE_VERSION_LIST_COLUMNS } from "./ResourceVersionListDataColumns";

const CLASS_NAME = "resource-version-list";
const PAGE_TITLE = "Version List";

function ResourceVersionList() {
  const { currentResource } = useContext(AppContext);

  const {
    resourceVersions,
    errorResourceVersions,
    loadingResourceVersions,
    setSearchPhrase,
    pageSize,
    setPageNumber,
    pageNumber,
    setOrderBy,
    resourceVersionsCount,
  } = useResourceVersions(currentResource?.id);

  const errorMessage = formatError(errorResourceVersions);

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
              <Text textStyle={EnumTextStyle.Tag}>
                {resourceVersionsCount}{" "}
                {pluralize(resourceVersionsCount, "Version", "Versions")}
              </Text>
              <SearchField
                label="search"
                placeholder="search"
                onChange={setSearchPhrase}
              />
            </FlexItem>
          </>
        }
        end={
          <Pagination
            count={
              resourceVersionsCount > 0
                ? Math.ceil(resourceVersionsCount / pageSize)
                : 1
            }
            page={pageNumber}
            onChange={(event, page) => {
              setPageNumber(page);
              event.preventDefault();
            }}
          />
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {loadingResourceVersions && <CircularProgress centerToParent />}

      {isEmpty(resourceVersions) && !loadingResourceVersions ? (
        <EmptyState
          message="The template was not published yet"
          image={EnumImages.CommitEmptyState}
        />
      ) : (
        <div className={`${CLASS_NAME}__grid-container`}>
          <DataGrid
            columns={RESOURCE_VERSION_LIST_COLUMNS}
            clientSideSort={false}
            onSortColumnsChange={onSortColumnsChange}
            rows={resourceVersions}
          ></DataGrid>
        </div>
      )}

      <Snackbar open={Boolean(errorResourceVersions)} message={errorMessage} />
    </PageContent>
  );
}

export default ResourceVersionList;
