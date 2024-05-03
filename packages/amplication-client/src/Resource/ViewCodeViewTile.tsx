import { useCallback, useContext } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function ViewCodeViewTile({ resourceId }: Props) {
  const { trackEvent } = useTracking();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.CodeViewTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      icon="code"
      title="Code View"
      message="Amplication generates the code automatically. You can use the 'Code View' page to view and explore the generated code."
      onClick={handleClick}
      to={`/${currentWorkspace?.id}/${currentProject?.id}/code-view`}
    />
  );
}

export default ViewCodeViewTile;
