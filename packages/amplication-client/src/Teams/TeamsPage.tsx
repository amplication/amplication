import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import { TeamList } from "./TeamList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const TeamsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  return (
    <div className="teams">{match.isExact ? <TeamList /> : innerRoutes}</div>
  );
};

export default TeamsPage;
