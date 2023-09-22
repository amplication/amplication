import { useContext } from "react";
import ProjectList from "../Project/ProjectList";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";

const CLASS_NAME = "workspace-overview";
const PAGE_TITLE = "Workspace Overview";

export const WorkspaceOverview = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <ProjectList projects={projectsList} workspaceId={currentWorkspace.id} />
    </PageContent>
  );
};

export default WorkspaceOverview;
