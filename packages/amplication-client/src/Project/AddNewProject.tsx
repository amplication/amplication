import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import NewProject from "./NewProject";

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
      <Button
        onClick={handleNewProjectClick}
        type="button"
        iconPosition={EnumIconPosition.Left}
        iconSize="small"
        buttonStyle={EnumButtonStyle.Primary}
      >
        <span className={`${CLASS_NAME}__label`}>Add New Project</span>
      </Button>
    </>
  );
};

export default AddNewProject;
