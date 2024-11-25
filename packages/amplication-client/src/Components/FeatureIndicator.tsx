import { EnumTextColor, Icon } from "@amplication/ui/design-system";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./FeatureIndicator.scss";
import { IconType } from "./FeatureIndicatorContainer";
import useAbTesting from "../VersionControl/hooks/useABTesting";
import { useAppContext } from "../context/appContext";

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
  "Explore this feature, included in your 14-day trial.";
export const DEFAULT_TEXT_END =
  " to ensure continued access and discover additional hidden functionalities!";

export const DISABLED_DEFAULT_TEXT_END =
  " to access it and discover additional hidden functionalities";

export enum EnumCtaType {
  Upgrade = "upgrade",
  TalkToUs = "learn more",
}

type Props = {
  featureName: string;
  icon?: IconType;
  element?: React.ReactNode;
  placement?: TooltipProps["placement"];
  tooltipIcon?: string;
  textStart?: string;
  textEnd?: string;
  showTooltipLink?: boolean;
  ctaType?: EnumCtaType;
};

export const FeatureIndicator = ({
  featureName,
  icon,
  element,
  tooltipIcon,
  placement = "top-start",
  textStart,
  textEnd,
  showTooltipLink = true,
  ctaType = EnumCtaType.Upgrade,
}: Props) => {
  const { upgradeCtaVariationData } = useAbTesting();
  const { trackEvent } = useTracking();
  const { currentWorkspace } = useAppContext();

  const handleViewPlansClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: FeatureIndicator.name,
      billingFeature: featureName,
    });
  }, [featureName, trackEvent]);

  const tooltipStartText = textStart ? textStart : DEFAULT_TEXT_START;
  const tooltipEndText = textEnd ? textEnd : DEFAULT_TEXT_END;

  return (
    <WarningTooltip
      placement={placement}
      title={
        <div className={`${CLASS_NAME}__tooltip__window`}>
          {tooltipIcon && <Icon icon={tooltipIcon} />}
          <div className={`${CLASS_NAME}__tooltip__window__info`}>
            <span>{tooltipStartText}</span>
            {showTooltipLink && (
              <>
                <div>
                  {ctaType === EnumCtaType.Upgrade ? (
                    <Link
                      to={`/${currentWorkspace?.id}/purchase`}
                      onClick={handleViewPlansClick}
                      style={{ color: "#53dbee" }}
                    >
                      Upgrade Now{" "}
                    </Link>
                  ) : (
                    <a
                      href={upgradeCtaVariationData?.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleViewPlansClick}
                      style={{ color: "#53dbee" }}
                    >
                      {upgradeCtaVariationData?.linkMessage}{" "}
                    </a>
                  )}

                  <span>{tooltipEndText}</span>
                </div>
              </>
            )}
          </div>
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
