import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/design-system";
import React, { useCallback, useState } from "react";
import "./AddNewProject.scss";
import NewProject from "./NewProject";

const CLASS_NAME = "add-new-project";

const AddNewProject = () => {
  const [projectDialogStatus, setProjectDialogStatus] = useState<boolean>(false);

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
        title="New Project"
      >
        <NewProject onProjectCreated={handleProjectCreated} />
      </Dialog>
      <Button
        onClick={handleNewProjectClick}
        type="button"
        buttonStyle={EnumButtonStyle.Text}
        icon="plus"
        iconPosition={EnumIconPosition.Left}
        iconSize="xsmall"
      >
        <span className={`${CLASS_NAME}__label`}>Add New Project</span>
      </Button>
    </>
  );
};

export default AddNewProject;
