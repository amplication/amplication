import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ResourceTeamAssignments from "./ResourceTeamAssignments";
import { useAppContext } from "../context/appContext";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const ResourceTeamAssignmentsPage: React.FC<Props> = ({
  match,
  innerRoutes,
}: Props) => {
  const { projectConfigurationResource } = useAppContext();

  return (
    <ResourceTeamAssignments resourceId={projectConfigurationResource?.id} />
  );
};

export default ResourceTeamAssignmentsPage;
