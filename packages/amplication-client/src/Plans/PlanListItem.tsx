import { EnumPanelStyle, Panel } from "@amplication/design-system";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { createSubscription as createPaddleSubscription } from "../util/paddle";
import "./PlanListItem.scss";

const ACTION_CHECKOUT = "checkout";
//const ACTION_CONTACT = "contact";

type Plan = {
  name: string;
  price: string;
  productId: number;
  action: string;
  description: string;
  buttonText: string;
};

type Props = {
  plan: Plan;
  currentSubscription: models.Subscription | null;
  workspaceId: string;
  disabled: boolean;
  onPurchaseSuccess: () => void;
};

const CLASS_NAME = "plan-list-item";

function PlanListItem({
  plan,
  currentSubscription,
  workspaceId,
  disabled,
  onPurchaseSuccess,
}: Props) {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "checkoutPlanSelected",
      productId: plan.productId,
    });
    if (plan.action === ACTION_CHECKOUT && plan.productId > 0) {
      createPaddleSubscription(plan.productId, workspaceId, onPurchaseSuccess);
    }
  }, [trackEvent, plan, workspaceId, onPurchaseSuccess]);

  const isCurrentSubscription =
    currentSubscription?.subscriptionPlan === plan.name;

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__title`}>{plan.name}</span>

        <span className="spacer" />
        {!isCurrentSubscription && (
          <Button
            onClick={handleClick}
            disabled={disabled}
            buttonStyle={EnumButtonStyle.Primary}
          >
            {plan.buttonText}
          </Button>
        )}
      </div>
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__title`}>{plan.price}</span>
      </div>
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__description`}>{plan.description}</span>
      </div>
      {isCurrentSubscription && (
        <div className={`${CLASS_NAME}__row`}>
          {currentSubscription?.nextBillDate} <br />
          {currentSubscription?.cancelUrl}
          <br />
          {currentSubscription?.updateUrl}
        </div>
      )}
    </Panel>
  );
}

export default PlanListItem;
