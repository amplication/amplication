import { Tooltip } from "@amplication/ui/design-system";
import classNames from "classnames";
import React from "react";
import { EnumOutdatedVersionAlertType, OutdatedVersionAlert } from "../models";
import "./OutdatedVersionAlertType.scss";

type Props = {
  outdatedVersionAlert: OutdatedVersionAlert;
};

const OUTDATED_ALERT_TYPE_TO_MESSAGE: Record<
  EnumOutdatedVersionAlertType,
  {
    message: string;
    name: string;
    className: string;
  }
> = {
  [EnumOutdatedVersionAlertType.TemplateVersion]: {
    message: "New version of the template is available.",
    name: "Template",
    className: "template",
  },
  [EnumOutdatedVersionAlertType.PluginVersion]: {
    message: "New version of the plugin is available.",
    name: "Plugin",
    className: "plugin",
  },
  [EnumOutdatedVersionAlertType.CodeEngineVersion]: {
    message: "New version of the code engine is available.",
    name: "Code Engine",
    className: "code-engine",
  },
};

const CLASS_NAME = "outdated-version-alert-type";

const OutdatedVersionAlertType: React.FC<Props> = ({
  outdatedVersionAlert,
}) => {
  const values = OUTDATED_ALERT_TYPE_TO_MESSAGE[outdatedVersionAlert.type];

  return (
    <Tooltip title={values.message}>
      <span
        className={classNames(CLASS_NAME, `${CLASS_NAME}--${values.className}`)}
      >
        {values.name}
      </span>
    </Tooltip>
  );
};

export default OutdatedVersionAlertType;
