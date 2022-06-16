import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { Icon } from "@amplication/design-system";
import { formatError } from "../util/error";
import * as models from "../models";
import "./CommitValidation.scss";

type Props = {
  resourceId: string;
};
const CLASS_NAME = "commit-validation";

type TData = {
  resourceValidateBeforeCommit: models.ResourceValidationResult;
};

const VALIDATION_MESSAGES_TO_TEXT: {
  [key in models.ResourceValidationErrorTypes]: {
    message: string;
    url: string | null;
  };
} = {
  [models.ResourceValidationErrorTypes
    .CannotMergeCodeToGitHubBreakingChanges]: {
    message:
      "The code in the linked GitHub repo was generated with a previous version of Amplication. The current version includes breaking changes that may cause conflicts when merged with code generated with previous versions.",
    url: "https://docs.amplication.com/docs/errors/merge-conflict",
  },
  [models.ResourceValidationErrorTypes.DataServiceGeneratorVersionInvalid]: {
    message:
      "Invalid code generation version ID was found in the linked GitHub repo.",
    url:
      "https://docs.amplication.com/docs/errors/invalid-code-generation-version",
  },
  [models.ResourceValidationErrorTypes.DataServiceGeneratorVersionMissing]: {
    message:
      "Could not find code generation version ID in the linked GitHub repo.",
    url:
      "https://docs.amplication.com/docs/errors/missing-code-generation-version",
  },
  [models.ResourceValidationErrorTypes
    .CannotMergeCodeToGitHubInvalidResourceId]: {
    message:
      "The code in the linked GitHub repo was generated from a different resource. It may cause conflicts when merged with code generated from the current resource.",
    url: "https://docs.amplication.com/docs/errors/github-different-app-id",
  },
};
const POLL_INTERVAL = 30000;

const CommitValidation = ({ resourceId }: Props) => {
  const { data, error, startPolling, stopPolling } = useQuery<TData>(
    APP_VALIDATE_BEFORE_COMMIT,
    {
      onCompleted: (data) => {
        //Start polling if status is invalid
        if (!data.resourceValidateBeforeCommit.isValid) {
          startPolling(POLL_INTERVAL);
        }
      },
      variables: {
        resourceId: resourceId,
      },
    }
  );

  //stop polling in case the status is value
  useEffect(() => {
    if (data?.resourceValidateBeforeCommit.isValid) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [data, stopPolling, startPolling]);

  const errorMessage = formatError(error);

  return !isEmpty(data?.resourceValidateBeforeCommit.messages) ? (
    <div className={CLASS_NAME}>
      {data?.resourceValidateBeforeCommit.messages.map((message, index) => {
        const errorData = VALIDATION_MESSAGES_TO_TEXT[message];

        return (
          <div className={`${CLASS_NAME}__item`} key={index}>
            <Icon icon="info_circle" size="small" />
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
  query resourceValidateBeforeCommit($resourceId: String!) {
    resourceValidateBeforeCommit(where: { id: $resourceId }) {
      isValid
      messages
    }
  }
`;
