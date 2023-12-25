import { EnumTextColor, Icon } from "@amplication/ui/design-system";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useCallback, useContext, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./FeatureIndicator.scss";
import { IconType } from "./FeatureIndicatorContainer";

const WarningTooltip = styled(
  ({ className, placement, ...props }: TooltipProps) => (
    <Tooltip {...props} placement={placement} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#53dbee",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#15192C",
    color: "#ffffff",
    maxWidth: 360,
    border: "1px solid #53dbee",
    borderRadius: "4px",
    padding: "6px 8px",
    fontFamily: "unset",
    fontSize: "10px",
    fontWeight: "unset",
  },
}));

const CLASS_NAME = "amp-feature-indicator";

const tooltipDefaultTextUpgrade = "Upgrade";

export const tooltipDefaultText = `Explore this feature, included in your 14-day Enterprise trial. ${tooltipDefaultTextUpgrade} for continued access.`;

type Props = {
  featureName: string;
  icon?: IconType;
  element?: React.ReactNode;
  comingSoon?: boolean;
  placement?: TooltipProps["placement"];
  tooltipIcon?: string;
  text?: string;
  linkText?: string;
};

export const FeatureIndicator = ({
  featureName,
  icon,
  element,
  comingSoon = false,
  tooltipIcon,
  placement = "top-start",
  text = tooltipDefaultText,
  linkText = tooltipDefaultTextUpgrade,
}: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const { currentWorkspace } = useContext(AppContext);

  const handleViewPlansClick = useCallback(() => {
    history.push(`/${currentWorkspace.id}/purchase`, {
      from: { pathname: window.location.pathname },
    });
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: FeatureIndicator.name,
      billingFeature: featureName,
    });
  }, [currentWorkspace, window.location.pathname]);

  const renderEnterpriseTrialTooltipText = useMemo(() => {
    const textArray = text.split(tooltipDefaultTextUpgrade);
    return (
      <>
        {textArray[0]}
        <div>
          <Link
            onClick={handleViewPlansClick}
            style={{ color: "#53dbee" }}
            to={{}}
          >
            {tooltipDefaultTextUpgrade}
          </Link>
          {textArray[1]}
        </div>
      </>
    );
  }, [text, tooltipDefaultTextUpgrade, handleViewPlansClick]);

  const renderTooltipTextWithUpgradeLink = useMemo(() => {
    return (
      <>
        <span>{text}</span>{" "}
        <Link
          onClick={handleViewPlansClick}
          style={{ color: "#53dbee" }}
          to={{}}
        >
          {linkText}
        </Link>
      </>
    );
  }, [text, linkText, handleViewPlansClick]);

  return (
    <WarningTooltip
      placement={placement}
      title={
        <div className={`${CLASS_NAME}__tooltip__window`}>
          {tooltipIcon && <Icon icon={tooltipIcon} />}
          {!comingSoon ? (
            <div className={`${CLASS_NAME}__tooltip__window__info`}>
              {icon === IconType.Diamond
                ? renderEnterpriseTrialTooltipText
                : renderTooltipTextWithUpgradeLink}
            </div>
          ) : (
            <div className={`${CLASS_NAME}__tooltip__window__info`}>
              <Link
                onClick={handleViewPlansClick}
                style={{ color: "#53dbee" }}
                to={{}}
              >
                {linkText}{" "}
              </Link>
              <span>{text}</span>
            </div>
          )}
        </div>
      }
    >
      <div className={`${CLASS_NAME}__wrapper`}>
        {icon && !element ? (
          <Icon icon={icon} size="xsmall" color={EnumTextColor.Black20} />
        ) : (
          element
        )}
      </div>
    </WarningTooltip>
  );
};
