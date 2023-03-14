import React from "react";

import "./CreateGenerationSettings.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";
import { IconDescriptionToggle } from "./IconDescriptionToggle";

const className = "create-generation-settings";

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
        <div className={`${className}__db_box`}>
          <IconDescriptionToggle
            icon="graphql"
            description="GraphQL API"
            name="generateGraphQL"
          />
          <IconDescriptionToggle
            icon="graphql"
            description="REST API & Swagger UI"
            name="generateGraphQL"
          />
          <IconDescriptionToggle
            icon="graphql"
            description="Admin UI"
            name="generateGraphQL"
          />
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGenerationSettings;
