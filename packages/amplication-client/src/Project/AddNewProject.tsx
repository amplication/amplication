import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/design-system";
import React from "react";
import "./AddNewProject.scss";

const CLASS_NAME = "add-new-project";

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
      <span className={`${CLASS_NAME}__label`}>Add New Project</span>
    </Button>
  );
};

export default AddNewProject;
