import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import OutdatedVersionAlertList from "./OutdatedVersionAlertList";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
type Props = AppRouteProps & {
  match: match;
};

function OutdatedVersionAlertsPage({ match, innerRoutes }: Props) {
  useBreadcrumbs("Tech Debt", match.url);

  return <>{match.isExact ? <OutdatedVersionAlertList /> : innerRoutes}</>;
}

export default OutdatedVersionAlertsPage;
