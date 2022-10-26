import React, { useContext, useEffect } from "react";
import * as models from "../../models";
import "./GenerationSettingsForm.scss";
import { AppContext } from "../../context/appContext";
import DirectoriesServiceSettingsForm from "./DirectoriesServiceSettingsForm";
import DirectoriesProjectConfigurationSettingsForm from "./DirectoriesProjectConfigurationSettingsForm";

const CLASS_NAME = "generation-settings-form";

function DirectoriesSettingsForm() {
  const { currentResource } = useContext(AppContext);
  const resourceId = currentResource?.id;

  useEffect(() => {
    if (!currentResource || !resourceId) {
      return;
    }
  }, [currentResource, resourceId]);

  return (
    <div className={CLASS_NAME}>
      {currentResource?.resourceType === models.EnumResourceType.Service ? (
        <DirectoriesServiceSettingsForm />
      ) : (
        <DirectoriesProjectConfigurationSettingsForm />
      )}
    </div>
  );
}

export default DirectoriesSettingsForm;
