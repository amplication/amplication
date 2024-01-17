import { EnumContentAlign, FlexItem } from "@amplication/ui/design-system";
import { UploadSchemaStateProps } from "./uploadSchemaState";
import { LabelDescriptionSelector } from "../../Resource/create-resource/wizard-pages/LabelDescriptionSelector";
import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/appContext";

export const ImportSchemaSuccess = ({ className }: UploadSchemaStateProps) => {
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
    <div className={`${className}__header`}>
      <h2>Schema import completed successfully!</h2>
      <div className={`${className}__message`}>
        Ready to take the next step? Choose your action.
      </div>
      <FlexItem
        contentAlign={EnumContentAlign.Center}
        className={`${className}__import-success`}
      >
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
