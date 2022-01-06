import React, { useCallback, useState } from "react";
import classNames from "classnames";
import MenuItemWithFixedPanel from "../Layout/MenuItemWithFixedPanel";
import PendingChangesBar from "../VersionControl/PendingChangesBar";
import "./PendingChangesMenuItem.scss";

type Props = {
  isOpen: boolean;
  badgeValue?: string | null;
  panelKey: string;
  applicationId: string;
  onClick: (panelKey: string) => void;
};

const CLASS_NAME = "pending-changes-menu-item";
const LOCAL_STORAGE_KEY = "pendingChangesPopoverDismissed";

const PendingChangesMenuItem = ({
  isOpen,
  badgeValue,
  panelKey,
  applicationId,
  onClick,
}: Props) => {
  const [popoverDismissed, setPopoverDismissed] = useState(
    Boolean(localStorage.getItem(LOCAL_STORAGE_KEY))
  );

  const handleClick = useCallback(
    (panelKey: string) => {
      localStorage.setItem("pendingChangesPopoverDismissed", "true");
      setPopoverDismissed(true);
      onClick(panelKey);
    },
    [onClick]
  );

  const pendingChangesPopoverOpen =
    Boolean(badgeValue) && !isOpen && !popoverDismissed;

  const popoverOpenClassName = `${CLASS_NAME}--popover-open`;

  return (
    <div
      className={classNames(CLASS_NAME, {
        [popoverOpenClassName]: pendingChangesPopoverOpen,
      })}
    >
      <MenuItemWithFixedPanel
        tooltip="Pending Changes"
        icon="pending_changes_outline"
        isOpen={isOpen}
        panelKey={panelKey}
        badgeValue={badgeValue}
        onClick={handleClick}
      >
        <PendingChangesBar applicationId={applicationId} />
      </MenuItemWithFixedPanel>
    </div>
  );
};

export default PendingChangesMenuItem;
