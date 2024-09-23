import { SelectField, TextField } from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import { WizardStepProps } from "./interfaces";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import useAvailableCodeGenerators from "../../../Workspaces/hooks/useAvailableCodeGenerators";
import { EnumCodeGenerator } from "../../../models";

type Props = WizardStepProps & {
  setCurrentCodeGenerator: (codeGenerator: EnumCodeGenerator) => void;
};

const CreateServiceName: React.FC<Props> = ({
  moduleClass,
  formik,
  setCurrentCodeGenerator,
  flowSettings,
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
    } else {
      if (formik.values.codeGenerator) {
        setCurrentCodeGenerator(formik.values.codeGenerator);
      }
    }
  }, [defaultCodeGenerator, formik, setCurrentCodeGenerator]);

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header={
            flowSettings.texts?.chooseName ||
            "First, we need to choose a name for the service"
          }
          text={
            flowSettings.texts?.chooseNameDescription ||
            `
          Give your service a meaningful name. It will be used in the generated
          code and the folder structure of the project. It may include spaces.
          e.g. Order Service, Notification Manager
          `
          }
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.ContentWrapper>
          <TextField
            name="serviceName"
            label={flowSettings.texts?.chooseNameField || "Service name"}
            placeholder={
              flowSettings.texts?.chooseNameFieldPlaceholder || "Order Service"
            }
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
