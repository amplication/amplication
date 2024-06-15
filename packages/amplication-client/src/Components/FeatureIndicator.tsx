import { EnumTextColor, Icon } from "@amplication/ui/design-system";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./FeatureIndicator.scss";
import { IconType } from "./FeatureIndicatorContainer";
import useAbTesting from "../VersionControl/hooks/useABTesting";

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
    maxWidth: 500,
    border: "1px solid #53dbee",
    borderRadius: "4px",
    padding: "6px 8px",
    fontFamily: "unset",
    fontSize: "12px",
    fontWeight: "unset",
  },
}));

const CLASS_NAME = "amp-feature-indicator";

export const DEFAULT_TEXT_START =
  "Explore this feature, included in your 7-day Enterprise trial.";
export const DEFAULT_TEXT_END =
  "today to ensure continued access and discover additional hidden functionalities!";

export const DISABLED_DEFAULT_TEXT_END =
  "today to access it and discover additional hidden functionalities";

type Props = {
  featureName: string;
  icon?: IconType;
  element?: React.ReactNode;
  comingSoon?: boolean;
  placement?: TooltipProps["placement"];
  tooltipIcon?: string;
  textStart?: string;
  textEnd?: string;
  showTooltipLink?: boolean;
};

export const FeatureIndicator = ({
  featureName,
  icon,
  element,
  comingSoon = false,
  tooltipIcon,
  placement = "top-start",
  textStart,
  textEnd,
  showTooltipLink = true,
}: Props) => {
  const { upgradeCtaVariationData } = useAbTesting();
  const { trackEvent } = useTracking();

  const handleViewPlansClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: FeatureIndicator.name,
      billingFeature: featureName,
      linkType: upgradeCtaVariationData?.linkMessage,
    });
  }, [featureName, trackEvent, upgradeCtaVariationData]);

  const renderTooltipTextWithUpgradeLink = useMemo(() => {
    const currentStartText = textStart ? textStart : DEFAULT_TEXT_START;
    const currentEndText = textEnd ? textEnd : DEFAULT_TEXT_END;
    return (
      <>
        <span>{currentStartText}</span>
        {showTooltipLink && (
          <>
            <br />
            <a
              href={upgradeCtaVariationData?.url}
              target="_blank"
              rel="noreferrer"
              onClick={handleViewPlansClick}
              style={{ color: "#53dbee" }}
            >
              {upgradeCtaVariationData?.linkMessage}{" "}
            </a>
            <span>{currentEndText}</span>
          </>
        )}
      </>
    );
  }, [
    textStart,
    showTooltipLink,
    upgradeCtaVariationData?.url,
    upgradeCtaVariationData?.linkMessage,
    handleViewPlansClick,
    textEnd,
  ]);

  return (
    <WarningTooltip
      placement={placement}
      title={
        <div className={`${CLASS_NAME}__tooltip__window`}>
          {tooltipIcon && <Icon icon={tooltipIcon} />}
          {!comingSoon ? (
            <div className={`${CLASS_NAME}__tooltip__window__info`}>
              {renderTooltipTextWithUpgradeLink}
            </div>
          ) : (
            <div className={`${CLASS_NAME}__tooltip__window__info`}>
              <Link
                onClick={handleViewPlansClick}
                style={{ color: "#53dbee" }}
                to={{}}
              >
                {upgradeCtaVariationData?.linkMessage}{" "}
              </Link>
              <span>{textStart}</span>
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
