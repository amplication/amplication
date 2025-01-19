import {
  CircularProgress,
  DataGrid,
  EnumContentAlign,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { EmptyState } from "../../Components/EmptyState";
import { EnumImages } from "../../Components/SvgThemeImage";
import { useAppContext } from "../../context/appContext";
import PageContent from "../../Layout/PageContent";
import { formatError } from "../../util/error";
import { pluralize } from "../../util/pluralize";
import useServiceTemplate from "../hooks/useServiceTemplate";
import { RESOURCE_LIST_COLUMNS } from "./ServiceTemplateServiceListDataColumns";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Services";

function ServiceTemplateServiceList() {
  const { currentProject, currentResource } = useAppContext();

  const {
    findResourcesByTemplate,
    findResourcesByTemplateLoading,
    findResourcesByTemplateError,
    findResourcesByTemplateData,
  } = useServiceTemplate(currentProject);

  useEffect(() => {
    if (
      !currentResource?.id ||
      findResourcesByTemplateLoading ||
      findResourcesByTemplateData
    )
      return;

    findResourcesByTemplate(currentResource?.id);
  }, [
    currentResource?.id,
    findResourcesByTemplate,
    findResourcesByTemplateData,
    findResourcesByTemplateLoading,
  ]);

  const errorMessage = formatError(findResourcesByTemplateError);

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
                {findResourcesByTemplateData?.length}{" "}
                {pluralize(
                  findResourcesByTemplateData?.length,
                  "Service",
                  "Services"
                )}{" "}
                using this template
              </Text>
            </FlexItem>
          </>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {findResourcesByTemplateLoading && <CircularProgress centerToParent />}

      {isEmpty(findResourcesByTemplateData) &&
      !findResourcesByTemplateLoading ? (
        <EmptyState
          message="There are no services to show"
          image={EnumImages.AddResource}
        />
      ) : (
        <div className={`${CLASS_NAME}__grid-container`}>
          {findResourcesByTemplateData && (
            <DataGrid
              columns={RESOURCE_LIST_COLUMNS}
              rows={findResourcesByTemplateData}
            ></DataGrid>
          )}
        </div>
      )}

      <Snackbar
        open={Boolean(findResourcesByTemplateError)}
        message={errorMessage}
      />
    </PageContent>
  );
}

export default ServiceTemplateServiceList;
