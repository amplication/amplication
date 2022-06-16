import React, { useCallback, useContext, useState } from "react";
import classNames from "classnames";
import PendingChangesBar from "../VersionControl/PendingChangesBar";
import "./PendingChangesMenuItem.scss";
import { AsidePanel } from "../util/teleporter";
import PendingChangesContext from "./PendingChangesContext";
import { Tooltip } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "pending-changes-menu-item";

const DIRECTION = "nw";
const ICON_SIZE = "medium";

const PendingChangesMenuItem = ({ applicationId }: Props) => {
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  const pendingChangesContext = useContext(PendingChangesContext);

  const handleClick = useCallback(() => {
    setPanelOpen(!panelOpen);
  }, [panelOpen, setPanelOpen]);

  const pendingChanges = pendingChangesContext.pendingChanges;

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
          <PendingChangesBar
            applicationId={applicationId}
            handleClick={handleClick}
          />
        </AsidePanel.Source>
      )}
    </div>
  );
};

export default PendingChangesMenuItem;
