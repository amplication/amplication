import { Tooltip } from "@amplication/ui/design-system";
import classNames from "classnames";
import React, { useMemo } from "react";
import * as models from "../models";
import "./PendingChange.scss";
import PendingChangeContent from "./PendingChangeContent";
import PendingChangeServiceTopics from "./PendingChangeServiceTopics";

const CLASS_NAME = "pending-change";
const TOOLTIP_DIRECTION = "ne";

export type EntityLinkAndDisplayName = {
  relativeUrl: string;
  icon: string;
  displayName: string;
  type?: string;
};

type Props = {
  change: models.PendingChange;
  linkToOrigin?: boolean;
};

const ACTION_TO_LABEL: {
  [key in models.EnumPendingChangeAction]: string;
} = {
  [models.EnumPendingChangeAction.Create]: "C",
  [models.EnumPendingChangeAction.Delete]: "D",
  [models.EnumPendingChangeAction.Update]: "U",
};

const PendingChange = ({ change, linkToOrigin = false }: Props) => {
  const content = useMemo((): React.ReactElement | null => {
    if (
      change.originType === models.EnumPendingChangeOriginType.Block &&
      (change.origin as models.Block).blockType ===
        models.EnumBlockType.ServiceTopics
    )
      return (
        <PendingChangeServiceTopics
          change={change}
          linkToOrigin={linkToOrigin}
        />
      );

    const data = changeOriginMap[change.originType](change.origin);

    return (
      <PendingChangeContent
        change={change}
        name={data?.displayName || ""}
        linkToOrigin={linkToOrigin}
        relativeUrl={data?.relativeUrl || ""}
        icon={data?.icon || ""}
        type={data?.type || ""}
      />
    );
  }, [change, linkToOrigin]);

  return (
    <div className={CLASS_NAME}>
      <span className={`${CLASS_NAME}__guide`}></span>
      {content}
    </div>
  );
};

export default PendingChange;

export const changeOriginMap = {
  [models.EnumPendingChangeOriginType.Entity]: (
    change: models.PendingChangeOrigin
  ): EntityLinkAndDisplayName => ({
    relativeUrl: `entities/${change.id}`,
    icon: "entity_outline",
    displayName: change.displayName,
    type: "Entity",
  }),
  [models.EnumPendingChangeOriginType.Block]: (
    change: models.PendingChangeOrigin
  ) => {
    const blockTypeMap: {
      [key in models.EnumBlockType]: EntityLinkAndDisplayName;
    } = {
      [models.EnumBlockType.ServiceSettings]: {
        relativeUrl: `settings/general`,
        icon: "settings",
        displayName: "Service Settings",
        type: "Service Settings",
      },
      [models.EnumBlockType.ProjectConfigurationSettings]: {
        //Todo: link to project setting
        relativeUrl: `settings/update`,
        icon: "settings",
        displayName: "Project Settings",
        type: "Project Settings",
      },
      [models.EnumBlockType.Topic]: {
        relativeUrl: `topics/${change.id}`,
        icon: "topics_outline",
        displayName: change.displayName,
        type: "Topic",
      },
      [models.EnumBlockType.PluginInstallation]: {
        relativeUrl: "plugins/installed",
        icon: "plugins",
        displayName: change.displayName,
        type: "Plugin",
      },
      [models.EnumBlockType.PluginOrder]: {
        relativeUrl: "plugins/installed",
        icon: "plugins",
        displayName: change.displayName,
        type: "Plugin Order",
      },
      [models.EnumBlockType.Module]: {
        relativeUrl: `modules/${change.id}`,
        icon: "box",
        displayName: change.displayName,
        type: "Module",
      },
      //@todo: update the url, icon and display name
      [models.EnumBlockType.ModuleAction]: {
        relativeUrl: `modules/${
          (change as models.Block).parentBlock?.id
        }/actions/${change.id}`,
        icon: "api",
        displayName: change.displayName,
        type: "Action",
      },
      [models.EnumBlockType.ModuleDto]: {
        relativeUrl: `modules/${
          (change as models.Block).parentBlock?.id
        }/dtos/${change.id}`,
        icon: "zap",
        displayName: change.displayName,
        type: "DTO",
      },
      [models.EnumBlockType.ServiceTopics]: {
        relativeUrl: "not supported",
        icon: "topics_outline",
        displayName: "not supported",
        type: "Service Topics",
      },
    };
    return blockTypeMap[(change as models.Block).blockType];
  },
};
