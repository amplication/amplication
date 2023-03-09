import { TextField } from "@amplication/design-system";
import React from "react";
// import "../CreateServiceWizard.scss";
import "./CreateServiceName.scss";

const className = "create-service-name";

const CreateServiceName: React.FC<{ moduleCss: string }> = ({ moduleCss }) => {
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
        <TextField name="serviceName" label="Service name" />
      </div>
    </div>
  );
};

export default CreateServiceName;
