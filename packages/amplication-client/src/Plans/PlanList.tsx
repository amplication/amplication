import { useQuery } from "@apollo/client";
import React from "react";
import * as models from "../models";
import { GET_CURRENT_WORKSPACE } from "../Workspaces/WorkspaceSelector";
import PlanListItem from "./PlanListItem";
import { default as plans } from "./plans.json";

const CLASS_NAME = "plan-list";

type TData = {
  currentWorkspace: models.Workspace;
};

type Props = {
  onPurchaseSuccess: () => void;
};

function PlanList({ onPurchaseSuccess }: Props) {
  const { data, loading } = useQuery<TData>(GET_CURRENT_WORKSPACE);

  return (
    <div className={CLASS_NAME}>
      {plans?.plans.map((plan) => {
        return (
          <PlanListItem
            key={plan.name}
            currentSubscription={null}
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
