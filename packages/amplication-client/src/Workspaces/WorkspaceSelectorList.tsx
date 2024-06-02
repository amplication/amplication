import { gql, useQuery } from "@apollo/client";
import {
  CircularProgress,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import React from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import WorkspaceSelectorListItem from "./WorkspaceSelectorListItem";
import { LicenseIndicatorContainer } from "../Components/LicenseIndicatorContainer";
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

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          {data?.workspaces.map((workspace) => (
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
              featureId={BillingFeature.BlockWorkspaceCreation}
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
