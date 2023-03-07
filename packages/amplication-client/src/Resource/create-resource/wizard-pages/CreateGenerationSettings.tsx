import React from "react";
import "../CreateServiceWizard.scss";
import {} from "../CreateServiceWizardForm";
import { CircleBadge, Icon, ToggleField } from "@amplication/design-system";

const CreateGenerationSettings: React.FC<{ moduleClass }> = ({
  moduleClass,
}) => {
  return (
    <div className={`${moduleClass}__splitWrapper`}>
      <div className={`${moduleClass}__left`}>
        <div className={`${moduleClass}__description`}>
          <h2>How would you like to build your service?</h2>
        </div>
        <div className={`${moduleClass}__description_bottom`}>
          <h3>
            Do you want to use GraphQL API? REST API? both?� Also, select
            whether you want to generate the Admin UI for your service with
            forms to create, update and delete data in your service. � Note: The
            Admin UI is using the GraphQL API so you can’t generate the one
            without the other.
          </h3>
        </div>
      </div>
      <div className={`${moduleClass}__right`}>
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
      </div>
    </div>
  );
};

export default CreateGenerationSettings;
