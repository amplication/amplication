import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const [resourceRepo, setResourceRepo] = useState<models.GitRepository>(
    resource?.gitRepository || null
  );

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
    if (!resource) return;
    setResourceRepo(resource.gitRepository);
  }, [resource]);

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
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}`
    );
  }, [currentWorkspace, currentProject, currentResource]);

  const handleTryAgainClick = useCallback(() => {
    commit({
      variables: {
        message: "Initial commit test",
        projectId: currentProject.id,
      },
    }).catch(console.error);
  }, [commit, currentProject.id]);

  const buildRunning = data?.build?.status === models.EnumBuildStatus.Running;

  const buildFailed = data?.build?.status === models.EnumBuildStatus.Failed;

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
                https://github.com/{resourceRepo?.gitOrganization?.name}/
                {resourceRepo?.name}
              </div>
              <div />
            </div>
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              onClick={handleViewCodeClick}
            >
              {
                <a
                  style={{ color: "white" }}
                  href={`https://github.com/${resourceRepo?.gitOrganization?.name}/${resourceRepo?.name}`}
                  target="docs"
                >
                  View my code
                </a>
              }
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateServiceCodeGeneration;
