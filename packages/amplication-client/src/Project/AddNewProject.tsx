import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/design-system";
import React, { useCallback, useState } from "react";
import { Project } from "../models";
import "./AddNewProject.scss";
import NewProject from "./NewProject";

const CLASS_NAME = "add-new-project";

type Props = {
  onProjectCreated: (project: Project) => void;
};

const AddNewProject = ({ onProjectCreated }: Props) => {
  const [newProject, setNewProject] = useState<boolean>(false);

  const handleNewProjectClick = useCallback(() => {
    setNewProject(!newProject);
  }, [newProject, setNewProject]);

  const handleProjectCreated = useCallback((data: Project) => {
    setNewProject(false);
    onProjectCreated(data);
  }, [onProjectCreated, setNewProject]);

  return (
    <>
      <Dialog
        className="new-entity-dialog"
        isOpen={newProject}
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
