import React, { MutableRefObject, useRef } from "react";
import "./CreateServiceWizard.scss";
import { serviceSettingsFieldsInitValues } from "../constants";
import {
  CreateServiceWizardForm,
  serviceSettings,
} from "./CreateServiceWizardForm";

const CreateGenerationSettings: React.FC<{ moduleClass }> = ({
  moduleClass,
}) => {
  const serviceSettingsFields: MutableRefObject<serviceSettings> = useRef(
    serviceSettingsFieldsInitValues
  ); //todo: update appContext instead

  const handleSubmitResource = (currentServiceSettings: serviceSettings) => {
    serviceSettingsFields.current = currentServiceSettings;
  };

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
        <CreateServiceWizardForm handleSubmitResource={handleSubmitResource} />
      </div>
    </div>
  );
};

export default CreateGenerationSettings;
