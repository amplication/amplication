import React, { useState, useCallback } from "react";
import classNames from "classnames";
import { format } from "date-fns";
import { Icon } from "@rmwc/icon";

import * as models from "../models";
import { Panel, EnumPanelStyle } from "../Components/Panel";
import { Button, EnumButtonStyle } from "../Components/Button";
import PendingChangeDiff from "./PendingChangeDiff";

const CLASS_NAME = "pending-change";
const ENTITY = "Entity";

const RESOURCE_TYPE_TO_LABEL_AND_ICON: {
  [key: string]: {
    label: string;
    icon: string;
  };
} = {
  Entity: {
    label: "Entity",
    icon: "entity",
  },
  EntityPage: {
    label: "Entity Page",
    icon: "pages",
  },
};

type Props = {
  change: models.PendingChange;
};

const PendingChange = ({ change }: Props) => {
  const [expandDiff, setExpandDiff] = useState<boolean>(false);

  const resourceType =
    change.resourceType === models.EnumPendingChangeResourceType.Entity
      ? ENTITY
      : (change.resource as models.Block).blockType;

  const handleToggleClick = useCallback(() => {
    setExpandDiff(!expandDiff);
  }, [setExpandDiff, expandDiff]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__time`}>
        {format(new Date(change.resource.updatedAt), "p")}
      </div>

      <Panel
        panelStyle={EnumPanelStyle.Bordered}
        className={`${CLASS_NAME}__details`}
        shadow
      >
        <div
          className={classNames(
            `${CLASS_NAME}__action`,
            change.action.toLowerCase()
          )}
        >
          {change.action}
        </div>
        <div className={`${CLASS_NAME}__resource-type`}>
          <Icon
            icon={{
              icon: RESOURCE_TYPE_TO_LABEL_AND_ICON[resourceType].icon,
              size: "xlarge",
            }}
            title={RESOURCE_TYPE_TO_LABEL_AND_ICON[resourceType].label}
          />
        </div>
        <div>{change.resource.displayName}</div>
        <div className={`${CLASS_NAME}__spacer`} />
        <div className={`${CLASS_NAME}__version`}>V{change.versionNumber}</div>
        <div className={`${CLASS_NAME}__version`}>
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            icon="chevron_right"
            onClick={handleToggleClick}
          />
        </div>
      </Panel>

      {expandDiff && (
        <Panel
          panelStyle={EnumPanelStyle.Bordered}
          className={`${CLASS_NAME}__diff`}
          shadow
        >
          <PendingChangeDiff change={change} />
        </Panel>
      )}
    </div>
  );
};

export default PendingChange;
