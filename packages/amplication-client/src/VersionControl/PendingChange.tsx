import React, { useMemo } from "react";
import * as models from "../models";
import "./PendingChange.scss";
import PendingChangeContent from "./PendingChangeContent";
import PendingChangeServiceTopics from "./PendingChangeServiceTopics";

const CLASS_NAME = "pending-change";

export type EntityLinkAndDisplayName = {
  relativeUrl: string;
  icon: string;
  displayName: string;
  type?: string;
  pluralTypeName: string;
};

type Props = {
  change: models.PendingChange;
  linkToOrigin?: boolean;
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

    const data = PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP[change.originType](
      change.origin
    );

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

export const PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP = {
  [models.EnumPendingChangeOriginType.Entity]: (
    change: models.PendingChangeOrigin
  ): EntityLinkAndDisplayName => ({
    relativeUrl: `entities/${change.id}`,
    icon: "entity_outline",
    displayName: change.displayName,
    type: "Entity",
    pluralTypeName: "Entities",
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
        pluralTypeName: "Service Settings",
      },
      [models.EnumBlockType.ResourceSettings]: {
        relativeUrl: `settings/resource-settings`,
        icon: "settings",
        displayName: "Settings",
        type: "Settings",
        pluralTypeName: "Settings",
      },
      [models.EnumBlockType.Package]: {
        relativeUrl: `settings/packages`,
        icon: "ai",
        displayName: "Service packages",
        type: "Service packages",
        pluralTypeName: "Service Packages",
      },
      [models.EnumBlockType.ProjectConfigurationSettings]: {
        //Todo: link to project setting
        relativeUrl: `settings/update`,
        icon: "settings",
        displayName: "Project Settings",
        type: "Project Settings",
        pluralTypeName: "Project Settings",
      },
      [models.EnumBlockType.Topic]: {
        relativeUrl: `topics/${change.id}`,
        icon: "topics_outline",
        displayName: change.displayName,
        type: "Topic",
        pluralTypeName: "Topics",
      },
      [models.EnumBlockType.PluginInstallation]: {
        relativeUrl: "plugins/installed",
        icon: "plugins",
        displayName: change.displayName,
        type: "Plugin",
        pluralTypeName: "Plugins",
      },
      [models.EnumBlockType.PluginOrder]: {
        relativeUrl: "plugins/installed",
        icon: "plugins",
        displayName: change.displayName,
        type: "Plugin Order",
        pluralTypeName: "Plugin Order",
      },
      [models.EnumBlockType.Module]: {
        relativeUrl: `modules/${change.id}`,
        icon: "box",
        displayName: change.displayName,
        type: "Module",
        pluralTypeName: "Modules",
      },
      //@todo: update the url, icon and display name
      [models.EnumBlockType.ModuleAction]: {
        relativeUrl: `modules/${
          (change as models.Block).parentBlock?.id
        }/actions/${change.id}`,
        icon: "api",
        displayName: change.displayName,
        type: "API",
        pluralTypeName: "APIs",
      },
      [models.EnumBlockType.ModuleDto]: {
        relativeUrl: `modules/${
          (change as models.Block).parentBlock?.id
        }/dtos/${change.id}`,
        icon: "zap",
        displayName: change.displayName,
        type: "DTO",
        pluralTypeName: "DTOs",
      },
      [models.EnumBlockType.ServiceTopics]: {
        relativeUrl: "not supported",
        icon: "topics_outline",
        displayName: "not supported",
        type: "Service Topics",
        pluralTypeName: "Service Topics",
      },
      [models.EnumBlockType.PrivatePlugin]: {
        relativeUrl: `../private-plugins/${change.id}`,
        icon: "plugin",
        displayName: change.displayName,
        type: "Private Plugin",
        pluralTypeName: "Private Plugins",
      },
      [models.EnumBlockType.CodeEngineVersion]: {
        relativeUrl: `settings/code-generator-version`,
        icon: "code",
        displayName: "Code Engine Version",
        type: "Code Engine Version",
        pluralTypeName: "Code Engine Version",
      },
      [models.EnumBlockType.Relation]: {
        relativeUrl: ``,
        icon: "relation",
        displayName: "Relation",
        type: "Relation",
        pluralTypeName: "Relations",
      },
      [models.EnumBlockType.ResourceTemplateVersion]: {
        relativeUrl: ``,
        icon: "settings",
        displayName: "Template Version",
        type: "Template Version",
        pluralTypeName: "Template Version",
      },
    };
    return blockTypeMap[(change as models.Block).blockType];
  },
};
