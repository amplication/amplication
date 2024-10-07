import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import OutdatedVersionAlertList from "./OutdatedVersionAlertList";

type Props = AppRouteProps & {
  match: match;
};

function OutdatedVersionAlertsPage({ match, innerRoutes }: Props) {
  return <>{match.isExact ? <OutdatedVersionAlertList /> : innerRoutes}</>;
}

export default OutdatedVersionAlertsPage;
