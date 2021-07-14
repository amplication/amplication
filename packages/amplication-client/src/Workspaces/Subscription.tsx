import "@rmwc/snackbar/styles";
import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import "./Subscription.scss";
import * as models from "../models";
import PlanList from "../Plans/PlanList";

const CLASS_NAME = "subscription";

type TSubscriptionsData = {
  subscriptions: models.Subscription[];
};

function Subscription() {
  const { data: subscriptionsData } = useQuery<TSubscriptionsData>(
    GET_ACTIVE_SUBSCRIPTIONS
  );

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
      {currentSubscription ? (
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
        <PlanList />
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
