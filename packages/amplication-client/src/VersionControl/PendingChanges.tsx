import React, { useState, useCallback, useContext } from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { formatError } from "../util/error";
import PendingChange from "./PendingChange";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Dialog, Snackbar, Tooltip } from "@amplication/design-system";
import Commit from "./Commit";
import DiscardChanges from "./DiscardChanges";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

import "./PendingChanges.scss";
import { AppContext } from "../context/appContext";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";

const CLASS_NAME = "pending-changes";

type Props = {
  projectId: string;
};

const PendingChanges = ({ projectId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const { currentWorkspace, currentProject, pendingChanges } = useContext(
    AppContext
  );
  const {
    pendingChangesByResource,
    pendingChangesDataError,
    pendingChangesIsError,
    pendingChangesDataLoading,
  } = usePendingChanges(currentProject);
  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
  }, []);

  const errorMessage = formatError(pendingChangesDataError);

  const noChanges = isEmpty(pendingChanges);

  return (
    <div className={CLASS_NAME}>
      <h5 className={`${CLASS_NAME}__title`}>Pending changes</h5>
      <Commit projectId={projectId} noChanges={noChanges} />
      <Dialog
        className="discard-dialog"
        isOpen={discardDialogOpen}
        onDismiss={handleToggleDiscardDialog}
        title="Discard Changes"
      >
        <DiscardChanges
          projectId={projectId}
          onComplete={handleDiscardDialogCompleted}
          onCancel={handleToggleDiscardDialog}
        />
      </Dialog>

      <div className={`${CLASS_NAME}__changes-wrapper`}>
        {pendingChangesDataLoading ? (
          <span>Loading...</span>
        ) : isEmpty(pendingChanges) && !pendingChangesDataLoading ? (
          <div className={`${CLASS_NAME}__empty-state`}>
            <SvgThemeImage image={EnumImages.NoChanges} />
            <div className={`${CLASS_NAME}__empty-state__title`}>
              No pending changes! keep working.
            </div>
          </div>
        ) : (
          <div className={`${CLASS_NAME}__changes`}>
            {pendingChangesByResource.map((group) => (
              <div key={group.resource.id}>
                <div className={`${CLASS_NAME}__changes__resource`}>
                  <ResourceCircleBadge
                    type={group.resource.resourceType}
                    size="xsmall"
                  />
                  <span>{group.resource.name}</span>
                </div>
                {group.changes.map((change) => (
                  <PendingChange
                    key={change.originId}
                    change={change}
                    linkToOrigin
                  />
                ))}
              </div>
            ))}
          </div>
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
      <Snackbar open={Boolean(pendingChangesIsError)} message={errorMessage} />
    </div>
  );
};

export default PendingChanges;
