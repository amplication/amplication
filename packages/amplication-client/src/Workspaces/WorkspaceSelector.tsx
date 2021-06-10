import React, { useCallback, useEffect, useState } from "react";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { setToken } from "../authentication/authentication";
import { CircleBadge, Dialog } from "@amplication/design-system";
import * as models from "../models";
import WorkspaceSelectorList from "./WorkspaceSelectorList";
import NewWorkspace from "./NewWorkspace";
import "./WorkspaceSelector.scss";

type TData = {
  currentWorkspace: models.Workspace;
};

type TSetData = {
  setCurrentWorkspace: {
    token: string;
  };
};

export const COLOR = "#A787FF";
const CLASS_NAME = "workspaces-selector";

function WorkspaceSelector() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newWorkspace, setNewWorkspace] = useState<boolean>(false);

  const apolloClient = useApolloClient();
  const history = useHistory();

  const [setCurrentWorkspace, { data: setCurrentData }] = useMutation<TSetData>(
    SET_CURRENT_WORKSPACE
  );

  const handleSetCurrentWorkspace = useCallback(
    (workspace: models.Workspace) => {
      setIsOpen(false);
      setCurrentWorkspace({
        variables: {
          workspaceId: workspace.id,
        },
      }).catch(console.error);
    },
    [setCurrentWorkspace]
  );

  useEffect(() => {
    if (setCurrentData) {
      apolloClient.clearStore();
      setToken(setCurrentData.setCurrentWorkspace.token);
      history.replace("/");
      window.location.reload();
    }
  }, [setCurrentData, history, apolloClient]);

  const handleNewWorkspaceClick = useCallback(() => {
    setNewWorkspace(!newWorkspace);
  }, [newWorkspace, setNewWorkspace]);

  const handleOpen = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  const { data, loading } = useQuery<TData>(GET_CURRENT_WORKSPACE);

  return (
    <div className={CLASS_NAME}>
      <Dialog
        className="new-entity-dialog"
        isOpen={newWorkspace}
        onDismiss={handleNewWorkspaceClick}
        title="New Workspace"
      >
        <NewWorkspace onWorkspaceCreated={handleSetCurrentWorkspace} />
      </Dialog>
      <div
        className={classNames(`${CLASS_NAME}__current`, {
          [`${CLASS_NAME}__current--active`]: isOpen,
        })}
        onClick={handleOpen}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <CircleBadge
              name={data?.currentWorkspace.name || ""}
              color={COLOR}
            />
            <span className={`${CLASS_NAME}__current__name`}>
              {data?.currentWorkspace.name}
            </span>
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              disabled={loading}
              type="button"
              icon="code"
            />
          </>
        )}
      </div>
      {isOpen && data && (
        <WorkspaceSelectorList
          onNewWorkspaceClick={handleNewWorkspaceClick}
          selectedWorkspace={data.currentWorkspace}
          onWorkspaceSelected={handleSetCurrentWorkspace}
        />
      )}
    </div>
  );
}

export default WorkspaceSelector;

export const GET_CURRENT_WORKSPACE = gql`
  query getCurrentWorkspace {
    currentWorkspace {
      id
      name
    }
  }
`;

const SET_CURRENT_WORKSPACE = gql`
  mutation setCurrentWorkspace($workspaceId: String!) {
    setCurrentWorkspace(data: { id: $workspaceId }) {
      token
    }
  }
`;
