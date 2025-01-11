import React, { ReactNode, useCallback } from "react";
import { Icon } from "@amplication/ui/design-system";
import useLocalStorage from "react-use-localstorage";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useTracking } from "../../util/analytics";
import "./WorkspaceBanner.scss";

const CLASS_NAME = "workspace-banner";
const DEFAULT_LOCAL_STORAGE_KEY_SHOW_BANNER = "showBanner";

export type Props = {
  children: ReactNode;
  to: string;
  clickEventName: AnalyticsEventNames;
  clickEventProps: Record<string, string>;
  closeEventName: AnalyticsEventNames;
  closeEventProps: Record<string, string>;
  localStorageKey?: string;
};

export default function WorkspaceBanner({
  children,
  to,
  clickEventName,
  clickEventProps,
  closeEventName,
  closeEventProps,
  localStorageKey = DEFAULT_LOCAL_STORAGE_KEY_SHOW_BANNER,
}: Props) {
  const [showBanner, setShowBanner] = useLocalStorage(localStorageKey, "true");
  const { trackEvent } = useTracking();
  const isBannerShowing = JSON.parse(showBanner);

  const handleBannerClick = useCallback(() => {
    trackEvent({
      eventName: clickEventName,
      ...clickEventProps,
    });
  }, [clickEventName, clickEventProps, trackEvent]);

  const handleCloseBannerClick = useCallback(() => {
    setShowBanner("false");
    trackEvent({
      eventName: closeEventName,
      ...closeEventProps,
    });
  }, [setShowBanner, trackEvent, closeEventName, closeEventProps]);

  if (!isBannerShowing) return null;

  return (
    <div className={`${CLASS_NAME}__banner`}>
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className={`${CLASS_NAME}__banner__cta`}
        onClick={handleBannerClick}
      >
        {children}
      </a>
      <div
        className={`${CLASS_NAME}__banner__close`}
        onClick={handleCloseBannerClick}
      >
        <Icon icon="close" size="xsmall" />
      </div>
    </div>
  );
}
