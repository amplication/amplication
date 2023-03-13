import React from "react";
import "../CreateServiceWizard.scss";
import "./CreateServiceCodeGeneration.scss";
import ActionLog from "../../../VersionControl/ActionLog";
// import { Action } from "../../../models";

import CodeGenerationCompleted from "../../../../src/assets/images/code-generation-completed.svg";
import { Button } from "@amplication/design-system";
import { WizardStepProps } from "./interfaces";

const className = "create-service-code-generation";

const CreateServiceCodeGeneration: React.FC<WizardStepProps> = ({
  moduleCss,
}) => {
  const actionLog = {
    action: {
      createdAt: new Date(),
      id: "",
      steps: [],
    },
    title: "Generating service",
    versionNumber: "1.0.0",
  };

  const completed = true;

  return (
    <div className={className}>
      <div className={`${className}__title`}>
        <h2>All set! We’re currently generating your service.</h2>
        <h3>It should only take a few seconds to finish. Don't go away!</h3>
      </div>
      <div className={`${className}__status`}>
        {!completed ? (
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
            <Button>View my code</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateServiceCodeGeneration;
