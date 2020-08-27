import React from "react";
import classNames from "classnames";
import { format } from "date-fns";

import * as models from "../models";
import { Panel, EnumPanelStyle } from "../Components/Panel";
import { Button, EnumButtonStyle } from "../Components/Button";

const CLASS_NAME = "pending-change";

type Props = {
  change: models.PendingChange;
};

const PendingChange = ({ change }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div>{change.updatedAt}</div>

      <Panel
        panelStyle={EnumPanelStyle.Bordered}
        className={`${CLASS_NAME}__details`}
        shadow
      >
        <div
          className={classNames(
            `${CLASS_NAME}__action`,
            change.changeType.toLowerCase()
          )}
        >
          {change.changeType}
        </div>
        <div>
          {change.objectType === models.EnumPendingChangeObjectType.Entity
            ? "Entity"
            : change.blockType}
        </div>
        <div>{change.displayName}</div>
        <div className={`${CLASS_NAME}__spacer`} />
        <div className={`${CLASS_NAME}__version`}>V{change.versionNumber}</div>
        <div className={`${CLASS_NAME}__version`}>
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            icon="keyboard_arrow_right"
          />
        </div>
      </Panel>
    </div>
  );
};

export default PendingChange;
