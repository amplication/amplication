import {
  Button,
  CircularProgress,
  DataGrid,
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
import { useStiggContext } from "@stigg/react-sdk";
import { isEmpty } from "lodash";
import { useContext, useEffect } from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import PageContent from "../Layout/PageContent";
import useServiceTemplate from "../ServiceTemplate/hooks/useServiceTemplate";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import "./ServiceTemplateList.scss";
import { SERVICE_TEMPLATE_LIST_COLUMNS } from "./ServiceTemplateListDataColumns";
import { Link } from "react-router-dom";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import BetaFeatureTag from "../Components/BetaFeatureTag";
import PlatformBetaContent from "../Workspaces/WorkspaceHeader/PlatformBetaContent";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

function ServiceTemplateList() {
  const { refreshData } = useStiggContext();

  const { currentProject } = useContext(AppContext);

  const { baseUrl: servicesBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });
  const { baseUrl: templatesBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const {
    serviceTemplates,
    errorServiceTemplates,
    loadingServiceTemplates,
    handleSearchChange,
  } = useServiceTemplate(currentProject);

  useEffect(() => {
    refreshData();
  }, []);

  const errorMessage = formatError(errorServiceTemplates);

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
                {serviceTemplates.length}{" "}
                {pluralize(serviceTemplates.length, "Template", "Templates")}
              </Text>
              <SearchField
                label="search"
                placeholder="search"
                onChange={handleSearchChange}
              />
              <BetaFeatureTag>
                <PlatformBetaContent />
              </BetaFeatureTag>
            </FlexItem>
          </>
        }
        end={
          <>
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              direction={EnumFlexDirection.Row}
            >
              <Link to={servicesBaseUrl}>
                <Button buttonStyle={EnumButtonStyle.Outline}>
                  View Services
                </Button>
              </Link>
              <Link to={`${templatesBaseUrl}/create-service-template`}>
                <Button buttonStyle={EnumButtonStyle.Primary}>
                  Create Template
                </Button>
              </Link>
            </FlexItem>
          </>
        }
      ></FlexItem>
      <HorizontalRule doubleSpacing />

      {loadingServiceTemplates && <CircularProgress centerToParent />}

      {isEmpty(serviceTemplates) && !loadingServiceTemplates ? (
        <EmptyState
          message="There are no templates to show"
          image={EnumImages.AddResource}
        />
      ) : (
        <div className={`${CLASS_NAME}__grid-container`}>
          <DataGrid
            columns={SERVICE_TEMPLATE_LIST_COLUMNS}
            rows={serviceTemplates}
          ></DataGrid>
        </div>
      )}

      <Snackbar open={Boolean(errorServiceTemplates)} message={errorMessage} />
    </PageContent>
  );
}

export default ServiceTemplateList;
