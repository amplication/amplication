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

import "./BuildLog.scss";

type TData = {
  build: models.Build;
};

type Props = {
  buildId?: string | null;
};
const CLASS_NAME = "build-log";
const NO_LOG_MESSAGE = "No log data is available";

// Make chalk work
chalk.enabled = true;
/** @see https://github.com/chalk/chalk#chalklevel */
chalk.level = 3;

const LOG_LEVEL_TO_CHALK: {
  [key in models.EnumBuildLogLevel]: string;
} = {
  [models.EnumBuildLogLevel.Info]: "white",
  [models.EnumBuildLogLevel.Error]: "red",
  [models.EnumBuildLogLevel.Debug]: "cyan",
  [models.EnumBuildLogLevel.Warning]: "yellow",
};

const BuildLog = ({ buildId }: Props) => {
  const { data, error } = useQuery<TData>(GET_BUILD_LOG, {
    variables: {
      buildId: buildId,
    },
  });

  const errorMessage = formatError(error);

  const logData = useMemo(() => {
    if (!data || !data.build) return NO_LOG_MESSAGE;
    return data.build.logs
      .map((log) => {
        return chalk`{${LOG_LEVEL_TO_CHALK[log.level]}  ${log.createdAt}   (${
          log.level
        }) ${log.message} }`;
      })
      .join("\n");
  }, [data]);

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__header`}>
        <h2>Build Log</h2>
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
            Create or select a build to view the log
          </div>
        </div>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default BuildLog;

export const GET_BUILD_LOG = gql`
  query buildLog($buildId: String!) {
    build(where: { id: $buildId }) {
      id
      version
      message
      createdAt
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      logs(orderBy: { createdAt: Asc }) {
        id
        createdAt
        message
        meta
        level
      }
    }
  }
`;
