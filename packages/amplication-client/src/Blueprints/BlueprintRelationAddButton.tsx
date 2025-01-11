import {
  Button,
  Dialog,
  EnumButtonStyle,
  Tooltip,
} from "@amplication/ui/design-system";
import React, { useState } from "react";
import * as models from "../models";
import BlueprintRelationForm from "./BlueprintRelationForm";

type Props = {
  blueprint: models.Blueprint;
  onSubmit: (relation: models.BlueprintRelation) => void;
  buttonStyle?: EnumButtonStyle;
  buttonContent?: React.ReactNode;
};

const DEFAULT_RELATION_VALUES: models.BlueprintRelation = {
  name: "",
  description: "",
  allowMultiple: false,
  key: "",
  relatedTo: "",
  required: false,
};

const BlueprintRelationAddButton = ({
  blueprint,
  onSubmit,
  buttonContent = "Add Relation",
  buttonStyle = EnumButtonStyle.Outline,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (relation: models.BlueprintRelation) => {
    setIsOpen(false);
    onSubmit(relation);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Relation"
      >
        {isOpen && (
          <BlueprintRelationForm
            blueprintRelation={DEFAULT_RELATION_VALUES}
            onSubmit={handleSubmit}
          />
        )}
      </Dialog>

      <Tooltip title="Add Relation">
        <Button
          buttonStyle={buttonStyle}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {buttonContent}
        </Button>
      </Tooltip>
    </>
  );
};

export default BlueprintRelationAddButton;
