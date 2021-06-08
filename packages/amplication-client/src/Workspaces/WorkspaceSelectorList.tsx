import { CircleBadge } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { CircularProgress } from "@rmwc/circular-progress";
import { Button, EnumButtonStyle } from "../Components/Button";
import React, { useCallback } from "react";
import * as models from "../models";
import { COLOR } from "./WorkspaceSelector";

type TData = {
  workspaces: models.Workspace[];
};

const CLASS_NAME = "workspaces-selector__list";

type Props = {
  selectedWorkspace: models.Workspace;
};

function WorkspaceSelectorList({ selectedWorkspace }: Props) {
  const handleClick = useCallback(() => {}, []);

  const { data, loading } = useQuery<TData>(GET_WORKSPACES);

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {data?.workspaces.map((workspace) => (
            <div
              className={classNames(`${CLASS_NAME}__item`, {
                [`${CLASS_NAME}__item--active`]:
                  selectedWorkspace.id === workspace.id,
              })}
              key={workspace.id}
              onClick={handleClick}
            >
              <CircleBadge name={workspace.name} color={COLOR} />

              {workspace.name}
            </div>
          ))}
          <div className={`${CLASS_NAME}__new`}>
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              disabled={loading}
              type="button"
              icon="plus"
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
    }
  }
`;
