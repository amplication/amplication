import { SelectField, TextField } from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import { WizardStepProps } from "./interfaces";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import useAvailableCodeGenerators from "../../../Workspaces/hooks/useAvailableCodeGenerators";

const CreateServiceName: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
}) => {
  useEffect(() => {
    formik.validateForm();
  }, []);

  const { availableCodeGenerators, defaultCodeGenerator } =
    useAvailableCodeGenerators();

  //Set the default value after it is loaded
  useEffect(() => {
    if (defaultCodeGenerator && !formik.values.codeGenerator) {
      formik.setFieldValue("codeGenerator", defaultCodeGenerator);
    }
  }, [defaultCodeGenerator, formik]);

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
          {availableCodeGenerators.length > 1 && (
            <SelectField
              name="codeGenerator"
              label="Code Generator Tech Stack"
              options={availableCodeGenerators}
            />
          )}
        </Layout.ContentWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

CreateServiceName.displayName = "CreateServiceName";

export default CreateServiceName;
