import { Tooltip } from "@amplication/ui/design-system";
import classNames from "classnames";
import React from "react";
import { EnumOutdatedVersionAlertStatus } from "../models";
import "./OutdatedVersionAlertStatus.scss";

type Props = {
  status: keyof typeof EnumOutdatedVersionAlertStatus | null;
  hideTooltip?: boolean;
};

type StatusValues = {
  message: string;
  name: string;
  className: string;
};

const OUTDATED_ALERT_STATUS_TO_MESSAGE: Record<
  EnumOutdatedVersionAlertStatus,
  StatusValues
> = {
  [EnumOutdatedVersionAlertStatus.New]: {
    message: "Update available.",
    name: "Active",
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
  [EnumOutdatedVersionAlertStatus.Canceled]: {
    message: "This update was canceled because a newer update was available.",
    name: "Canceled",
    className: "canceled",
  },
};

const nullValues: StatusValues = {
  message: "",
  name: "All",
  className: "all",
};

const CLASS_NAME = "outdated-version-alert-status";

const OutdatedVersionAlertStatus: React.FC<Props> = ({
  status,
  hideTooltip = false,
}) => {
  const values = status ? OUTDATED_ALERT_STATUS_TO_MESSAGE[status] : nullValues;

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

export default OutdatedVersionAlertStatus;
