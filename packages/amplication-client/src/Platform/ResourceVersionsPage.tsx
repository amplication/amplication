import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ResourceVersionList from "./ResourceVersionList";

type Props = AppRouteProps & {
  match: match;
};

function ResourceVersionsPage({ match, innerRoutes }: Props) {
  return <>{match.isExact ? <ResourceVersionList /> : innerRoutes}</>;
}

export default ResourceVersionsPage;
