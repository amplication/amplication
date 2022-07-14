import { Button, EnumButtonStyle, Icon } from "@amplication/design-system";
import React from "react";
import "./AddNewProject.scss";

type Props = {
  onAddNewProject: () => void;
};

const AddNewProject = ({ onAddNewProject }: Props) => {
  return (
    <Button onClick={onAddNewProject} buttonStyle={EnumButtonStyle.Text}>
      <Icon icon="plus" />
      Add description
    </Button>
  );
};

export default AddNewProject;
