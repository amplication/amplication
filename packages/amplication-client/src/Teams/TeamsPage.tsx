import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import Team from "./Team";
import { TeamList } from "./TeamList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const TeamsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const pageTitle = "Teams";

  const teamMatch = useRouteMatch<{ teamId: string }>([
    "/:workspace/teams/:teamId",
  ]);

  let teamId = null;
  if (teamMatch) {
    teamId = teamMatch.params.teamId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="teams"
      sideContent={<TeamList selectFirst={null === teamId} />}
    >
      {match.isExact ? !isEmpty(teamId) && <Team /> : innerRoutes}
    </PageContent>
  );
};

export default TeamsPage;
