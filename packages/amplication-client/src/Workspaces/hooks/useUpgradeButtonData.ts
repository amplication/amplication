import { useStiggContext } from "@stigg/react-sdk";
import { Workspace } from "../../models";
import { BillingPlan } from "@amplication/util-billing-types";
import { useEffect, useState } from "react";
import { REACT_APP_BILLING_ENABLED } from "../../env";

const DAYS_TO_SHOW_VERSION_ALERT_SINCE_END_OF_TRIAL = 7;
const ONE_DAY = 1000 * 60 * 60 * 24;

interface UpgradeButtonData {
  trialDaysLeft?: number;
  trialLeftProgress?: number;
  showUpgradeTrialButton: boolean;
  showUpgradeDefaultButton: boolean;
  isCompleted?: boolean;
}

export const useUpgradeButtonData = (
  currentWorkspace: Workspace
): UpgradeButtonData => {
  const { stigg } = useStiggContext();

  const [upgradeButtonData, setUpgradeButtonData] = useState<UpgradeButtonData>(
    {
      showUpgradeTrialButton: false,
      showUpgradeDefaultButton: true,
    }
  );

  useEffect(() => {
    (async () => {
      if (REACT_APP_BILLING_ENABLED === "false") {
        setUpgradeButtonData({
          showUpgradeTrialButton: false,
          showUpgradeDefaultButton: true,
          isCompleted: true,
        });
        return;
      }

      await stigg.setCustomerId(currentWorkspace.id);
      const [subscription] = await stigg.getActiveSubscriptions();

      if (!subscription) {
        setUpgradeButtonData({
          showUpgradeTrialButton: false,
          showUpgradeDefaultButton: true,
          isCompleted: true,
        });
        return;
      }

      if (subscription.plan.id === BillingPlan.Free) {
        const daysSinceStartOfPlan = Math.abs(
          (Date.now() - new Date(subscription.startDate).getTime()) / ONE_DAY
        );

        const customer = await stigg.getCustomer();
        const previouslyOnTrial = customer.trialedPlans.length > 0;
        const showUpgradeTrialButton =
          previouslyOnTrial &&
          daysSinceStartOfPlan < DAYS_TO_SHOW_VERSION_ALERT_SINCE_END_OF_TRIAL;

        setUpgradeButtonData({
          trialDaysLeft: 0,
          trialLeftProgress: 0,
          showUpgradeTrialButton,
          showUpgradeDefaultButton: !showUpgradeTrialButton,
          isCompleted: true,
        });
      } else if (subscription.trialEndDate) {
        const trialDaysLeft = Math.round(
          Math.abs((subscription.trialEndDate.getTime() - Date.now()) / ONE_DAY)
        );

        const trialLengthInDays = Math.max(
          subscription.plan.defaultTrialConfig?.duration,
          trialDaysLeft
        );
        const trialLeftProgress = (100 * trialDaysLeft) / trialLengthInDays;

        setUpgradeButtonData({
          trialDaysLeft,
          trialLeftProgress,
          showUpgradeTrialButton: true,
          showUpgradeDefaultButton: false,
          isCompleted: true,
        });
      } else {
        setUpgradeButtonData({
          showUpgradeTrialButton: false,
          showUpgradeDefaultButton: false,
          isCompleted: true,
        });
      }
    })();
  }, [currentWorkspace, stigg]);

  return upgradeButtonData;
};
