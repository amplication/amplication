import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import CatalogGrid from "../Catalog/CatalogGrid";
import CreateResourceButton from "../Resource/create-resource-dialog/CreateResourceButton";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import NewServiceFromTemplateDialogWithUrlTrigger from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import "./ResourceList.scss";
import { useAppContext } from "../context/appContext";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

function ResourceList() {
  const { currentProject } = useAppContext();

  const { baseUrl: platformProjectBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      <NewServiceFromTemplateDialogWithUrlTrigger />
      {currentProject && (
        <CatalogGrid
          fixedFilters={{
            projectId: currentProject?.id,
          }}
          HeaderActions={
            <>
              <Link to={`${platformProjectBaseUrl}`}>
                <Button buttonStyle={EnumButtonStyle.Outline}>
                  View Templates
                </Button>
              </Link>
              <CreateResourceButton />
            </>
          }
        />
      )}
    </PageContent>
  );
}

export default ResourceList;
