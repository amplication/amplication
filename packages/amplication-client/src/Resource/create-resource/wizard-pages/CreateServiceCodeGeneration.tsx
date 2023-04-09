import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import ActionLog from "../../../VersionControl/ActionLog";
import { LogData } from "../../../VersionControl/BuildPage";
import { COMMIT_CHANGES } from "../../../VersionControl/Commit";
import useBuildWatchStatus from "../../../VersionControl/useBuildWatchStatus";
import { AppContext } from "../../../context/appContext";
import * as models from "../../../models";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import "../CreateServiceWizard.scss";
import BuildCompletedScreen from "./BuildCompletedScreen";
import "./CreateServiceCodeGeneration.scss";
import { WizardStepProps } from "./interfaces";

export const className = "create-service-code-generation";

type TData = {
  commit: models.Commit;
};

const CreateServiceCodeGeneration: React.FC<
  WizardStepProps & {
    resource?: models.Resource;
    build?: models.Build;
    rebuildClick: (build: models.Build) => void;
  }
> = ({
  moduleClass,
  build,
  resource,
  formik,
  trackWizardPageEvent,
  rebuildClick,
}) => {
  const { data } = useBuildWatchStatus(build);
  const [pullRequestLink, setPullRequestLink] = useState("");
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const [commit] = useMutation<TData>(COMMIT_CHANGES, {
    onCompleted: (response) => {
      const newBuild = response.commit.builds?.find(
        (build) => build.resourceId === resource.id
      );
      rebuildClick(newBuild);
    },
  });

  useEffect(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ViewServiceWizardStep_CodeGeneration
    );
  }, []);

  useEffect(() => {
    if (!data && data?.build?.status !== models.EnumBuildStatus.Completed)
      return;

    trackWizardPageEvent(AnalyticsEventNames.ServiceWizardStep_CodeReady);
  }, [data]);

  useEffect(() => {
    formik.validateForm();
  }, []);

  useEffect(() => {
    if (formik.values.isGenerateCompleted || !data) return;
    const codeGenStatus =
      data?.build?.status === models.EnumBuildStatus.Completed;
    codeGenStatus && formik.setFieldValue("isGenerateCompleted", "completed");
  }, [formik.values, data?.build?.status]);

  const actionLog = useMemo<LogData | null>(() => {
    if (!data?.build) return null;

    if (!data.build.action) return null;
    const pullRequestLinkData = extractPullRequestLink(data.build.action.steps);
    if (pullRequestLinkData) {
      setPullRequestLink(pullRequestLinkData);
    }

    return {
      action: data.build.action,
      title: "Build log",
      versionNumber: data.build.version,
    };
  }, [data]);

  const handleContinueClick = useCallback(() => {
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}`
    );
  }, [currentWorkspace, currentProject, currentResource]);

  const handleTryAgainClick = useCallback(() => {
    commit({
      variables: {
        message: "Initial commit",
        projectId: currentProject.id,
      },
    }).catch(console.error);
  }, [commit, currentProject.id]);

  const buildRunning = data?.build?.status === models.EnumBuildStatus.Running;

  const buildFailed = data?.build?.status === models.EnumBuildStatus.Failed;

  const buildCompleted =
    data?.build?.status === models.EnumBuildStatus.Completed;

  return (
    <div className={className}>
      {buildRunning ? (
        <div className={`${className}__buildLog`}>
          <div className={`${className}__title`}>
            <h1>We’re generating your service...</h1>
          </div>
          <div className={`${className}__status`}>
            <ActionLog
              action={actionLog?.action}
              title={actionLog?.title || ""}
              versionNumber={actionLog?.versionNumber || ""}
            />
          </div>
        </div>
      ) : buildFailed ? (
        <div className={`${className}__buildLog`}>
          <div className={`${className}__title`}>
            <h1>We’re generating your service...</h1>
          </div>
          <div className={`${className}__negative_status`}>
            <ActionLog
              action={actionLog?.action}
              title={actionLog?.title || ""}
              versionNumber={actionLog?.versionNumber || ""}
            />
          </div>
          <div className={`${className}__error_message_box`}>
            <div>
              <h2>Oops, something went wrong.</h2>
              <h2>You can try again, or continue anyway to see your service</h2>
            </div>
            <div className={`${className}__btn_actions`}>
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                onClick={handleTryAgainClick}
              >
                Try again
              </Button>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleContinueClick}
              >
                Continue anyway
              </Button>
            </div>
          </div>
        </div>
      ) : (
        buildCompleted && (
          <BuildCompletedScreen
            moduleClass={moduleClass}
            trackWizardPageEvent={trackWizardPageEvent}
            pullRequestLink={pullRequestLink}
          />
        )
      )}
    </div>
  );
};

export default CreateServiceCodeGeneration;

function extractPullRequestLink(steps: models.ActionStep[]): string | null {
  for (const step of steps) {
    for (const log of step.logs) {
      const { meta } = log;
      if (meta.githubUrl) {
        return meta.githubUrl;
      }
    }
  }

  return null;
}
