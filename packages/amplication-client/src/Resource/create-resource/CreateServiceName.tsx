import { TextInput } from "@amplication/design-system";
import React from "react";
import "./CreateServiceWizard.scss";

const CreateServiceName: React.FC<{ moduleCss: string }> = ({ moduleCss }) => {
  return (
    <div className={`${moduleCss}__service_box`}>
      <h2>First, we need to choose a name for the service</h2>
      <div className={`${moduleCss}__description_bottom`}>
        <h3>
          Give your service a meaningful name. It will be used in the generated
          code and the folder structure of the project. It may include spaces.
          e.g. Order Service, Notification Manager
        </h3>
      </div>
      <div className={`${moduleCss}__service_input`}>
        <TextInput name="Service name" label="Service name" />
      </div>
    </div>
  );
};

export default CreateServiceName;
