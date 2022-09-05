import { Tooltip } from "@amplication/design-system";
import classNames from "classnames";
import React, { useMemo } from "react";
import * as models from "../models";
import "./PendingChange.scss";
import PendingChangeContent from "./PendingChangeContent";
import PendingChangeServiceMessageBrokerConnection from "./PendingChangeServiceMessageBrokerConnection";

const CLASS_NAME = "pending-change";
const TOOLTIP_DIRECTION = "ne";

type entityLinkAndDisplayName = {
  relativeUrl: string;
  icon: string;
  displayName: string;
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
        models.EnumBlockType.ServiceMessageBrokerConnection
    )
      return (
        <PendingChangeServiceMessageBrokerConnection
          change={change}
          linkToOrigin={linkToOrigin}
        />
      );

    const data = getEntityLinkByChangeType(change);

    return (
      <PendingChangeContent
        change={change}
        name={data?.displayName || ""}
        linkToOrigin={linkToOrigin}
        relativeUrl={data?.relativeUrl || ""}
      />
    );
  }, [change, linkToOrigin]);

  const isDeleted = change.action === models.EnumPendingChangeAction.Delete;

  return (
    <div className={CLASS_NAME}>
      <div
        className={classNames(
          `${CLASS_NAME}__action`,
          change.action.toLowerCase()
        )}
      >
        {ACTION_TO_LABEL[change.action]}
      </div>
      {isDeleted ? (
        <Tooltip
          wrap
          direction={TOOLTIP_DIRECTION}
          aria-label="The entity has been deleted"
          className={`${CLASS_NAME}__tooltip_deleted`}
        >
          <div className={classNames(`${CLASS_NAME}__deleted`)}>{content}</div>
        </Tooltip>
      ) : (
        content
      )}
      <div className={`${CLASS_NAME}__spacer`} />
    </div>
  );
};

export default PendingChange;

const getEntityLinkByChangeType = (
  change: models.PendingChange
): entityLinkAndDisplayName | undefined => {
  const changeOriginMap = {
    [models.EnumPendingChangeOriginType.Entity]: (
      origin: models.PendingChangeOrigin
    ): entityLinkAndDisplayName => ({
      relativeUrl: `entities/${change.originId}`,
      icon: "",
      displayName: change.origin.displayName,
    }),
    [models.EnumPendingChangeOriginType.Block]: (
      origin: models.PendingChangeOrigin
    ) => {
      const blockTypeMap: {
        [key in models.EnumBlockType]?: entityLinkAndDisplayName;
      } = {
        [models.EnumBlockType.ServiceSettings]: {
          relativeUrl: `settings/update`,
          icon: "",
          displayName: "Service Settings",
        },
        [models.EnumBlockType.ProjectConfigurationSettings]: {
          relativeUrl: `settings/update`,
          icon: "",
          displayName: "Project Settings",
        },
        [models.EnumBlockType.Topic]: {
          relativeUrl: `settings/update`,
          icon: "",
          displayName: change.origin.displayName,
        },
      };
      return blockTypeMap[(origin as models.Block).blockType];
    },
  };
  return changeOriginMap[change.originType](change.origin);
};
