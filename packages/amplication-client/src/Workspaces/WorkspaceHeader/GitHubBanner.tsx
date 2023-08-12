import React, { useCallback } from "react";
import { Icon } from "@amplication/ui/design-system";
import useLocalStorage from "react-use-localstorage";
import useFetchGithubStars from "../hooks/useFetchGithubStars";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useTracking } from "../../util/analytics";
import "./GitHubBanner.scss";

const CLASS_NAME = "amp-github-banner";
const LOCAL_STORAGE_KEY_SHOW_BANNER = "showBanner";
const AMP_GITHUB_URL = "https://github.com/amplication/amplication";

export default function GitHubBanner() {
  const stars = useFetchGithubStars();
  const [showBanner, setShowBanner] = useLocalStorage(
    LOCAL_STORAGE_KEY_SHOW_BANNER,
    "true"
  );
  const { trackEvent } = useTracking();
  const isBannerShowing = JSON.parse(showBanner);

  const handleStarUsClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.StarUsBannerCTAClick,
    });
  }, [trackEvent]);

  const handleCloseStarUsClick = useCallback(() => {
    setShowBanner("false");
    trackEvent({
      eventName: AnalyticsEventNames.StarUsBannerClose,
    });
  }, [trackEvent, setShowBanner]);

  if (!isBannerShowing) return null;

  return (
    <div className={`${CLASS_NAME}__banner`}>
      <a
        href={AMP_GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className={`${CLASS_NAME}__banner__cta`}
        onClick={handleStarUsClick}
      >
        <Icon icon="github" />
        Star us on GitHub{" "}
        <span className={`${CLASS_NAME}__banner__cta__stars`}>
          {stars} <Icon icon="star" />
        </span>
      </a>
      <div
        className={`${CLASS_NAME}__banner__close`}
        onClick={handleCloseStarUsClick}
      >
        <Icon icon="close" size="xsmall" />
      </div>
    </div>
  );
}
