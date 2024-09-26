import {
  CircularProgress,
  DataGrid,
  EnumContentAlign,
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
import { useContext } from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useResourceVersion from "./hooks/useResourceVersion";
//import "./ResourceVersionList.scss";
import { RESOURCE_VERSION_LIST_COLUMNS } from "./ResourceVersionListDataColumns";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

function ResourceVersionList() {
  const { currentResource } = useContext(AppContext);

  const {
    resourceVersions,
    errorResourceVersions,
    loadingResourceVersions,
    handleSearchChange,
  } = useResourceVersion(currentResource?.id);

  const errorMessage = formatError(errorResourceVersions);

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
                {resourceVersions.length}{" "}
                {pluralize(resourceVersions.length, "Version", "Versions")}
              </Text>
              <SearchField
                label="search"
                placeholder="search"
                onChange={handleSearchChange}
              />
            </FlexItem>
          </>
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
            rows={resourceVersions}
          ></DataGrid>
        </div>
      )}

      <Snackbar open={Boolean(errorResourceVersions)} message={errorMessage} />
    </PageContent>
  );
}

export default ResourceVersionList;
