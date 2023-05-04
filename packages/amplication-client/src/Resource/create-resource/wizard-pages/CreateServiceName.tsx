import { TextField } from "@amplication/ui/design-system";
import React, { useEffect, useCallback } from "react";
import "./CreateServiceName.scss";
import { WizardStepProps } from "./interfaces";
import { ENTER } from "../../../util/hotkeys";

const className = "create-service-name";

const CreateServiceName: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
  goNextPage,
}) => {
  useEffect(() => {
    formik.validateForm();
  }, []);

  const handleKeyDown = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (keyEvent.key === ENTER) {
        keyEvent.preventDefault();
        if (
          formik.values.serviceName?.trim() !== "" &&
          !Object.keys(formik.errors).length
        ) {
          goNextPage && goNextPage();
        }
      }
    },
    [formik, goNextPage]
  );

  return (
    <div className={className}>
      <div className={`${className}__description`}>
        <h2>First, we need to choose a name for the service</h2>
        <h3>
          Give your service a meaningful name. It will be used in the generated
          code and the folder structure of the project. It may include spaces.
          e.g. Order Service, Notification Manager
        </h3>
      </div>
      <div className={`${className}__service_input`}>
        <TextField
          name="serviceName"
          label="Service name"
          placeholder="Order Service"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

CreateServiceName.displayName = "CreateServiceName";

export default CreateServiceName;
