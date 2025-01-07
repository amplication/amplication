import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { EnumButtonStyle } from "../Components/Button";
import ProjectSelector from "../Components/ProjectSelector";
import { useAppContext } from "../context/appContext";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import NewServiceFromTemplateDialogWithUrlTrigger from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
import CatalogGrid from "./CatalogGrid";

const CLASS_NAME = "catalog-page";
const PAGE_TITLE = "Catalog";

function Catalog() {
  const { currentWorkspace } = useAppContext();

  const history = useHistory();

  const handleProjectSelect = useCallback(
    (projectId) => {
      const url = `/${currentWorkspace?.id}/${projectId}/new-resource`;
      history.push(url);
    },
    [currentWorkspace?.id, history]
  );

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      <NewServiceFromTemplateDialogWithUrlTrigger />
      <CatalogGrid
        fixedFiltersKey="workspace-catalog"
        HeaderActions={
          <>
            <ProjectSelector
              onChange={handleProjectSelect}
              selectedValue=""
              buttonStyle={EnumButtonStyle.Primary}
              label="Add Resource to Project"
            />
          </>
        }
      />
    </PageContent>
  );
}

export default Catalog;
