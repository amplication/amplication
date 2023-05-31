import React, { useEffect } from "react";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";
import { ImageLabelToggle } from "./ImageLabelToggle";

import graphql from "../../../assets/images/graphql.svg";
import swagger from "../../../assets/images/swagger.svg";
import adminUI from "../../../assets/images/admin-ui.svg";

const CreateGenerationSettings: React.FC<WizardStepProps> = ({
  formik,
  trackWizardPageEvent,
}) => {
  useEffect(() => {
    if (!formik.values.generateGraphQL) {
      formik.values.generateAdminUI &&
        formik.setValues({
          ...formik.values,
          generateAdminUI: false,
        });
    }
  }, [formik.values]);

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="How would you like to build your service?"
          text={`Do you want to use GraphQL API? REST API? both?

            Also, select whether you want to generate the Admin UI for your service with forms to create, update and delete data in your service.
            
            Note: The Admin UI is using the GraphQL API so you can’t generate the one without the other.
          `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.SelectorWrapper>
          <ImageLabelToggle
            name="generateGraphQL"
            image={graphql}
            label="GraphQL API"
            value={formik.values.generateGraphQL}
            onChange={formik.setFieldValue}
          />
          <ImageLabelToggle
            name="generateRestApi"
            image={swagger}
            label="REST API & Swagger UI"
            value={formik.values.generateRestApi}
            onChange={formik.setFieldValue}
          />
          <ImageLabelToggle
            name="generateAdminUI"
            image={adminUI}
            disabled={!formik.values.generateGraphQL}
            label="Admin UI"
            value={formik.values.generateAdminUI}
            onChange={formik.setFieldValue}
          />
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGenerationSettings;
