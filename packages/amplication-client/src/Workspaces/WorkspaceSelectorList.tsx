import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@amplication/design-system";
import React from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import WorkspaceSelectorListItem from "./WorkspaceSelectorListItem";

type TData = {
  workspaces: models.Workspace[];
};

const CLASS_NAME = "workspaces-selector__list";

type Props = {
  selectedWorkspace: models.Workspace;
  onWorkspaceSelected: (workspace: models.Workspace) => void;
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
        <CircularProgress />
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
          <div className={`${CLASS_NAME}__new`}>
            <Button
              buttonStyle={EnumButtonStyle.Text}
              disabled={loading}
              type="button"
              icon="plus"
              onClick={onNewWorkspaceClick}
            >
              Create new workspace
            </Button>
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
      }
    }
  }
`;
