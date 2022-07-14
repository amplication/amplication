import { Button, EnumButtonStyle, EnumIconPosition } from "@amplication/design-system";
import React from "react";
import "./AddNewProject.scss";

type Props = {
  onNewProjectClick: () => void;
};

const AddNewProject = ({ onNewProjectClick }: Props) => {
  return (
    <Button
      onClick={onNewProjectClick}
      type="button"
      buttonStyle={EnumButtonStyle.Text}
      icon="plus"
      iconPosition={EnumIconPosition.Left}
      iconSize="xsmall"
    >
      Add New Project
    </Button>
  );
};

export default AddNewProject;
