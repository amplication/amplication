import { Modal, TextInput } from "@amplication/design-system";
import React, { useContext } from "react";
import { match } from "react-router-dom";
import "./CreateServiceWizard.scss";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateServiceName: React.FC<Props> = ({ moduleClass }) => {
  return (
    <div className={`${moduleClass}__left`}>
      <div className={`${moduleClass}__service_name_header`}>
        <h2>First, we need to choose a name for the service</h2>
      </div>
      <div className={`${moduleClass}__description_bottom`}>
        <h3>
          Give your service a meaningful name. It will be used in the generated
          code and the folder structure of the project. It may include spaces.
          e.g. Order Service, Notification Manager
        </h3>
      </div>
      <TextInput name="Service name" label="Service name" />
    </div>
  );
};

export default CreateServiceName;
