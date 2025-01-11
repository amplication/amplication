import { Tooltip } from "@amplication/ui/design-system";
import classNames from "classnames";
import React from "react";
import { EnumOutdatedVersionAlertType, OutdatedVersionAlert } from "../models";
import "./OutdatedVersionAlertType.scss";

type Props = {
  type: keyof typeof EnumOutdatedVersionAlertType | null;
  hideTooltip?: boolean;
};

type TypeValues = {
  message: string;
  name: string;
  className: string;
};

const OUTDATED_ALERT_TYPE_TO_MESSAGE: Record<
  EnumOutdatedVersionAlertType,
  TypeValues
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

const nullValues: TypeValues = {
  message: "",
  name: "All",
  className: "all",
};

const CLASS_NAME = "outdated-version-alert-type";

const OutdatedVersionAlertType: React.FC<Props> = ({
  type,
  hideTooltip = false,
}) => {
  const values = type ? OUTDATED_ALERT_TYPE_TO_MESSAGE[type] : nullValues;

  const content = (
    <span
      className={classNames(CLASS_NAME, `${CLASS_NAME}--${values.className}`)}
    >
      {values.name}
    </span>
  );

  return (
    <>
      {hideTooltip ? (
        content
      ) : (
        <Tooltip title={values.message}>{content}</Tooltip>
      )}
    </>
  );
};

export default OutdatedVersionAlertType;
