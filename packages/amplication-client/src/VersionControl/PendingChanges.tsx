import {
  CircularProgress,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { formatError } from "../util/error";
import Commit, { CommitBtnType } from "./Commit";
import DiscardChanges from "./DiscardChanges";

import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { AppContext } from "../context/appContext";
import "./PendingChanges.scss";
import PendingChangesList from "./PendingChangesList";

const CLASS_NAME = "pending-changes";

type Props = {
  projectId: string;
};

const PendingChanges = ({ projectId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const history = useHistory();
  const {
    currentWorkspace,
    currentProject,
    pendingChanges,
    currentResource,
    isPreviewPlan,
  } = useContext(AppContext);

  const entityMatch = useRouteMatch<{
    workspace: string;
    project: string;
    resource: string;
    entity: string;
  }>("/:workspace/:project/:resource/entities/:entity");
  const {
    pendingChangesDataError,
    pendingChangesIsError,
    pendingChangesDataLoading,
  } = usePendingChanges(currentProject);
  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
    if (entityMatch) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities`
      );
    }
  }, [
    entityMatch,
    history,
    currentWorkspace?.id,
    currentProject?.id,
    currentResource?.id,
  ]);

  const errorMessage = formatError(pendingChangesDataError);

  const noChanges = isEmpty(pendingChanges);

  return (
    <div className={CLASS_NAME}>
      <Text textStyle={EnumTextStyle.H4}>Pending changes</Text>
      <FlexItem
        itemsAlign={EnumItemsAlign.Stretch}
        direction={EnumFlexDirection.Column}
        margin={EnumFlexItemMargin.Top}
        gap={EnumGapSize.Small}
      >
        {!isPreviewPlan && (
          <Commit
            projectId={projectId}
            noChanges={noChanges}
            commitBtnType={CommitBtnType.Button}
          />
        )}

        <DiscardChanges
          isOpen={discardDialogOpen}
          projectId={projectId}
          onComplete={handleDiscardDialogCompleted}
          onDismiss={handleToggleDiscardDialog}
        />

        <div className={`${CLASS_NAME}__changes-wrapper`}>
          {pendingChangesDataLoading ? (
            <CircularProgress centerToParent />
          ) : (
            <PendingChangesList />
          )}
          <hr className={`${CLASS_NAME}__divider`} />
          <div className={`${CLASS_NAME}__changes-header`}>
            <span>Changes</span>
            <span
              className={
                pendingChanges.length
                  ? `${CLASS_NAME}__changes-count-warning`
                  : `${CLASS_NAME}__changes-count`
              }
            >
              {pendingChanges.length}
            </span>
            <div className="spacer" />
            <Tooltip aria-label={"Compare Changes"} direction="nw">
              <Link
                to={`/${currentWorkspace?.id}/${currentProject?.id}/pending-changes`}
              >
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  disabled={pendingChangesDataLoading || noChanges}
                  icon="compare"
                />
              </Link>
            </Tooltip>
            <Tooltip aria-label={"Discard Pending Changes"} direction="nw">
              <Button
                buttonStyle={EnumButtonStyle.Text}
                onClick={handleToggleDiscardDialog}
                disabled={pendingChangesDataLoading || noChanges}
                icon="trash_2"
              />
            </Tooltip>
          </div>
        </div>
      </FlexItem>

      <Snackbar open={Boolean(pendingChangesIsError)} message={errorMessage} />
    </div>
  );
};

export default PendingChanges;
