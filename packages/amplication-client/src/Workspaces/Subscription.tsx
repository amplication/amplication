import "@rmwc/snackbar/styles";
import React, { useMemo, useCallback, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";

import "./Subscription.scss";
import * as models from "../models";
import PlanList from "../Plans/PlanList";

const CLASS_NAME = "subscription";

type TSubscriptionsData = {
  subscriptions: models.Subscription[];
};

const POLL_INTERVAL = 2000;

function Subscription() {
  const [purchaseCompleted, setPurchaseCompleted] = useState<Boolean>(false);

  const { data: subscriptionsData, startPolling, stopPolling } = useQuery<
    TSubscriptionsData
  >(GET_ACTIVE_SUBSCRIPTIONS);

  const onPurchaseSuccess = useCallback(() => {
    setPurchaseCompleted(true);
    startPolling(POLL_INTERVAL);
  }, [startPolling]);

  //cleanup polling
  useEffect(() => {
    if (subscriptionsData && subscriptionsData.subscriptions.length > 0) {
      stopPolling();
      setPurchaseCompleted(false);
    }
    return () => {
      stopPolling();
    };
  }, [stopPolling, subscriptionsData]);

  const currentSubscription = useMemo(() => {
    if (!subscriptionsData || subscriptionsData.subscriptions.length === 0)
      return null;
    return subscriptionsData.subscriptions[0];
  }, [subscriptionsData]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h2>Workspace Plan</h2>
      </div>
      {purchaseCompleted ? (
        <div className={`${CLASS_NAME}__processing`}>
          <div>Processing...please wait...</div>
          <CircularProgress />
        </div>
      ) : currentSubscription ? (
        <div className={`${CLASS_NAME}__row`}>
          <h3>{currentSubscription?.subscriptionPlan} Plan</h3>
          <div>
            Next estimated bill: ${currentSubscription?.price} Autopay on{" "}
            {currentSubscription?.nextBillDate}
          </div>
          {currentSubscription?.status} <br />
          <br />
          {currentSubscription?.cancelUrl}
          <br />
          {currentSubscription?.updateUrl}
        </div>
      ) : (
        <PlanList onPurchaseSuccess={onPurchaseSuccess} />
      )}
    </div>
  );
}

export default Subscription;

export const GET_ACTIVE_SUBSCRIPTIONS = gql`
  query getActiveSubscriptions {
    subscriptions(where: { status: { not: Deleted } }) {
      id
      subscriptionPlan
      status
      nextBillDate
      cancelUrl
      updateUrl
      price
    }
  }
`;
