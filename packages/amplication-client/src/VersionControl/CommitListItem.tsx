import React, { useMemo } from "react";
import * as models from "../models";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import "@rmwc/data-table/styles";

import UserAndTime from "../Components/UserAndTime";
import { ClickableId } from "../Components/ClickableId";
import { TruncatedId } from "../Components/TruncatedId";

import {
  GENERATE_STEP_NAME,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  EMPTY_STEP,
  BuildStepsStatus,
} from "./BuildSteps";

type DType = {
  deleteEntity: { id: string };
};

type Props = {
  applicationId: string;
  commit: models.Commit;
};

export const CommitListItem = ({ commit, applicationId }: Props) => {
  const [build] = commit.builds;

  const stepGenerateCode = useMemo(() => {
    if (!build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === GENERATE_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build.action]);

  const stepBuildDocker = useMemo(() => {
    if (!build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [build.action]);

  const account = commit.user?.account;

  return (
    <DataGridRow navigateUrl={`/${applicationId}/commits/${commit.id}`}>
      <DataTableCell className="min-width">
        <ClickableId
          id={commit.id}
          label=""
          to={`/${applicationId}/commit/${commit.id}`}
        />
      </DataTableCell>
      <DataTableCell>
        <UserAndTime account={account} time={commit.createdAt} />
      </DataTableCell>
      <DataTableCell>{commit.message}</DataTableCell>
      <DataTableCell>
        <TruncatedId id={build.id} />
      </DataTableCell>
      <DataTableCell>
        <BuildStepsStatus status={stepGenerateCode.status} />
      </DataTableCell>
      <DataTableCell>
        <BuildStepsStatus status={stepBuildDocker.status} />
      </DataTableCell>
    </DataGridRow>
  );
};
