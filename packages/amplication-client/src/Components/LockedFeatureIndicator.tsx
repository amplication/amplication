import { Icon } from "@amplication/ui/design-system";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./LockedFeatureIndicator.scss";

const WarningTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#F85B6E",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#15192C",
    color: "#ffffff",
    maxWidth: 360,
    border: "1px solid #F85B6E",
    borderRadius: "4px",
    padding: "6px",
    fontFamily: "unset",
    fontSize: "10px",
    fontWeight: "unset",
  },
}));

const CLASS_NAME = "amp-locked-feature-indicator";

type Props = {
  featureName: string;
};

export const LockedFeatureIndicator = ({ featureName }: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const { currentWorkspace } = useContext(AppContext);

  const handleViewPlansClick = useCallback(() => {
    history.push(`/${currentWorkspace.id}/purchase`, {
      from: { pathname: window.location.pathname },
    });
    trackEvent({
      eventName: AnalyticsEventNames.ProFeatureLockClick,
      featureName,
    });
  }, [currentWorkspace, window.location.pathname]);

  return (
    <WarningTooltip
      arrow
      placement="top-start"
      title={
        <div className={`${CLASS_NAME}__tooltip__window`}>
          <Icon icon="info_circle" />
          <div className={`${CLASS_NAME}__tooltip__window__info`}>
            <span>This feature requires a Pro plan.</span>{" "}
            <Link
              onClick={handleViewPlansClick}
              className={`${CLASS_NAME}__view_plans_link`}
              to={{}}
            >
              View Plans
            </Link>
          </div>
        </div>
      }
    >
      <img
        className={`${CLASS_NAME}__lock`}
        src={`../../../../assets/images/lock.svg`}
        alt=""
      />
    </WarningTooltip>
  );
};
