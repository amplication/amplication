import { Dialog } from "@amplication/design-system";
import React, { useCallback, useState } from "react";
import AddNewProject from "./AddNewProject";
import NewProject from "./NewProject";
import "./NewProjectWizard.scss";

const CLASS_NAME = "new-project-wizard";

const NewProjectWizard = () => {
  const [newProject, setNewProject] = useState<boolean>(false);

  const handleNewProjectClick = useCallback(() => {
    setNewProject(!newProject);
  }, [newProject, setNewProject]);

  return (
    <div className={CLASS_NAME}>
      <Dialog
        className="new-entity-dialog"
        isOpen={newProject}
        onDismiss={handleNewProjectClick}
        title="New Project"
      >
        <NewProject />
      </Dialog>
      <AddNewProject onNewProjectClick={handleNewProjectClick} />
    </div>
  );
};

export default NewProjectWizard;
