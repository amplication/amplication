import CatalogGrid from "../Catalog/CatalogGrid";

import CreateResourceButton from "../Components/CreateResourceButton";
import { useAppContext } from "../context/appContext";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import "./ResourceList.scss";

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

function ResourceList() {
  const { currentProject } = useAppContext();

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      {currentProject && (
        <CatalogGrid
          fixedFilters={{
            projectIdFilter: [currentProject?.id],
          }}
          fixedFiltersKey={currentProject?.id}
          HeaderActions={<CreateResourceButton />}
        />
      )}
    </PageContent>
  );
}

export default ResourceList;
