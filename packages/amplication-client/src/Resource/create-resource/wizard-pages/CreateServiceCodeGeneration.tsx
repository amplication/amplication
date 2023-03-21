import React, { useCallback, useEffect, useMemo } from "react";
import "../CreateServiceWizard.scss";
import "./CreateServiceCodeGeneration.scss";
import ActionLog from "../../../VersionControl/ActionLog";
// import { Action } from "../../../models";

import CodeGenerationCompleted from "../../../assets/images/code-generation-completed.svg";
import { Button } from "@amplication/design-system";
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
> = ({ moduleClass, build, resource, trackWizardPageEvent }) => {
  const { data } = useBuildWatchStatus(build);

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
                https://github.com/yuval/myservice/
              </div>
              <div />
            </div>
            <Button onClick={handleViewCodeClick}>View my code</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateServiceCodeGeneration;
