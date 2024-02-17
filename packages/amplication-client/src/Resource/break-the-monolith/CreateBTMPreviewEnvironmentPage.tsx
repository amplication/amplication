import React from "react";
import { match, useLocation } from "react-router-dom";
import { Modal } from "@amplication/ui/design-system";
import { AppRouteProps } from "../../routes/routesUtil";

import { CreateEntitiesFormPredefinedSchema } from "./CreateEntitiesFormPredefinedSchema";
type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CreateBTMPreviewEnvironmentPage: React.FC<Props> = ({ match }) => {
  const query = useQuery();

  const resourceId = query.get("resourceId");
  const projectId = query.get("projectId");
  const workspaceId = query.get("workspaceId");

  return (
    <Modal open fullScreen>
      <CreateEntitiesFormPredefinedSchema
        workspaceId={workspaceId}
        projectId={projectId}
        resourceId={resourceId}
      />
    </Modal>
  );
};

export default CreateBTMPreviewEnvironmentPage;
