import React, { useCallback, useMemo } from "react";
import * as models from "../models";
import { useHistory } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";

import { UserAndTime, Panel, EnumPanelStyle } from "@amplication/design-system";

import { ClickableId } from "../Components/ClickableId";

import {
  GENERATE_STEP_NAME,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  EMPTY_STEP,
} from "./BuildSteps";

import { BuildStepsStatus } from "./BuildStepsStatus";
import "./CommitListItem.scss";

type Props = {
  applicationId: string;
  commit: models.Commit;
};
const TOOLTIP_DIRECTION = "nw";

const CLASS_NAME = "commit-list-item";

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
    <Panel
      className={CLASS_NAME}
      clickable
      onClick={handleRowClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__row`}>
        <ClickableId
          className={`${CLASS_NAME}__title`}
          id={commit.id}
          label=""
          to={`/${applicationId}/commit/${commit.id}`}
          eventData={{
            eventName: "commitListCommitIdClick",
          }}
        />
        <span className="spacer" />
        {build && (
          <ClickableId
            className={`${CLASS_NAME}__build`}
            label="Build ID"
            to={`/${applicationId}/builds/${build.id}`}
            id={build.id}
            onClick={handleBuildLinkClick}
            eventData={{
              eventName: "commitListBuildIdClick",
            }}
          />
        )}
        <UserAndTime account={account} time={commit.createdAt} />
      </div>
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__description`}>{commit.message}</span>
        <span className="spacer" />
        <Tooltip
          direction={TOOLTIP_DIRECTION}
          wrap
          aria-label="Generate Code"
          className={`${CLASS_NAME}__status`}
        >
          <BuildStepsStatus status={stepGenerateCode.status} />
          <Icon icon="code1" />
        </Tooltip>
        <Tooltip
          direction={TOOLTIP_DIRECTION}
          wrap
          aria-label="Build Container"
          className={`${CLASS_NAME}__status`}
        >
          <BuildStepsStatus status={stepBuildDocker.status} />
          <Icon icon="docker" />
        </Tooltip>
      </div>
    </Panel>
  );
};
