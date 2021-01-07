import React, { useCallback, useMemo } from "react";
import * as models from "../models";
import { useHistory } from "react-router-dom";

import {
  DataGridRow,
  DataGridCell,
  UserAndTime,
} from "@amplication/design-system";

import { ClickableId } from "../Components/ClickableId";

import {
  GENERATE_STEP_NAME,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  EMPTY_STEP,
} from "./BuildSteps";

import { BuildStepsStatus } from "./BuildStepsStatus";

type DType = {
  deleteEntity: { id: string };
};

type Props = {
  applicationId: string;
  commit: models.Commit;
};

export const CommitListItem = ({ commit, applicationId }: Props) => {
  const [build] = commit.builds;
  const history = useHistory();

  const stepGenerateCode = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === GENERATE_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build]);

  const stepBuildDocker = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [build]);

  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleRowClick = useCallback(() => {
    history.push(`/${applicationId}/commits/${commit.id}`);
  }, [history, applicationId, commit]);

  const account = commit.user?.account;

  return (
    <DataGridRow onClick={handleRowClick}>
      <DataGridCell className="min-width">
        <ClickableId
          id={commit.id}
          label=""
          to={`/${applicationId}/commit/${commit.id}`}
          eventData={{
            eventName: "commitListCommitIdClick",
          }}
        />
      </DataGridCell>
      <DataGridCell>
        <UserAndTime account={account} time={commit.createdAt} />
      </DataGridCell>
      <DataGridCell>{commit.message}</DataGridCell>
      <DataGridCell>
        {build && (
          <ClickableId
            label=""
            to={`/${applicationId}/builds/${build.id}`}
            id={build.id}
            onClick={handleBuildLinkClick}
            eventData={{
              eventName: "commitListBuildIdClick",
            }}
          />
        )}
      </DataGridCell>
      <DataGridCell>
        <BuildStepsStatus status={stepGenerateCode.status} />
      </DataGridCell>
      <DataGridCell>
        <BuildStepsStatus status={stepBuildDocker.status} />
      </DataGridCell>
    </DataGridRow>
  );
};
