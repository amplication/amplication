import { useContext, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import DirectoriesServiceSettingsForm from "./DirectoriesServiceSettingsForm";

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
      <DirectoriesServiceSettingsForm />
    </div>
  );
}

export default DirectoriesSettingsForm;
