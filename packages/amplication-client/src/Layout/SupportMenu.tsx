import React, { useCallback } from "react";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./SupportMenu.scss";

const CLASS_NAME = "support-menu";

const SupportMenu = () => {
  const { trackEvent } = useTracking();

  const handleDocsClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.SupportDocsClick,
    });
  }, [trackEvent]);

  const handleCommunityClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.SupportCommunityClick,
    });
  }, [trackEvent]);

  const handleFeatureRequestClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.SupportFeatureRequestClick,
    });
  }, [trackEvent]);

  const handleIssueClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.SupportIssueClick,
    });
  }, [trackEvent]);

  return (
    <div className={CLASS_NAME}>
      <a
        href="https://docs.amplication.com"
        target="docs"
        rel="noopener"
        onClick={handleDocsClick}
      >
        Docs
      </a>
      <a
        href="https://amplication.com/discord"
        target="community"
        rel="noopener"
        onClick={handleCommunityClick}
      >
        Community
      </a>
      <a
        href="https://github.com/amplication/amplication/issues/new/choose"
        target="githubissue"
        rel="noopener"
        onClick={handleIssueClick}
      >
        Report an issue
      </a>
      <a
        href="https://github.com/amplication/amplication/issues/new/choose"
        target="githubfeature"
        rel="noopener"
        onClick={handleFeatureRequestClick}
      >
        Submit a feature request
      </a>
    </div>
  );
};

export default SupportMenu;
