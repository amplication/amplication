import React, { useCallback, useContext, useState } from "react";
import { Icon } from "@rmwc/icon";
import "./PendingChangesBar.scss";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { MenuFixedPanel } from "../util/teleporter";
import { Button, EnumButtonStyle } from "../Components/Button";
import PendingChanges from "./PendingChanges";

const CLASS_NAME = "pending-changes-bar";
const ICON_SIZE = "xlarge";

type Props = {
  applicationId: string;
};

const PendingChangesBar = ({ applicationId }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const [isOpen, setIsOpen] = useState(true);

  const handleClick = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  return (
    <div className={CLASS_NAME}>
      <Button buttonStyle={EnumButtonStyle.Clear} onClick={handleClick}>
        <Icon
          icon={{
            icon: "pending_changes",
            size: ICON_SIZE,
          }}
        />
      </Button>
      <span className={`${CLASS_NAME}__counter`}>
        {pendingChangesContext.pendingChanges.length.toString()}
      </span>
      {isOpen && (
        <MenuFixedPanel.Source>
          <PendingChanges applicationId={applicationId} />
        </MenuFixedPanel.Source>
      )}
    </div>
  );
};

export default PendingChangesBar;
