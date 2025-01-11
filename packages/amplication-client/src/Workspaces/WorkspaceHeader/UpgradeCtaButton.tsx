import {
  Button,
  ButtonProgress,
  EnumButtonStyle,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useMemo } from "react";
import { useUpgradeButtonData } from "../hooks/useUpgradeButtonData";

import { BillingFeature } from "@amplication/util-billing-types";
import { useHistory } from "react-router-dom";
import { FeatureIndicator } from "../../Components/FeatureIndicator";
import { AppContext } from "../../context/appContext";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useContactUs } from "../hooks/useContactUs";

const CLASS_NAME = "workspace-header";

const UpgradeCtaButton = () => {
  const { currentWorkspace } = useContext(AppContext);

  const history = useHistory();

  const { trackEvent } = useTracking();
  const upgradeButtonData = useUpgradeButtonData(currentWorkspace);

  const { handleContactUsClick } = useContactUs({
    actionName: "Contact Us",
    eventOriginLocation: "workspace-header-help-menu",
  });

  const daysLeftText = useMemo(() => {
    return `${upgradeButtonData.trialDaysLeft} day${
      upgradeButtonData.trialDaysLeft !== 1 ? "s" : ""
    } left for the free trial`;
  }, [upgradeButtonData.trialDaysLeft]);

  const handleUpgradeClick = useCallback(() => {
    history.push(`/${currentWorkspace.id}/purchase`, {
      from: { pathname: window.location.pathname },
    });
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: "workspace-header",
      workspace: currentWorkspace.id,
    });
  }, [currentWorkspace.id, history, trackEvent]);

  return (
    <>
      {upgradeButtonData.isCompleted &&
        upgradeButtonData.showUpgradeTrialButton && (
          <ButtonProgress
            className={`${CLASS_NAME}__upgrade__btn`}
            onClick={handleUpgradeClick}
            progress={upgradeButtonData.trialLeftProgress}
            leftValue={daysLeftText}
            yellowColorThreshold={50}
            redColorThreshold={0}
          >
            Upgrade
          </ButtonProgress>
        )}
      {upgradeButtonData.isCompleted &&
        upgradeButtonData.showUpgradeDefaultButton && (
          <Button
            className={`${CLASS_NAME}__upgrade__btn`}
            buttonStyle={EnumButtonStyle.Outline}
            onClick={handleUpgradeClick}
          >
            Upgrade
          </Button>
        )}
    </>
  );
};

export default UpgradeCtaButton;
