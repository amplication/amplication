import React, { useCallback, useContext, useEffect, useMemo } from "react";
import "../CreateServiceWizard.scss";
import "./CreateServiceCodeGeneration.scss";
import ActionLog from "../../../VersionControl/ActionLog";
import CodeGenerationCompleted from "../../../assets/images/code-generation-completed.svg";
import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { WizardStepProps } from "./interfaces";
import useBuildWatchStatus from "../../../VersionControl/useBuildWatchStatus";
import { LogData } from "../../../VersionControl/BuildPage";
import * as models from "../../../models";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { AppContext } from "../../../context/appContext";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { COMMIT_CHANGES } from "../../../VersionControl/Commit";
import { PUSH_TO_GIT_STEP_NAME } from "../../../VersionControl/BuildSteps";
import { isEmpty } from "lodash";
import { EnumGitProvider } from "@amplication/code-gen-types/models";

const className = "create-service-code-generation";

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

  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const [buildCompleted, setBuildCompleted] = React.useState(false);

  const [commit] = useMutation<TData>(COMMIT_CHANGES, {
    onCompleted: (response) => {
      const newBuild = response.commit.builds?.find(
        (build) => build.resourceId === resource.id
      );
      rebuildClick(newBuild);
    },
  });

  useEffect(() => {
    if (
      !buildCompleted &&
      data?.build?.status === models.EnumBuildStatus.Completed
    ) {
      setBuildCompleted(true);
      trackWizardPageEvent(AnalyticsEventNames.ServiceWizardStep_CodeReady);
    }
  }, [data?.build?.status]);

  useEffect(() => {
    formik.validateForm();
  }, []);

  useEffect(() => {
    if (formik.values.isGenerateCompleted || !data) return;
    const codeGenStatus =
      data?.build?.status === models.EnumBuildStatus.Completed;
    codeGenStatus && formik.setFieldValue("isGenerateCompleted", "completed");
  }, [formik.values, data?.build?.status]);

  if (data?.build?.status === models.EnumBuildStatus.Failed) {
    trackWizardPageEvent(AnalyticsEventNames.ViewServiceWizardError, {
      errorInfo: data?.build?.message || "no info",
    });
  }

  const actionLog = useMemo<LogData | null>(() => {
    if (!data?.build) return null;

    if (!data.build.action) return null;

    return {
      action: data.build.action,
      title: "Build log",
      versionNumber: data.build.version,
    };
  }, [data]);

  const handleViewCodeClick = useCallback(() => {
    trackWizardPageEvent(AnalyticsEventNames.ServiceWizardStep_ViewCodeClicked);
  }, [trackWizardPageEvent]);

  const handleContinueClick = useCallback(() => {
    trackWizardPageEvent(AnalyticsEventNames.ServiceWizardError_Continue);
    history.push(`/${currentWorkspace.id}/${currentProject.id}/${resource.id}`);
  }, [currentWorkspace, currentProject]);

  const handleTryAgainClick = useCallback(() => {
    trackWizardPageEvent(AnalyticsEventNames.ServiceWizardError_TryAgain);
    commit({
      variables: {
        message: "Initial commit",
        projectId: currentProject.id,
      },
    }).catch(console.error);
  }, [commit, currentProject.id]);

  const gitUrl = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return null;
    }

    const provider = formik.values.connectToDemoRepo
      ? EnumGitProvider.Github
      : resource?.gitRepository?.gitOrganization?.provider;
    const stepGithub = data.build.action.steps.find(
      (step) => step.name === PUSH_TO_GIT_STEP_NAME(provider)
    );

    const log = stepGithub?.logs?.find(
      (log) => !isEmpty(log.meta) && !isEmpty(log.meta.githubUrl)
    );

    return log?.meta?.githubUrl || null;
  }, [data.build?.action]);

  const buildRunning = data?.build?.status === models.EnumBuildStatus.Running;

  const buildFailed = data?.build?.status === models.EnumBuildStatus.Failed;

  return (
    <div className={className}>
      {buildRunning ? (
        <div className={`${className}__buildLog`}>
          <div className={`${className}__title`}>
            We’re generating your service...
          </div>
          <div className={`${className}__status`}>
            <ActionLog
              autoHeight={true}
              action={actionLog?.action}
              title={actionLog?.title || ""}
              versionNumber={actionLog?.versionNumber || ""}
            />
          </div>
        </div>
      ) : buildFailed ? (
        <div className={`${className}__buildLog`}>
          <div className={`${className}__title`}>
            We’re generating your service...
          </div>
          <div className={`${className}__negative_status`}>
            <ActionLog
              autoHeight={true}
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
          <div className={`${className}__status`}>
            <div className={`${className}__status__completed`}>
              <img
                className={`${className}__status__completed__image`}
                src={CodeGenerationCompleted}
                alt=""
              />

              <div className={`${className}__status__completed__description`}>
                <div
                  className={`${className}__status__completed__description__header`}
                >
                  The code for your service is ready on
                </div>
                <div
                  className={`${className}__status__completed__description__link`}
                >
                  {gitUrl}
                </div>
                <div />
              </div>
              <a href={gitUrl} target="docs">
                <Button
                  type="button"
                  buttonStyle={EnumButtonStyle.Clear}
                  onClick={handleViewCodeClick}
                >
                  View my code
                </Button>
              </a>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CreateServiceCodeGeneration;
