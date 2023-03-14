import React from "react";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";
import { IconLabelToggle } from "./IconLabelToggle";

const CreateGenerationSettings: React.FC<WizardStepProps> = () => {
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
          <IconLabelToggle
            icon="graphql"
            label="GraphQL API"
            name="generateGraphQL"
          />
          <IconLabelToggle
            icon="graphql"
            label="REST API & Swagger UI"
            name="generateGraphQL"
          />
          <IconLabelToggle
            icon="graphql"
            label="Admin UI"
            name="generateGraphQL"
          />
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGenerationSettings;
