import { EnumContentAlign, FlexItem } from "@amplication/ui/design-system";
import { LabelDescriptionSelector } from "../../Resource/create-resource/wizard-pages/LabelDescriptionSelector";
import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/appContext";

export const ImportSchemaSuccess = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const history = useHistory();
  const handleGoToEntitiesScreen = useCallback(() => {
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`
    );
  }, [currentProject.id, currentResource.id, currentWorkspace.id, history]);

  const handleAIHelper = useCallback(() => {
    console.log("AI Helper");
  }, []);

  return (
    <div>
      <FlexItem contentAlign={EnumContentAlign.Center}>
        <LabelDescriptionSelector
          name="Go to Entities Screen"
          image=""
          label="Go to Entities Screen"
          description="Check the entities created based on the schema"
          onClick={handleGoToEntitiesScreen}
          currentValue={""}
        />
        <LabelDescriptionSelector
          name="AI Helper"
          image=""
          label="AI Helper"
          description="Recommendation for dividing the service and entities into
      microservices"
          onClick={handleAIHelper}
          currentValue={""}
        />
      </FlexItem>
    </div>
  );
};
