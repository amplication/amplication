import React, { useCallback } from "react";
import "../CreateServiceWizard.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";
import authModuleImage from "../../../assets/images/auth-module.svg";
import ImgSvg from "./ImgSvg";

const CreateServiceAuth: React.FC<WizardStepProps> = ({ formik }) => {
  const AuthCoreSvg = ImgSvg({ image: authModuleImage });

  const handleAuthSelect = useCallback(
    (authType: string) => {
      formik.setValues(
        {
          ...formik.values,
          authType,
        },
        true
      );
    },
    [formik.values]
  );

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Does your service need Authentication?"
          text={`Choose whether or not to enable authentication and authorization for  your service.`}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.SelectorWrapper>
          <LabelDescriptionSelector
            name="core"
            image={AuthCoreSvg}
            label="Include Auth Module"
            description="Generate the code needed for authentication and authorization"
            onClick={handleAuthSelect}
            currentValue={formik.values.authType}
          />
          <LabelDescriptionSelector
            name="no"
            icon="unlock"
            label="Skip Authentication"
            description="Do not include code for authentication"
            onClick={handleAuthSelect}
            currentValue={formik.values.authType}
          />
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceAuth;
