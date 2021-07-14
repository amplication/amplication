import "@rmwc/snackbar/styles";
import React, { useMemo, useCallback, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { useTracking } from "../util/analytics";
import "./Subscription.scss";
import * as models from "../models";
import PlanList from "../Plans/PlanList";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  cancelSubscription as cancelPaddleSubscription,
  updateSubscription as updatePaddleSubscription,
} from "../util/paddle";
import { EnumPanelStyle, Panel } from "@amplication/design-system";
import { format } from "date-fns";

const CLASS_NAME = "subscription";

type TSubscriptionsData = {
  subscriptions: models.Subscription[];
};

const POLL_INTERVAL = 2000;

function Subscription() {
  const [transactionCompleted, setTransactionCompleted] = useState<Boolean>(
    false
  );
  const { trackEvent } = useTracking();

  const { data: subscriptionsData, startPolling, stopPolling } = useQuery<
    TSubscriptionsData
  >(GET_ACTIVE_SUBSCRIPTIONS);

  const onTransactionSuccess = useCallback(() => {
    setTransactionCompleted(true);
    startPolling(POLL_INTERVAL);
  }, [startPolling]);

  const currentSubscription = useMemo(() => {
    if (!subscriptionsData || subscriptionsData.subscriptions.length === 0)
      return null;
    return subscriptionsData.subscriptions[0];
  }, [subscriptionsData]);

  const handleCancelSubscription = useCallback(() => {
    if (currentSubscription && currentSubscription.cancelUrl) {
      trackEvent({
        eventName: "cancelSubscription",
        productId: currentSubscription.workspaceId,
        cancelUrl: currentSubscription.cancelUrl,
      });

      cancelPaddleSubscription(
        currentSubscription.cancelUrl,
        currentSubscription.workspaceId,
        onTransactionSuccess
      );
    }
  }, [trackEvent, onTransactionSuccess, currentSubscription]);

  const handleUpdateSubscription = useCallback(() => {
    if (currentSubscription && currentSubscription.updateUrl) {
      trackEvent({
        eventName: "updateSubscription",
        productId: currentSubscription.workspaceId,
        cancelUrl: currentSubscription.updateUrl,
      });

      updatePaddleSubscription(
        currentSubscription.updateUrl,
        currentSubscription.workspaceId,
        onTransactionSuccess
      );
    }
  }, [trackEvent, onTransactionSuccess, currentSubscription]);

  //cleanup polling
  useEffect(() => {
    if (subscriptionsData && subscriptionsData.subscriptions.length > 0) {
      stopPolling();
      setTransactionCompleted(false);
    }
    return () => {
      stopPolling();
    };
  }, [stopPolling, subscriptionsData]);

  const nextBillDate = currentSubscription?.nextBillDate
    ? new Date(currentSubscription?.nextBillDate)
    : undefined;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h2>Workspace Plan</h2>
      </div>
      {transactionCompleted ? (
        <div className={`${CLASS_NAME}__processing`}>
          <div>Processing...please wait...</div>
          <CircularProgress />
        </div>
      ) : currentSubscription ? (
        <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
          <div className={`${CLASS_NAME}__row`}>
            <h3>{currentSubscription?.subscriptionPlan} Plan</h3>
            <div>
              Your plan will be automatically renewed on{" "}
              {nextBillDate && format(nextBillDate, "PP")}.<br /> It will be
              charged as one payment of ${currentSubscription?.price}.
            </div>
            {currentSubscription?.status !==
              models.EnumSubscriptionStatus.Active &&
              currentSubscription?.status}{" "}
            <br />
            <br />
            <Button
              className={`${CLASS_NAME}__cancel`}
              buttonStyle={EnumButtonStyle.Secondary}
              onClick={handleCancelSubscription}
              icon="trash_2"
            >
              Cancel Subscription
            </Button>
            <Button
              className={`${CLASS_NAME}__cancel`}
              buttonStyle={EnumButtonStyle.Secondary}
              onClick={handleUpdateSubscription}
              icon="edit"
            >
              Update payment details
            </Button>
          </div>
        </Panel>
      ) : (
        <PlanList onPurchaseSuccess={onTransactionSuccess} />
      )}
    </div>
  );
}

export default Subscription;

export const GET_ACTIVE_SUBSCRIPTIONS = gql`
  query getActiveSubscriptions {
    subscriptions(where: { status: { not: Deleted } }) {
      id
      workspaceId
      subscriptionPlan
      status
      nextBillDate
      cancelUrl
      updateUrl
      price
    }
  }
`;
