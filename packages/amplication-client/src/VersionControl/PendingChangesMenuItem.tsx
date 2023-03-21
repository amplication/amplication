import React, { useCallback, useContext, useState } from "react";
import classNames from "classnames";
import PendingChangesBar from "../VersionControl/PendingChangesBar";
import "./PendingChangesMenuItem.scss";
import { AsidePanel } from "../util/teleporter";
import { Tooltip } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";

type Props = {
  projectId: string;
};

const CLASS_NAME = "pending-changes-menu-item";

const DIRECTION = "nw";
const ICON_SIZE = "medium";

const PendingChangesMenuItem = ({ projectId }: Props) => {
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const { pendingChanges } = useContext(AppContext);

  const handleClick = useCallback(() => {
    setPanelOpen(!panelOpen);
  }, [panelOpen, setPanelOpen]);

  const pendingChangesBadge =
    (pendingChanges.length && pendingChanges.length.toString()) || null;

  return (
    <div
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--open`]: panelOpen,
      })}
    >
      <div>
        <Tooltip aria-label={"Pending Changes"} direction={DIRECTION} noDelay>
          <Button
            buttonStyle={EnumButtonStyle.Text}
            onClick={handleClick}
            icon="pending_changes_outline"
            iconSize={ICON_SIZE}
          />

          {pendingChangesBadge && (
            <span className={`${CLASS_NAME}__badge`}>
              {pendingChangesBadge}
            </span>
          )}
        </Tooltip>
      </div>
      {panelOpen && (
        <AsidePanel.Source>
          <PendingChangesBar projectId={projectId} handleClick={handleClick} />
        </AsidePanel.Source>
      )}
    </div>
  );
};

export default PendingChangesMenuItem;
