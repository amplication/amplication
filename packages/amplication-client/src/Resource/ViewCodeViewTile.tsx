import { useCallback } from "react";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function ViewCodeViewTile({ resourceId }: Props) {
  const { trackEvent } = useTracking();
  const { baseUrl } = useProjectBaseUrl();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.CodeViewTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      icon="code"
      title="Code View"
      message="Amplication generates the code automatically. You can use the 'Code View' page to view and explore the generated code."
      onClick={handleClick}
      to={`${baseUrl}/code-view`}
    />
  );
}

export default ViewCodeViewTile;
