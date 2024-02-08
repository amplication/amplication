import React from "react";
import { match } from "react-router-dom";
import { Modal } from "@amplication/ui/design-system";
import { AppRouteProps } from "../../routes/routesUtil";

import { BreakTheMonolithOptions } from "./BreakTheMonolithOptions";
type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const BreakTheMonolithOverviewPage: React.FC<Props> = ({ match }) => {
  const {
    workspace: workspaceId,
    project: projectId,
    resource: resourceId,
  } = match.params;

  return (
    <Modal open fullScreen>
      <BreakTheMonolithOptions
        workspaceId={workspaceId}
        projectId={projectId}
        resourceId={resourceId}
      />
    </Modal>
  );
};

export default BreakTheMonolithOverviewPage;
