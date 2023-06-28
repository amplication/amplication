import { Popover } from "@amplication/ui/design-system";
import React, { useCallback, useContext } from "react";
import MenuItem from "../Layout/MenuItem";
import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./PurchaseMenuItem.scss";
import * as models from "../models";

const CLASS_NAME = "purchase-menu-item";

function PurchaseButton() {
  const { currentWorkspace } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeOnSideBarClick,
    });
  }, []);

  return (
    (!currentWorkspace?.subscription ||
      currentWorkspace?.subscription?.subscriptionPlan ===
        models.EnumSubscriptionPlan.Free) && (
      <Popover
        className={`${CLASS_NAME}__popover`}
        content={
          <span>
            Enjoy{" "}
            <span className={`${CLASS_NAME}__popover__highlight`}>
              2 months
            </span>{" "}
            of our Pro plan absolutely{" "}
            <span className={`${CLASS_NAME}__popover__highlight`}>FREE</span>.
          </span>
        }
        onOpen={() => {}}
        placement="right"
      >
        <div className={CLASS_NAME}>
          <MenuItem
            to={`/${currentWorkspace.id}/purchase`}
            icon="gift"
            hideTooltip
            onClick={handleClick}
            title=""
          />
        </div>
      </Popover>
    )
  );
}

export default PurchaseButton;
