import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import NewServiceFromTemplateDialogWithUrlTrigger from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
import CatalogGrid from "./CatalogGrid";

const CLASS_NAME = "catalog-page";
const PAGE_TITLE = "Catalog";

function Catalog() {
  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      <NewServiceFromTemplateDialogWithUrlTrigger />
      <CatalogGrid fixedFiltersKey="workspace-catalog" />
    </PageContent>
  );
}

export default Catalog;
