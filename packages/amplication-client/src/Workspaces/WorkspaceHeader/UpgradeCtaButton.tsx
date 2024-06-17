import { useCallback, useContext, useMemo } from "react";
import { useUpgradeButtonData } from "../hooks/useUpgradeButtonData";
import {
  Button,
  ButtonProgress,
  EnumButtonStyle,
} from "@amplication/ui/design-system";

import { GET_CONTACT_US_LINK } from "../queries/workspaceQueries";
import { useQuery } from "@apollo/client";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { AppContext } from "../../context/appContext";
import { FeatureIndicator } from "../../Components/FeatureIndicator";
import { BillingFeature } from "@amplication/util-billing-types";
import { CompletePreviewSignupButton } from "../../User/CompletePreviewSignupButton";
import { useHistory } from "react-router-dom";

const CLASS_NAME = "workspace-header";

const UpgradeCtaButton = () => {
  const { currentWorkspace } = useContext(AppContext);

  const history = useHistory();

  const { trackEvent } = useTracking();
  const upgradeButtonData = useUpgradeButtonData(currentWorkspace);

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
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

  const handleContactUsClick = useCallback(() => {
    window.open(data?.contactUsLink, "_blank");
    trackEvent({
      eventName: AnalyticsEventNames.HelpMenuItemClick,
      action: "Contact Us",
      eventOriginLocation: "workspace-header-help-menu",
    });
  }, [data?.contactUsLink, trackEvent]);

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
      {upgradeButtonData.isCompleted &&
        upgradeButtonData.isPreviewPlan &&
        !upgradeButtonData.showUpgradeDefaultButton && (
          <>
            <FeatureIndicator
              featureName={BillingFeature.CodeGenerationBuilds}
              textStart="Generate production-ready code for this architecture with just a few simple clicks"
              showTooltipLink={false}
              element={<CompletePreviewSignupButton />}
            />
            <Button
              className={`${CLASS_NAME}__upgrade__btn`}
              buttonStyle={EnumButtonStyle.Outline}
              onClick={handleContactUsClick}
            >
              Contact us
            </Button>
          </>
        )}
    </>
  );
};

export default UpgradeCtaButton;
