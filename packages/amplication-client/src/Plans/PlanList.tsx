import "@rmwc/snackbar/styles";
import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import PlanListItem from "./PlanListItem";
import { default as plans } from "./plans.json";
import * as models from "../models";
import { GET_CURRENT_WORKSPACE } from "../Workspaces/WorkspaceSelector";

const CLASS_NAME = "plan-list";

type TData = {
  currentWorkspace: models.Workspace;
};

type TSubscriptionsData = {
  subscriptions: models.Subscription[];
};

type Props = {
  onPurchaseSuccess: () => void;
};

function PlanList({ onPurchaseSuccess }: Props) {
  const { data, loading } = useQuery<TData>(GET_CURRENT_WORKSPACE);

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
      {plans?.plans.map((plan) => {
        return (
          <PlanListItem
            key={plan.name}
            currentSubscription={currentSubscription}
            plan={plan}
            workspaceId={data?.currentWorkspace.id || ""}
            disabled={loading}
            onPurchaseSuccess={onPurchaseSuccess}
          />
        );
      })}
    </div>
  );
}

export default PlanList;

export const GET_ACTIVE_SUBSCRIPTIONS = gql`
  query getActiveSubscriptions {
    subscriptions(where: { status: { not: Deleted } }) {
      id
      subscriptionPlan
      status
      nextBillDate
      cancelUrl
      updateUrl
    }
  }
`;
