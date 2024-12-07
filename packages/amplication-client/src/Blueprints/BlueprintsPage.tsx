import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import Blueprint from "./Blueprint";
import { BlueprintList } from "./BlueprintList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
  }>;
};

const BlueprintsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const pageTitle = "Blueprints";

  const blueprintMatch = useRouteMatch<{ blueprintId: string }>([
    "/:workspace/blueprints/:blueprintId",
  ]);

  let blueprintId = null;
  if (blueprintMatch) {
    blueprintId = blueprintMatch.params.blueprintId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="blueprints"
      sideContent={<BlueprintList selectFirst={null === blueprintId} />}
    >
      {match.isExact ? !isEmpty(blueprintId) && <Blueprint /> : innerRoutes}
    </PageContent>
  );
};

export default BlueprintsPage;
