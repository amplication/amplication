import React, { useCallback } from "react";
import { useTracking } from "../util/analytics";
import "./SupportMenu.scss";

const CLASS_NAME = "support-menu";

const SupportMenu = () => {
  const { trackEvent } = useTracking();

  const handleDocsClick = useCallback(() => {
    trackEvent({
      eventName: "supportDocsClick",
    });
  }, [trackEvent]);

  const handleCommunityClick = useCallback(() => {
    trackEvent({
      eventName: "supportCommunityClick",
    });
  }, [trackEvent]);

  const handleFeatureRequestClick = useCallback(() => {
    trackEvent({
      eventName: "supportFeatureRequestClick",
    });
  }, [trackEvent]);

  const handleIssueClick = useCallback(() => {
    trackEvent({
      eventName: "supportIssueClick",
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
        href="https://discord.gg/Z2CG3rUFnu"
        target="community"
        rel="noopener"
        onClick={handleCommunityClick}
      >
        Community
      </a>
      <a
        href="https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title="
        target="githubissue"
        rel="noopener"
        onClick={handleIssueClick}
      >
        Report an issue
      </a>
      <a
        href="https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title="
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
