import { Tooltip } from "@amplication/ui/design-system";
import classNames from "classnames";
import React from "react";
import {
  EnumOutdatedVersionAlertStatus,
  OutdatedVersionAlert,
} from "../models";
import "./OutdatedVersionAlertStatus.scss";

type Props = {
  outdatedVersionAlert: OutdatedVersionAlert;
};

const OUTDATED_ALERT_STATUS_TO_MESSAGE: Record<
  EnumOutdatedVersionAlertStatus,
  {
    message: string;
    name: string;
    className: string;
  }
> = {
  [EnumOutdatedVersionAlertStatus.New]: {
    message: "Update available.",
    name: "Update available",
    className: "new",
  },
  [EnumOutdatedVersionAlertStatus.Resolved]: {
    message: "This update was resolved.",
    name: "Resolved",
    className: "resolved",
  },
  [EnumOutdatedVersionAlertStatus.Ignored]: {
    message: "This update was ignored.",
    name: "Ignored",
    className: "ignored",
  },
};

const CLASS_NAME = "outdated-version-alert-status";

const OutdatedVersionAlertStatus: React.FC<Props> = ({
  outdatedVersionAlert,
}) => {
  const values = OUTDATED_ALERT_STATUS_TO_MESSAGE[outdatedVersionAlert.status];

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

export default OutdatedVersionAlertStatus;
