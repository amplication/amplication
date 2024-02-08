import React from "react";
import { match } from "react-router-dom";
import { Modal } from "@amplication/ui/design-system";
import { AppRouteProps } from "../../routes/routesUtil";
import ModelOrganizer from "../../Project/ArchitectureConsole/ModelOrganizer";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const BreakTheMonolithOptionsPage: React.FC<Props> = ({ match }) => {
  const {
    workspace: workspaceId,
    project: projectId,
    resource: resourceId,
  } = match.params;

  return (
    <Modal open fullScreen>
      <ModelOrganizer />
    </Modal>
  );
};

export default BreakTheMonolithOptionsPage;
