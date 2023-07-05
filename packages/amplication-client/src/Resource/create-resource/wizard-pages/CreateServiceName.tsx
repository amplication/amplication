import { TextField } from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import "./CreateServiceName.scss";
import { WizardStepProps } from "./interfaces";

const className = "create-service-name";

const CreateServiceName: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
}) => {
  useEffect(() => {
    formik.validateForm();
  }, []);

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
        />
      </div>
    </div>
  );
};

CreateServiceName.displayName = "CreateServiceName";

export default CreateServiceName;
