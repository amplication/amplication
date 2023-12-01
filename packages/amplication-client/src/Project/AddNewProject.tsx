import {
  Dialog,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import NewProject from "./NewProject";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";
import { EnhancedFeatureButton } from "../Components/FeatureButton";

const CLASS_NAME = "add-new-project";

const AddNewProject = () => {
  const [projectDialogStatus, setProjectDialogStatus] =
    useState<boolean>(false);
  const { stigg } = useStiggContext();

  const handleNewProjectClick = useCallback(() => {
    setProjectDialogStatus(!projectDialogStatus);
  }, [projectDialogStatus, setProjectDialogStatus]);

  const handleProjectCreated = useCallback(() => {
    setProjectDialogStatus(false);
  }, [setProjectDialogStatus]);

  return (
    <>
      <Dialog
        className="new-entity-dialog"
        isOpen={projectDialogStatus}
        onDismiss={handleNewProjectClick}
        title="Create new project"
      >
        <NewProject onProjectCreated={handleProjectCreated} />
      </Dialog>
      <EnhancedFeatureButton
        onClick={handleNewProjectClick}
        type="button"
        iconPosition={EnumIconPosition.Left}
        iconSize="small"
        buttonStyle={EnumButtonStyle.Primary}
        featureId={BillingFeature.Projects}
        showIcon={false}
      >
        <span className={`${CLASS_NAME}__label`}>Add New Project</span>
      </EnhancedFeatureButton>
    </>
  );
};

export default AddNewProject;
