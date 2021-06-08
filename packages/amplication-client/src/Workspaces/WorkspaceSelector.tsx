import React from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { CircleBadge } from "@amplication/design-system";
import { Icon } from "@rmwc/icon";
import * as models from "../models";
import "./WorkspaceSelector.scss";

type TData = {
  currentWorkspace: models.Workspace;
};

const COLOR = "#A787FF";
const CLASS_NAME = "workspaces-selector";

function WorkspaceSelector() {
  const { data, loading } = useQuery<TData>(GET_CURRENT_WORKSPACE);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__current`}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <CircleBadge
              name={data?.currentWorkspace.name || ""}
              color={COLOR}
            />

            {data?.currentWorkspace.name}
            <Icon icon="sort_default" />
          </>
        )}
      </div>
    </div>
  );
}

export default WorkspaceSelector;

const GET_CURRENT_WORKSPACE = gql`
  query getCurrentWorkspace {
    currentWorkspace {
      id
      name
    }
  }
`;
