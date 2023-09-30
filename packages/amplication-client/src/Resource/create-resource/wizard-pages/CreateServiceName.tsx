import { TextField } from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import { WizardStepProps } from "./interfaces";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";

const CreateServiceName: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
}) => {
  useEffect(() => {
    formik.validateForm();
  }, []);

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="First, we need to choose a name for the service"
          text={`
          Give your service a meaningful name. It will be used in the generated
          code and the folder structure of the project. It may include spaces.
          e.g. Order Service, Notification Manager
          `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.ContentWrapper>
          <TextField
            name="serviceName"
            label="Service name"
            placeholder="Order Service"
          />
        </Layout.ContentWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

CreateServiceName.displayName = "CreateServiceName";

export default CreateServiceName;
