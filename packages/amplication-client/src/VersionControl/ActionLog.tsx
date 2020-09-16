import React, { useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { LazyLog } from "react-lazylog";
import { isEmpty } from "lodash";
import { Icon } from "@rmwc/icon";

import { differenceInSeconds } from "date-fns";

import { formatError } from "../util/error";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import chalk from "chalk";
import * as models from "../models";
import logsImage from "../assets/images/logs.svg";

import "./ActionLog.scss";

type TData = {
  action: models.Action;
};

type Props = {
  actionId?: string | null;
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

const STEP_STATUS_TO_ICON: {
  [key in models.EnumActionStepStatus]: string;
} = {
  [models.EnumActionStepStatus.Success]: "check",
  [models.EnumActionStepStatus.Failed]: "x",
  [models.EnumActionStepStatus.Waiting]: "",
  [models.EnumActionStepStatus.Running]: "",
};

const ActionLog = ({ actionId }: Props) => {
  const { data, error } = useQuery<TData>(GET_ACTION_LOG, {
    variables: {
      actionId: actionId,
    },
    skip: !actionId,
  });

  const errorMessage = formatError(error);

  const logData = useMemo(() => {
    if (!data || !data.action || !data.action.steps) return [];

    return data.action.steps.map((step) => {
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
        rows: step.logs?.length || 0,
        messages: step.logs
          ?.map((log) => {
            return chalk`{${LOG_LEVEL_TO_CHALK[log.level]} ${
              log.createdAt
            }   (${log.level}) ${log.message} }`;
          })
          .join("\n"),
      };
    });
  }, [data]);

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__header`}>
        <h2>Action Log</h2>
      </div>
      {logData.map((stepData) => (
        <div
          className={`${CLASS_NAME}__step`}
          key={stepData.id}
          style={{ height: LOG_ROW_HEIGHT * (stepData.rows + 2) }}
        >
          <div className={`${CLASS_NAME}__step__row`}>
            <span
              className={`${CLASS_NAME}__step__status ${CLASS_NAME}__step__status--${stepData.status.toLowerCase()}`}
            >
              <Icon icon={STEP_STATUS_TO_ICON[stepData.status]} />
            </span>
            <span className={`${CLASS_NAME}__step__message`}>
              {stepData.message}
            </span>
            <span className={`${CLASS_NAME}__step__duration`}>
              {stepData.duration}
            </span>
          </div>
          {!isEmpty(stepData.messages) && (
            <LazyLog
              rowHeight={LOG_ROW_HEIGHT}
              lineClassName={`${CLASS_NAME}__line`}
              extraLines={0}
              enableSearch={false}
              text={stepData.messages}
            />
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
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default ActionLog;

export const GET_ACTION_LOG = gql`
  query actionLog($actionId: String!) {
    action(where: { id: $actionId }) {
      id
      createdAt
      steps {
        id
        createdAt
        message
        status
        completedAt
        logs {
          id
          createdAt
          message
          meta
          level
        }
      }
    }
  }
`;
