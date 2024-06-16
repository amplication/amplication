import { Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import NewProject from "./NewProject";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";
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
      <FeatureIndicatorContainer
        featureId={BillingFeature.Projects}
        entitlementType={EntitlementType.Metered}
        limitationText="You have reached the maximum number of projects allowed. "
      >
        <Button
          onClick={handleNewProjectClick}
          type="button"
          iconSize="small"
          buttonStyle={EnumButtonStyle.Primary}
        >
          <span className={`${CLASS_NAME}__label`}>Add New Project</span>
        </Button>
      </FeatureIndicatorContainer>
    </>
  );
};

export default AddNewProject;
