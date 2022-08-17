import React, { useState, useCallback, useContext, useMemo } from "react";
import { ApolloError } from "@apollo/client";
import { groupBy, isEmpty } from "lodash";
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

const CLASS_NAME = "pending-changes";

type Props = {
  projectId: string;
  error: ApolloError | undefined;
  loading: boolean;
};

const PendingChanges = ({ projectId, error, loading }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const { currentWorkspace, currentProject, pendingChanges } = useContext(
    AppContext
  );

  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
  }, []);

  const errorMessage = formatError(error);

  const noChanges = isEmpty(pendingChanges);

  const pendingChangesByResource = useMemo(() => {
    const groupedChanges = groupBy(
      pendingChanges,
      (change) => change.resource.id
    );

    return Object.entries(groupedChanges).map(([resourceId, changes]) => {
      return {
        resource: changes[0].resource,
        changes: changes,
      };
    });
  }, [pendingChanges]);

  return (
    <div className={CLASS_NAME}>
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
        {loading ? (
          <span>Loading...</span>
        ) : isEmpty(pendingChanges) && !loading ? (
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
                    resourceId={projectId}
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
          <Tooltip aria-label={"Compare Changes"} direction="sw">
            <Link
              to={`/${currentWorkspace?.id}/${currentProject?.id}/pending-changes`}
            >
              <Button
                buttonStyle={EnumButtonStyle.Text}
                disabled={loading || noChanges}
                icon="compare"
              />
            </Link>
          </Tooltip>
          <Tooltip aria-label={"Discard Pending Changes"} direction="sw">
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={handleToggleDiscardDialog}
              disabled={loading || noChanges}
              icon="trash_2"
            />
          </Tooltip>
        </div>
      </div>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default PendingChanges;
