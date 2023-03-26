import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const className = "create-service-code-generation";

const CreateServiceCodeGeneration: React.FC<
  WizardStepProps & {
    resource?: models.Resource;
    build?: models.Build;
  }
> = ({ moduleClass, build, resource, formik, trackWizardPageEvent }) => {
  const { data } = useBuildWatchStatus(build);
  const [resourceRepo, setResourceRepo] = useState<models.GitRepository>(
    resource?.gitRepository || null
  );
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

  const buildCompleted =
    data?.build?.status === models.EnumBuildStatus.Completed;
  return (
    <div className={className}>
      <div className={`${className}__title`}>
        <h2>All set! We’re currently generating your service.</h2>
        <h3>It should only take a few seconds to finish. Don't go away!</h3>
      </div>
      <div className={`${className}__status`}>
        {!buildCompleted ? (
          <ActionLog
            action={actionLog?.action}
            title={actionLog?.title || ""}
            versionNumber={actionLog?.versionNumber || ""}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default CreateServiceCodeGeneration;
