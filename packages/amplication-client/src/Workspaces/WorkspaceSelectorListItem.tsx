import { CircleBadge } from "@amplication/design-system";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import classNames from "classnames";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { setToken } from "../authentication/authentication";
import * as models from "../models";
import { COLOR } from "./WorkspaceSelector";

type TData = {
  setCurrentWorkspace: {
    token: string;
  };
};

const CLASS_NAME = "workspaces-selector__list__item";

type Props = {
  workspace: models.Workspace;
  selected: boolean;
  onWorkspaceSelected: () => void;
};

function WorkspaceSelectorListItem({
  workspace,
  selected,
  onWorkspaceSelected,
}: Props) {
  const apolloClient = useApolloClient();
  const history = useHistory();

  const [setCurrentWorkspace, { data }] = useMutation<TData>(
    SET_CURRENT_WORKSPACE
  );

  const handleClick = useCallback(() => {
    setCurrentWorkspace({
      variables: {
        workspaceId: workspace.id,
      },
    }).catch(console.error);
  }, [setCurrentWorkspace, workspace]);

  useEffect(() => {
    if (data) {
      apolloClient.clearStore();
      setToken(data.setCurrentWorkspace.token);
      onWorkspaceSelected && onWorkspaceSelected();
      history.replace("/");
      window.location.reload();
    }
  }, [data, history, apolloClient, onWorkspaceSelected]);

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}--active`]: selected,
      })}
      onClick={handleClick}
    >
      <CircleBadge name={workspace.name} color={COLOR} />

      <span className={`${CLASS_NAME}__name`}>{workspace.name}</span>
    </div>
  );
}

export default WorkspaceSelectorListItem;

const SET_CURRENT_WORKSPACE = gql`
  mutation setCurrentWorkspace($workspaceId: String!) {
    setCurrentWorkspace(data: { id: $workspaceId }) {
      token
    }
  }
`;
