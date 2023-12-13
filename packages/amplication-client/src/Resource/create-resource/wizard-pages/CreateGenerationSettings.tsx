import React, { useEffect } from "react";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { ImageLabelToggle } from "./ImageLabelToggle";
import { WizardStepProps } from "./interfaces";

import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import adminUI from "../../../assets/images/admin-ui.svg";
import graphql from "../../../assets/images/graphql.svg";
import swagger from "../../../assets/images/swagger.svg";

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
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.Tag}>
            Note: The Admin UI uses the GraphQL API, so you can't select the
            former without the latter
          </Text>
        </FlexItem>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGenerationSettings;
