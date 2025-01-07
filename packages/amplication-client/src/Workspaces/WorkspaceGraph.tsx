import CatalogGraph from "../Catalog/CatalogGraph/CatalogGraph";
import PageContent, {
  EnumPageContentPadding,
  EnumPageWidth,
} from "../Layout/PageContent";

const PAGE_TITLE = "Workspace Graph";

export const WorkspaceGraph = () => {
  return (
    <PageContent
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
      pageContentPadding={EnumPageContentPadding.None}
    >
      <CatalogGraph />
    </PageContent>
  );
};

export default WorkspaceGraph;
