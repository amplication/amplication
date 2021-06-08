import React, { useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import { CircleBadge } from "@amplication/design-system";
import * as models from "../models";
import WorkspaceSelectorList from "./WorkspaceSelectorList";
import "./WorkspaceSelector.scss";

type TData = {
  currentWorkspace: models.Workspace;
};

export const COLOR = "#A787FF";
const CLASS_NAME = "workspaces-selector";

function WorkspaceSelector() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  const { data, loading } = useQuery<TData>(GET_CURRENT_WORKSPACE);

  return (
    <div className={CLASS_NAME}>
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

            {data?.currentWorkspace.name}
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
        <WorkspaceSelectorList selectedWorkspace={data.currentWorkspace} />
      )}
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
