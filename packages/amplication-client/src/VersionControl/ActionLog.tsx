import React, { useMemo } from "react";
import { LazyLog } from "react-lazylog";
import { isEmpty, last } from "lodash";
import { Icon } from "@rmwc/icon";

import { CircularProgress } from "@rmwc/circular-progress";
import Timer from "../Components/Timer";

import { differenceInSeconds } from "date-fns";

import "@rmwc/snackbar/styles";
import chalk from "chalk";
import * as models from "../models";
import logsImage from "../assets/images/logs.svg";

import "./ActionLog.scss";
import { CircleIcon, EnumCircleIconSize } from "@amplication/design-system";
import { STEP_STATUS_TO_STYLE, STEP_STATUS_TO_ICON } from "./constants";

type Props = {
  action?: models.Action;
  title: string;
  versionNumber: string;
};
const CLASS_NAME = "action-log";
const SECOND_STRING = "s";
const LOG_ROW_HEIGHT = 19;

// Make chalk work
chalk.enabled = true;
/** @see https://github.com/chalk/chalk#chalklevel */
chalk.level = 3;

const LOG_LEVEL_TO_CHALK: {
  [key in models.EnumActionLogLevel]: string;
} = {
  [models.EnumActionLogLevel.Info]: "white",
  [models.EnumActionLogLevel.Error]: "red",
  [models.EnumActionLogLevel.Debug]: "cyan",
  [models.EnumActionLogLevel.Warning]: "yellow",
};

const ActionLog = ({ action, title, versionNumber }: Props) => {
  const logData = useMemo(() => {
    if (!action?.steps) return [];

    return action?.steps.map((step) => {
      let duration = "";
      if (step.completedAt) {
        const seconds = differenceInSeconds(
          new Date(step.completedAt),
          new Date(step.createdAt)
        );
        duration = seconds.toString().concat(SECOND_STRING);
      }
      return {
        ...step,
        duration: duration,
        messages: step.logs
          ?.map((log) => {
            return chalk`{${LOG_LEVEL_TO_CHALK[log.level]} ${
              log.createdAt
            }  {gray (${log.level})} ${log.message} }`;
          })
          .join("\n"),
      };
    });
  }, [action]);

  const actionStatus = useMemo(() => {
    if (
      logData.find(
        (step) =>
          step.status === models.EnumActionStepStatus.Waiting ||
          step.status === models.EnumActionStepStatus.Running
      )
    )
      return models.EnumActionStepStatus.Running;

    if (
      logData.find((step) => step.status === models.EnumActionStepStatus.Failed)
    )
      return models.EnumActionStepStatus.Failed;

    return models.EnumActionStepStatus.Success;
  }, [logData]);

  const lastStepCompletedAt = useMemo(() => {
    if (actionStatus === models.EnumActionStepStatus.Running) return null;

    return last(logData)?.completedAt;
  }, [logData, actionStatus]);

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__header`}>
        <Icon icon="option_set" />
        {!action ? (
          <h3>Action Log</h3>
        ) : (
          <>
            <h3>
              {title} <span>{versionNumber}</span>
            </h3>

            <div className={`${CLASS_NAME}__header__info__status`}>
              <CircleIcon
                size={EnumCircleIconSize.Small}
                {...STEP_STATUS_TO_STYLE[actionStatus]}
              />
              {actionStatus}
            </div>
            <div className="spacer" />
            <div className={`${CLASS_NAME}__header__info__time`}>
              Total duration{" "}
              <Timer
                startTime={action.createdAt}
                runTimer
                endTime={lastStepCompletedAt}
              />
            </div>
          </>
        )}
      </div>
      <div className={`${CLASS_NAME}__body`}>
        {logData.map((stepData) => (
          <div className={`${CLASS_NAME}__step`} key={stepData.id}>
            <div className={`${CLASS_NAME}__step__row`}>
              <span
                className={`${CLASS_NAME}__step__status ${CLASS_NAME}__step__status--${stepData.status.toLowerCase()}`}
              >
                {stepData.status === models.EnumActionStepStatus.Running ? (
                  <CircularProgress size={"xsmall"} />
                ) : (
                  <Icon icon={STEP_STATUS_TO_ICON[stepData.status]} />
                )}
              </span>
              <span className={`${CLASS_NAME}__step__message`}>
                {stepData.message}
              </span>
              <span className={`${CLASS_NAME}__step__duration`}>
                {stepData.duration}
              </span>
            </div>
            {!isEmpty(stepData.messages) && (
              <div className={`${CLASS_NAME}__step__log`}>
                <LazyLog
                  rowHeight={LOG_ROW_HEIGHT}
                  lineClassName={`${CLASS_NAME}__line`}
                  extraLines={0}
                  enableSearch={false}
                  text={stepData.messages}
                  height={10} //we use a random value in order to disable the auto-sizing, and use "height:auto !important" in CSS
                />
              </div>
            )}
          </div>
        ))}

        {isEmpty(logData) && (
          <div className={`${CLASS_NAME}__empty-state`}>
            <img src={logsImage} alt="log is empty" />
            <div className={`${CLASS_NAME}__empty-state__title`}>
              Create or select an action to view the log
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionLog;
