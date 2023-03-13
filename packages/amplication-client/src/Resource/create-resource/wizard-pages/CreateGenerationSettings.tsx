import React from "react";
import "../CreateServiceWizard.scss";
import { CircleBadge, Icon, ToggleField } from "@amplication/design-system";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";

const className = "create-generation-settings";

const CreateGenerationSettings: React.FC<WizardStepProps> = ({
  moduleClass,
}) => {
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
        <div className={`${moduleClass}__repo_wrapper`}>
          <div className={`${moduleClass}__db_box`}>
            <div className={`${moduleClass}__db_up_buttons`}>
              <CircleBadge color={"black"} size={"small"}>
                <Icon icon="" size={"small"} />
              </CircleBadge>
              <label>GraphQL API</label>
              <ToggleField name="generateGraphQL" label="" />
            </div>
            <div className={`${moduleClass}__db_up_buttons`}>
              <CircleBadge color={"black"} size={"small"}>
                <Icon icon="" size={"small"} />
              </CircleBadge>
              <label>REST API & Swagger UI</label>
              <ToggleField name="generateRestApi" label="" />
            </div>
          </div>
          <div className={`${moduleClass}__db_box`}>
            <div className={`${moduleClass}__db_up_buttons`}>
              <CircleBadge color={"black"} size={"small"}>
                <Icon icon="" size={"small"} />
              </CircleBadge>
              <label>Admin UI</label>
              <ToggleField name="generateAdminUI" label="" />
            </div>
          </div>
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGenerationSettings;
