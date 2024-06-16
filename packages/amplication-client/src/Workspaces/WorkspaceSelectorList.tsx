import { gql, useQuery } from "@apollo/client";
import {
  CircularProgress,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import React, { useMemo } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import WorkspaceSelectorListItem from "./WorkspaceSelectorListItem";
import {
  LicenseIndicatorContainer,
  LicensedResourceType,
} from "../Components/LicenseIndicatorContainer";
import { BillingFeature } from "@amplication/util-billing-types";

type TData = {
  workspaces: models.Workspace[];
};

const CLASS_NAME = "workspaces-selector__list";

type Props = {
  selectedWorkspace: models.Workspace;
  onWorkspaceSelected: (workspaceId: string) => void;
  onNewWorkspaceClick: () => void;
};

function WorkspaceSelectorList({
  selectedWorkspace,
  onWorkspaceSelected,
  onNewWorkspaceClick,
}: Props) {
  const { data, loading } = useQuery<TData>(GET_WORKSPACES);

  //order workspaces by subscription plan
  const orderedWorkspaces = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.workspaces.sort((a, b) => {
      if (
        a.subscription?.subscriptionPlan === b.subscription?.subscriptionPlan
      ) {
        return a.name.localeCompare(b.name);
      }
      return a.subscription?.subscriptionPlan.localeCompare(
        b.subscription?.subscriptionPlan
      );
    });
  }, [data]);

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          {orderedWorkspaces.map((workspace) => (
            <WorkspaceSelectorListItem
              onWorkspaceSelected={onWorkspaceSelected}
              workspace={workspace}
              selected={selectedWorkspace.id === workspace.id}
              key={workspace.id}
            />
          ))}

          <hr className={`${CLASS_NAME}__divider`} />

          <div className={`${CLASS_NAME}__new`}>
            <LicenseIndicatorContainer
              licensedResourceType={LicensedResourceType.Workspace}
              blockByFeatureId={BillingFeature.BlockWorkspaceCreation}
            >
              <Button
                buttonStyle={EnumButtonStyle.Text}
                disabled={loading}
                type="button"
                icon="plus"
                className={`${CLASS_NAME}__button`}
                iconPosition={EnumIconPosition.Left}
                onClick={onNewWorkspaceClick}
              >
                Create new workspace
              </Button>
            </LicenseIndicatorContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkspaceSelectorList;

const GET_WORKSPACES = gql`
  query getWorkspaces {
    workspaces {
      id
      name
      subscription {
        id
        subscriptionPlan
        status
      }
    }
  }
`;
