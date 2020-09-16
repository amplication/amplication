import React, { useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { LazyLog } from "react-lazylog";
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
const NO_LOG_MESSAGE = "No log data is available";

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

const ActionLog = ({ actionId }: Props) => {
  const { data, error } = useQuery<TData>(GET_ACTION_LOG, {
    variables: {
      actionId: actionId,
    },
  });

  const errorMessage = formatError(error);

  const logData = useMemo(() => {
    if (!data || !data.action || !data.action.steps) return NO_LOG_MESSAGE;

    return data.action.steps
      .flatMap((step) => {
        /**@todo: format the step differently - show execution time after completion */
        const stepMessage = chalk`{blue ${step.message}}`;

        const logMessages = step.logs?.map((log) => {
          return chalk`{${LOG_LEVEL_TO_CHALK[log.level]}      ${
            log.createdAt
          }   (${log.level}) ${log.message} }`;
        });

        return [stepMessage].concat(logMessages || []);
      })
      .join("\n");
  }, [data]);

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__header`}>
        <h2>Action Log</h2>
      </div>

      <LazyLog
        lineClassName={`${CLASS_NAME}__line`}
        extraLines={1}
        enableSearch={false}
        text={logData}
      />
      {!logData && (
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
