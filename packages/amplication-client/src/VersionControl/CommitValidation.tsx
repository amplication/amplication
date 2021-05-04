import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { Icon } from "@rmwc/icon";
import { formatError } from "../util/error";
import * as models from "../models";
import "./CommitValidation.scss";

type Props = {
  applicationId: string;
};
const CLASS_NAME = "commit-validation";

type TData = {
  appValidateBeforeCommit: models.AppValidationResult;
};

const VALIDATION_MESSAGES_TO_TEXT: {
  [key in models.AppValidationErrorTypes]: {
    message: string;
    url: string | null;
  };
} = {
  [models.AppValidationErrorTypes.CannotMergeCodeToGitHubBreakingChanges]: {
    message:
      "The code in the linked GitHub repo was generated with a previous version of Amplication. The current version includes breaking changes that may cause conflicts when merged with code generated with previous versions.",
    url: "https://docs.amplication.com/docs/errors/merge-conflict",
  },
  [models.AppValidationErrorTypes.DataServiceGeneratorVersionInvalid]: {
    message:
      "Invalid code generation version ID was found in the linked GitHub repo.",
    url:
      "https://docs.amplication.com/docs/errors/invalid-code-generation-version",
  },
  [models.AppValidationErrorTypes.DataServiceGeneratorVersionMissing]: {
    message:
      "Could not find code generation version ID in the linked GitHub repo.",
    url:
      "https://docs.amplication.com/docs/errors/missing-code-generation-version",
  },
  [models.AppValidationErrorTypes.CannotMergeCodeToGitHubInvalidAppId]: {
    message:
      "The code in the linked GitHub repo was generated from a different app. It may cause conflicts when merged with code generated from the current app.",
    url: "https://docs.amplication.com/docs/errors/github-different-app-id",
  },
};
const POLL_INTERVAL = 30000;

const CommitValidation = ({ applicationId }: Props) => {
  const { data, error, startPolling, stopPolling } = useQuery<TData>(
    APP_VALIDATE_BEFORE_COMMIT,
    {
      onCompleted: (data) => {
        //Start polling if status is invalid
        if (!data.appValidateBeforeCommit.isValid) {
          startPolling(POLL_INTERVAL);
        }
      },
      variables: {
        appId: applicationId,
      },
    }
  );

  //stop polling in case the status is value
  useEffect(() => {
    if (data?.appValidateBeforeCommit.isValid) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [data, stopPolling, startPolling]);

  const errorMessage = formatError(error);

  return !isEmpty(data?.appValidateBeforeCommit.messages) ? (
    <div className={CLASS_NAME}>
      {data?.appValidateBeforeCommit.messages.map((message, index) => {
        const errorData = VALIDATION_MESSAGES_TO_TEXT[message];

        return (
          <div className={`${CLASS_NAME}__item`} key={index}>
            <Icon icon="info_circle" />
            <div>
              {errorData.message}
              {errorData.url && (
                <a target="learn-more" href={errorData.url}>
                  Learn more
                </a>
              )}
            </div>
          </div>
        );
      })}
      {errorMessage && (
        <div className={`${CLASS_NAME}__item`}>
          <Icon icon="info_circle" />
          <div> {errorMessage}</div>
        </div>
      )}
    </div>
  ) : null;
};

export default CommitValidation;

export const APP_VALIDATE_BEFORE_COMMIT = gql`
  query appValidateBeforeCommit($appId: String!) {
    appValidateBeforeCommit(where: { id: $appId }) {
      isValid
      messages
    }
  }
`;
