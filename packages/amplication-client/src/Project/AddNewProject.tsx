import { Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import NewProject from "./NewProject";
import { BillingFeature } from "../util/BillingFeature";
import {
  EntitlementType,
  FeatureControlContainer,
} from "../Components/FeatureControlContainer";
import { Button } from "../Components/Button";

const CLASS_NAME = "add-new-project";

const AddNewProject = () => {
  const [projectDialogStatus, setProjectDialogStatus] =
    useState<boolean>(false);

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
      <FeatureControlContainer
        featureId={BillingFeature.Projects}
        entitlementType={EntitlementType.Metered}
      >
        <Button
          onClick={handleNewProjectClick}
          type="button"
          iconSize="small"
          buttonStyle={EnumButtonStyle.Primary}
        >
          <span className={`${CLASS_NAME}__label`}>Add New Project</span>
        </Button>
      </FeatureControlContainer>
    </>
  );
};

export default AddNewProject;
